import React, { useState, useEffect, useRef, JSX } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket/index";
import { Participant } from "../types/participant";
import SoulCirclePanel from "./SoulCirclePanel";
import { GliffMessage } from "../types/gliffMessage";
import GliffLog from "./GliffMessageComponent/GliffLog";

type PointerMap = Record<string, string>;

export default function TableView(): JSX.Element {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");
  const isParticipant = mode === "participant";
  const me = queryParams.get("name") || "Guest";
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pointerMap, setPointerMap] = useState<PointerMap>({});
  const [liveSpeakerName, setLiveSpeakerName] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [actionLog, setActionLog] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
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
  const [isSyncActive, setIsSyncActive] = useState(false);
  const [visibleLog, setVisibleLog] = useState<string | null>(null);
  const [glowKey, setGlowKey] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  const [prompt, setPrompt] = useState<{
    icon: string;
    message: string;
    actions: { label: string; onClick: () => void }[];
  } | null>(null);

  const isMeLive = liveSpeakerName === me;

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
  };

  useEffect(() => {
    socket.on("gliffLog:update", (entries: GliffMessage[]) => {
      if (!Array.isArray(entries)) return;
      setGliffLog(entries);
    });

    return () => {
      socket.off("gliffLog:update");
    };
  }, []);

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
      }
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
      }
    );

    socket.on(
      "initial-pointer-map",
      (entries: { from: string; to: string }[]) => {
        const map: PointerMap = {};
        for (const { from, to } of entries) map[from] = to;
        setPointerMap(map);
      }
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
  }, [me, isParticipant]);

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
  }, [isParticipant, me]);
  useEffect(() => {
    const handleUnload = () => {
      socket.emit("leave", { name: me });
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [me]);

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

  const radiusX = svgCenter.x * (isMobile ? 0.85 : 1.1);
  const radiusY = svgCenter.y * (isMobile ? 0.8 : 0.95);
  const positions: Record<string, { x: number; y: number }> = {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-100 p-4 flex flex-col items-center justify-start text-gray-800">
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

          return (
            <div
              key={user.name}
              className="absolute flex flex-col items-center text-center z-10 transition-transform"
              style={{ transform: `translate(${x}px, ${y}px)` }}>
              <div className="font-semibold text-xs sm:text-sm mb-1 truncate max-w-[80px]">
                {user.name}
              </div>
              <div
                className={`w-14 h-14 sm:w-24 sm:h-24 rounded-full overflow-hidden relative border-4 shadow-lg ${
                  isMe
                    ? "border-emerald-600 ring-4 ring-emerald-300"
                    : "border-white"
                }`}>
                <img
                  src={
                    avatarMap[user.avatarId] ||
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
                  <div className="bg-red-500 text-white px-2 py-[2px] rounded-full text-xs">
                    Live
                  </div>
                )}
                {isMe && (
                  <div className="text-[10px] text-emerald-600 font-medium">
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

      <div className="w-full px-2 mt-[32px] sm:mt-[20px]">
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
      <p className="mt-8 mb-12 text-sm text-gray-500 text-center max-w-sm">
        Choose one to listen to. When all align, a voice is born.
      </p>
    </div>
  );
}
