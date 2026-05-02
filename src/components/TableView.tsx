import React, { useState, useEffect, useRef, JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket/index";
import { Participant } from "../types/participant";
import SoulCirclePanel from "./SoulCirclePanel";
import { GliffMessage } from "../types/gliffMessage";
import GliffLog from "./GliffMessageComponent/GliffLog";
import SessionTimer from "./SessionTimer";
import SessionLengthPicker from "./SessionLengthPicker";
import { clearTableSession } from "../utils/tableSession";
import RoundReadinessRow from "./RoundReadinessRow";

type PointerMap = Record<string, string>;

export default function TableView(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");
  const isParticipant = mode === "participant";
  const me = queryParams.get("name") || "Guest";
  const tableId = queryParams.get("tableId"); // Extract tableId from query params

  // Log tableId for debugging
  useEffect(() => {
    if (tableId) {
      console.log(`🎯 [TableView] Joined table: ${tableId}`);
    }
  }, [tableId]);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pointerMap, setPointerMap] = useState<PointerMap>({});
  const [liveSpeakerName, setLiveSpeakerName] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logs, setLogs] = useState<string[]>([]);
  const [actionLog, setActionLog] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [textLogs, setTextLogs] = useState<
    { userName: string; text: string; timestamp: number }[]
  >([]);
  const [gliffLog, setGliffLog] = useState<GliffMessage[]>([]);
  const lastKeyRef = useRef<string | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const participantsRef = useRef<Participant[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCenter, setSvgCenter] = useState({ x: 350, y: 250 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSyncActive, setIsSyncActive] = useState(false);
  const [visibleLog, setVisibleLog] = useState<string | null>(null);
  const [glowKey, setGlowKey] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [panelMode, setPanelMode] = useState<"peek" | "expanded">("peek");
  const [touchStartY, setTouchStartY] = useState(0);

  // Content Phase & Rounds state
  const [roundData, setRoundData] = useState<{
    roundId: string;
    roundNumber: number;
    glyphText: string;
    subjectKey: string;
    status: "active" | "ended";
  } | null>(null);

  const [readinessData, setReadinessData] = useState<{
    readyCount: number;
    totalCount: number;
    readyUserIds: string[];
  } | null>(null);

  const [prompt, setPrompt] = useState<{
    icon: string;
    message: string;
    actions: { label: string; onClick: () => void }[];
  } | null>(null);

  const isMeLive = liveSpeakerName === me;

  // Session end handler
  const handleSessionEnd = () => {
    // Handle session end - could redirect to home or show message
    console.log("Session ended!");
    // Optional: redirect to home
    // window.location.href = "/";
  };

  // Session management functions
  const handleSessionSelect = (durationMinutes: number) => {
    console.log(`🚀 Starting session for ${durationMinutes} minutes...`);
    socket.emit("start-session", { durationMinutes });
    setShowSessionPicker(false);
  };

  const handleSessionPickerClose = () => {
    console.log("🚫 Session picker closed by user");
    setShowSessionPicker(false);
  };

  // Debug effect to track session picker state changes
  useEffect(() => {
    console.log("🔍 Session picker state changed:", showSessionPicker);
  }, [showSessionPicker]);

  const avatarMap: Record<string, string> = {
    Elemental: process.env.PUBLIC_URL + "/avatars/avatar-Elemental.png",
    Monk: process.env.PUBLIC_URL + "/avatars/avatar-Monk.png",
    Ninja: process.env.PUBLIC_URL + "/avatars/avatar-Ninja.png",
    Pharaoh: process.env.PUBLIC_URL + "/avatars/avatar-Pharaoh.png",
    Wolves: process.env.PUBLIC_URL + "/avatars/avatar-Wolves.png",
    Pirate: process.env.PUBLIC_URL + "/avatars/avatar-Pirate.png",
    Panda: process.env.PUBLIC_URL + "/avatars/avatar-Panda.png",
    Farmer: process.env.PUBLIC_URL + "/avatars/avatar-Farmer.png",
    TennisPlayer: process.env.PUBLIC_URL + "/avatars/avatar-TennisPlayer.png",
    Chipmunks: process.env.PUBLIC_URL + "/avatars/avatar-Chipmunks.png",
    BabyDragon: process.env.PUBLIC_URL + "/avatars/avatar-BabyDragon.png",
    Baby: process.env.PUBLIC_URL + "/avatars/avatar-Baby.png",
    Ghost: process.env.PUBLIC_URL + "/avatars/avatar-Ghost.png",
  };

  useEffect(() => {
    socket.on("gliffLog:update", (entries: GliffMessage[]) => {
      if (!Array.isArray(entries)) return;
      setGliffLog(entries);
    });

    // Session picker handlers
    socket.on("show-session-picker", (data) => {
      console.log("🎯 Received show-session-picker event", data);
      setShowSessionPicker(true);
    });

    // Debug event to track session picker status
    socket.on("debug-session-picker-status", (data) => {
      console.log("🔍 Debug session picker status:", data);
    });

    // Session start error handler
    socket.on("session-start-rejected", (data) => {
      console.error("❌ Session start rejected:", data.reason);
      alert(`Failed to start session: ${data.reason}`);
    });

    // Session started successfully
    socket.on("session-started", (data) => {
      console.log("✅ Session started:", data);
      setShowSessionPicker(false);
    });

    // Session ended - show message and prepare for navigation
    socket.on("session-ended", (data) => {
      console.log("⏰ Session ended:", data);
      if (data.message) {
        alert(data.message);
      }
      // The server will send a force-navigate-home event after the countdown
    });

    // Force navigation to home page
    socket.on("force-navigate-home", (data) => {
      console.log("🏠 Navigating to home page:", data);
      navigate("/");
    });

    // Content Phase & Rounds: Round state updates
    socket.on(
      "round:state",
      (data: {
        roundId: string;
        roundNumber: number;
        glyphText: string;
        subjectKey: string;
        status: "active" | "ended";
      }) => {
        console.log("🔮 [Round] State update:", data);
        setRoundData(data);
      },
    );

    // Content Phase & Rounds: Readiness updates
    socket.on(
      "round:readiness",
      (data: { ready: number; total: number; readyUserIds: string[] }) => {
        console.log("✅ [Round] Readiness update:", data);
        // Map backend property names to frontend expectations
        setReadinessData({
          readyCount: data.ready,
          totalCount: data.total,
          readyUserIds: data.readyUserIds,
        });
      },
    );

    return () => {
      socket.off("gliffLog:update");
      socket.off("show-session-picker");
      socket.off("debug-session-picker-status");
      socket.off("session-start-rejected");
      socket.off("session-started");
      socket.off("session-ended");
      socket.off("force-navigate-home");
      socket.off("round:state");
      socket.off("round:readiness");
    };
  }, [navigate]);

  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSvgCenter({
          x: rect.width / 2,
          y: rect.height / 2,
        });
        setIsMobile(window.innerWidth < 640);
      }
    };
    updateCenter();
    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, []);

  useEffect(() => {
    socket.on("user-list", (userList) => {
      participantsRef.current = userList;
      setParticipants(userList);
    });

    socket.on(
      "update-pointing",
      ({ from, to }: { from: string; to: string }) => {
        setPointerMap((prev) => ({ ...prev, [from]: to }));
        if (from === me) {
          // setSelectedTarget(to); // Keeps UI logic synced
        }
      },
    );

    socket.on("action-log", (msg: string) => {
      if (actionLog) {
        setActionLog(null); // fade out
        setTimeout(() => {
          setActionLog(msg); // trigger fade-in
          setGlowKey((prev) => prev + 1); // pulse glow too
          setFadeKey((prev) => prev + 1);
        }, 700); // match duration
      } else {
        setActionLog(msg); // fade in directly
        setFadeKey((prev) => prev + 1);
        setGlowKey((prev) => prev + 1);
      }
    });

    socket.on("system-log", (msg: string) => {
      setVisibleLog(msg); // fade in
      setFadeKey((prev) => prev + 1); // restart animation if needed

      setTimeout(() => {
        setVisibleLog(null); // fade out
      }, 3000); // show for 3 seconds
    });

    socket.on(
      "textlog:entry",
      (entry: { userName: string; text: string; timestamp: number }) => {
        setTextLogs((prev) => [...prev, entry]);
        console.log("[TextLog]", entry);
      },
    );

    socket.on(
      "initial-pointer-map",
      (entries: { from: string; to: string }[]) => {
        const map: PointerMap = {};
        for (const { from, to } of entries) map[from] = to;
        setPointerMap(map);
      },
    );

    socket.on("live-speaker", ({ name }: { name: string }) => {
      setLiveSpeakerName(name);
      setIsSyncActive(true);
    });

    socket.on("live-speaker-cleared", () => {
      setLiveSpeakerName(null);
      setIsSyncActive(false);
    });

    socket.on("mic-dropped", ({ name }) => {
      if (name === me) return; // 🛡️ don't prompt the dropper

      showPrompt({
        icon: "🎤",
        message: `${name} dropped the mic. Pick it up?`,
        actions: [
          {
            label: "Raise Hand",
            onClick: () => socket.emit("pointing", { from: me, to: me }),
          },
          {
            label: "Not now",
            onClick: () => {
              // optional: emit something or just close
            },
          },
        ],
      });
    });

    function showPrompt({
      icon,
      message,
      actions,
    }: {
      icon: string;
      message: string;
      actions: { label: string; onClick: () => void }[];
    }) {
      setPrompt({ icon, message, actions });
    }

    return () => {
      socket.off("user-list");
      socket.off("update-pointing");
      socket.off("initial-pointer-map");
      socket.off("live-speaker");
      socket.off("live-speaker-cleared");
      socket.off("log-event");
    };
  }, [me, isParticipant, actionLog]); // Added actionLog to dependencies

  const hasJoined = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!hasJoined.current && isParticipant && me) {
      const alreadyJoined = participants.some((p) => p.name === me);
      if (!alreadyJoined) {
        socket.emit("joined-table", { name: me });
        hasJoined.current = true;
        console.log("[Client] ✅ Emitted joined-table once:", me);
      }
    }
  }, [isParticipant, me, participants]); // Added participants to dependencies

  // ❌ REMOVED: Do NOT emit leave on beforeunload/refresh
  // Page refresh should trigger disconnect → GHOST, not leave → removed
  // Only explicit user actions (button clicks) should emit leave

  // Handle session-ended and explicit leave navigation
  useEffect(() => {
    const handleNavigateHome = () => {
      // Clear session when forced to navigate home (session ended)
      clearTableSession();
    };

    socket.on("force-navigate-home", handleNavigateHome);

    return () => {
      socket.off("force-navigate-home", handleNavigateHome);
    };
  }, []);

  const handleLogInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (lastKeyRef.current === "Backspace") return;

    console.log("sending:", me + value);
    socket.emit("logBar:update", {
      text: value.slice(-1),
      userName: me,
    });
  };

  const handleLogKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    lastKeyRef.current = e.key;

    if (e.key === "Backspace") {
      socket.emit("logBar:update", {
        text: "__BACKSPACE__",
        userName: me,
      });
    }
  };

  // Touch handlers for mobile bottom sheet panel
  const handlePanelTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handlePanelTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const deltaY = e.touches[0].clientY - touchStartY;
    if (deltaY > 60) setPanelMode("peek");
    if (deltaY < -60) setPanelMode("expanded");
  };

  const handleHeaderTap = () => {
    if (!isMobile) return;
    setPanelMode((prev) => (prev === "peek" ? "expanded" : "peek"));
  };

  // Auto-expand panel when user becomes the live speaker
  useEffect(() => {
    if (isMeLive) {
      setPanelMode("expanded");
    }
  }, [isMeLive]);

  const radiusX = svgCenter.x * (isMobile ? 0.85 : 1.1);
  const radiusY = svgCenter.y * (isMobile ? 0.8 : 0.95);
  const positions: Record<string, { x: number; y: number }> = {};

  return (
    <div
      data-testid="table-view"
      className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-100 p-4 flex flex-col items-center justify-start text-gray-800"
      style={isMobile ? { paddingBottom: "calc(30vh + 16px)" } : undefined}>
      {/* Leave Button - Top Left Corner */}
      <button
        onClick={() => {
          if (isLeaving) return; // Prevent double-click

          console.log(`👋 ${me} leaving table...`);
          setIsLeaving(true);

          socket.emit("leave", { name: me, tableId }, (response: any) => {
            console.log("✅ Leave confirmed by server", response);

            if (response?.success) {
              clearTableSession();
              navigate("/");
            } else {
              console.error("❌ Leave failed", response);
              setIsLeaving(false);
              alert("Failed to leave table. Please try again.");
            }
          });
        }}
        disabled={isLeaving}
        data-testid="leave-button"
        className={`absolute top-4 left-4 px-4 py-2 ${isLeaving ? "bg-rose-400 cursor-not-allowed" : "bg-rose-500 hover:bg-rose-600"} text-white font-semibold rounded-lg shadow-md transition-colors duration-200 z-50 flex items-center gap-2`}
        aria-label="Leave table">
        <span className="text-lg">←</span>
        <span className="hidden sm:inline">
          {isLeaving ? "Leaving..." : "Leave"}
        </span>
      </button>

      {/* <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 mt-2 sm:mt-3 text-center z-20"> */}
      <div className="h-6 w-full flex justify-center items-center transition-opacity duration-700 mt-1 mb-2">
        <span
          key={fadeKey}
          className={`text-black font-serif text-sm sm:text-base transition-opacity duration-700 ease-in-out ${
            visibleLog ? "opacity-100" : "opacity-0"
          }`}>
          {visibleLog || "‎"}
        </span>
      </div>

      {/* Session Timer - positioned above the table title */}
      <SessionTimer onSessionEnd={handleSessionEnd} />

      <h1 className="text-2xl sm:text-3xl font-bold sm:mt-1 mb-6 text-center z-20">
        SoulCircle Table
      </h1>
      <div
        ref={containerRef}
        className="relative w-full max-w-[700px] aspect-[5/6] sm:aspect-[7/5] bg-white rounded-full shadow-2xl border-4 border-emerald-100 flex items-center justify-center overflow-visible">
        <div className="w-[80%] max-w-[380px] sm:w-[380px] aspect-[3/4] relative flex items-center justify-center z-10 pointer-events-auto">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL}/backgrounds/glif-background6.png)`,
              backgroundSize: isMobile ? "120%" : "133%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: isMobile ? "64% -84px" : "60% -136px",
              opacity: 0.7,
              zIndex: -1,
            }}
          />
          <>
            <GliffLog entries={gliffLog} me={me} />
          </>
        </div>
        {participants.map((user, i) => {
          const angle = (i / participants.length) * 2 * Math.PI + Math.PI / 2;
          const x = radiusX * Math.cos(angle);
          const y = radiusY * Math.sin(angle);
          const isMe = user.name === me;
          const isLive = user.name === liveSpeakerName;
          const isPointingAtSelf = pointerMap[user.name] === user.name;
          positions[user.name] = { x, y };
          const isGhost =
            (user as any).presence === "GHOST" ||
            (user as any).state === "ghost";

          return (
            <div
              key={user.name}
              data-testid={`participant-${user.name}`}
              className={`absolute flex flex-col items-center text-center z-10 transition-all ${
                isGhost ? "opacity-50" : ""
              }`}
              style={{ transform: `translate(${x}px, ${y}px)` }}>
              <div
                data-testid={`participant-name-${user.name}`}
                className="font-semibold text-xs sm:text-sm mb-1 truncate max-w-[80px]">
                {user.name}
                {isGhost && " 👻"}
              </div>
              <div
                className={`w-14 h-14 sm:w-24 sm:h-24 rounded-full overflow-hidden relative border-4 shadow-lg ${
                  isMe
                    ? "border-emerald-600 ring-4 ring-emerald-300"
                    : isGhost
                      ? "border-gray-400 opacity-60"
                      : "border-white"
                }`}>
                <img
                  src={
                    isGhost
                      ? avatarMap["Ghost"] ||
                        `${process.env.PUBLIC_URL}/avatars/avatar-Ghost.png`
                      : avatarMap[user.avatarId] ||
                        `${process.env.PUBLIC_URL}/avatars/avatar-monk.png`
                  }
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs whitespace-nowrap">
                {isPointingAtSelf && (
                  <div className="text-yellow-500 text-lg">☝️</div>
                )}
                {isLive && (
                  <div
                    data-testid={`participant-live-${user.name}`}
                    className="bg-red-500 text-white px-2 py-[2px] rounded-full text-xs">
                    Live
                  </div>
                )}
                {isMe && (
                  <div
                    data-testid={`participant-you-${user.name}`}
                    className="text-[10px] text-emerald-600 font-medium">
                    You
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            {Object.keys(pointerMap).map((from) => (
              <marker
                key={from}
                id={`arrowhead-${from}`}
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
                fill="green">
                <polygon points="0 0, 10 3.5, 0 7" />
              </marker>
            ))}
          </defs>
          {Object.entries(pointerMap).map(([from, to]) => {
            if (!positions[from] || !positions[to] || from === to) return null;
            return (
              <line
                key={from}
                x1={positions[from].x + svgCenter.x}
                y1={positions[from].y + svgCenter.y}
                x2={positions[to].x + svgCenter.x}
                y2={positions[to].y + svgCenter.y}
                stroke="green"
                strokeWidth="2"
                markerEnd={`url(#arrowhead-${from})`}
                strokeDasharray="4"
                className="animate-[dash_1.5s_linear_infinite]"
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-[32px] sm:mt-[60px] relative z-20 flex justify-center w-full px-4">
        <div
          key={glowKey} // forces a re-render of the animated div
          className="min-w-[20rem] max-w-md h-10 sm:h-11 px-6 rounded-full bg-emerald-100/80 text-emerald-900 shadow-md backdrop-blur-md font-serif tracking-wide italic text-sm sm:text-base flex items-center justify-center transition-all duration-500 animate-glow">
          <span
            className={`opacity-${
              actionLog ? "100" : "0"
            } transition-opacity duration-700 ease-in-out`}>
            {actionLog}
          </span>
        </div>
      </div>

      {/* Round Readiness Row — desktop only (mobile lives inside the panel) */}
      {!isMobile &&
        roundData &&
        roundData.status === "active" &&
        readinessData &&
        isParticipant && (
          <div className="mt-6 relative z-50 flex justify-center w-full">
            <RoundReadinessRow
              readyCount={readinessData.readyCount}
              totalCount={readinessData.totalCount}
              readyUserIds={readinessData.readyUserIds}
              isUserReady={readinessData.readyUserIds.includes(me)}
            />
          </div>
        )}

      {/* Smart Mobile Control Panel — fixed bottom sheet (mobile only) */}
      {isMobile ? (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 flex flex-col transition-[height] duration-300 ease-in-out"
          style={{ height: panelMode === "peek" ? "30vh" : "40vh" }}>
          {/* Sheet background */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-t-2xl shadow-2xl -z-10" />

          {/* Drag handle — tap or swipe to toggle size */}
          <div
            className="flex justify-center pt-2 pb-1 shrink-0 cursor-pointer select-none"
            onTouchStart={handlePanelTouchStart}
            onTouchMove={handlePanelTouchMove}
            onClick={handleHeaderTap}>
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Round Readiness Row — pinned inside panel top on mobile */}
          {roundData &&
            roundData.status === "active" &&
            readinessData &&
            isParticipant && (
              <div className="shrink-0 px-4 pb-1 flex justify-center">
                <RoundReadinessRow
                  readyCount={readinessData.readyCount}
                  totalCount={readinessData.totalCount}
                  readyUserIds={readinessData.readyUserIds}
                  isUserReady={readinessData.readyUserIds.includes(me)}
                />
              </div>
            )}

          {/* Panel content — always visible, internal scroll */}
          {isParticipant && (
            <div className="flex-1 px-4 pb-3 overflow-y-auto overscroll-contain">
              <SoulCirclePanel
                me={me}
                isMeLive={isMeLive}
                userInput={userInput}
                handleLogInput={handleLogInput}
                handleLogKeyDown={handleLogKeyDown}
              />
            </div>
          )}
        </div>
      ) : (
        /* Desktop: regular flow layout — unchanged */
        <div className="mt-[32px] sm:mt-[20px] w-full px-2">
          <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md rounded-xl shadow-md p-4 flex flex-wrap justify-center gap-2">
            {isParticipant && (
              <SoulCirclePanel
                me={me}
                isMeLive={isMeLive}
                userInput={userInput}
                handleLogInput={handleLogInput}
                handleLogKeyDown={handleLogKeyDown}
              />
            )}
          </div>
        </div>
      )}

      {prompt && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-300 px-4 py-3 z-50 max-w-sm w-full text-center">
          <div className="text-xl mb-2">{prompt.icon}</div>
          <div className="text-sm text-gray-800 mb-3">{prompt.message}</div>
          <div className="flex justify-center gap-2">
            {prompt.actions.map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  action.onClick();
                  setPrompt(null); // auto-dismiss on click
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-sm rounded">
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* <p className="mt-6 text-sm text-gray-500 text-center max-w-sm"> */}
      <p className="mt-8 mb-12 text-sm text-gray-500 text-center max-w-sm hidden md:block">
        Choose one to listen to. When all align, a voice is born.
      </p>

      {/* Session Length Picker Modal */}
      <SessionLengthPicker
        isOpen={showSessionPicker}
        onClose={handleSessionPickerClose}
        onSelect={handleSessionSelect}
      />
    </div>
  );
}
