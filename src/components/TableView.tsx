import React, { useState, useEffect, useRef, JSX } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket/index";
// import AttentionSelector from "./AttentionSelector";
import { Participant } from "../types/participant";
// import ListenerSyncPanel from "./ListenersPanel";
// import SpeakerPanel from "./SpeakersPanel";
// import { GestureButton } from "../types/gestureButtons";
import SoulCirclePanel from "./SoulCirclePanel";

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
  // const [panelHidden, setPanelHidden] = useState<boolean>(false);
  // const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const participantsRef = useRef<Participant[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCenter, setSvgCenter] = useState({ x: 350, y: 250 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isSyncActive, setIsSyncActive] = useState(false);
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
    socket.on("logBar:update", ({ text, userName }) => {
      if (userName === me) {
        return;
      }
      setUserInput(text);

      console.log("logBar:update payload →", { text, userName });
    });

    return () => {
      socket.off("logBar:update");
    };
  }, [me]);

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

    socket.on("log-event", (msg: string) => {
      setLogs((prev) => [...prev.slice(-4), msg]);
    });

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
      // const stillIn = participantsRef.current.some((p) => p.name === me);
      // if (stillIn) socket.emit("leave", { name: me });
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

  // const handleSelect = (id: string) => {
  //   // setSelectedTarget(id);
  //   socket.emit("pointing", { from: me, to: id });
  // };

  // const raiseHand = () => {
  //   // setSelectedTarget(me);
  //   socket.emit("pointing", { from: me, to: me });
  // };

  const handleLogInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);
    console.log("sending:", me + value);
    socket.emit("logBar:update", {
      text: value,
      userName: me,
    });
  };

  // const handleListenerSelect = (mode: "ear" | "brain" | "mouth") => {
  //   console.log("Listener selected mode:", mode);
  //   socket.emit("listener-mode", { name: me, mode });
  // };

  // const emitListenerAction = (button: GestureButton) => {
  //   const { type, subType, actionType } = button;
  //   const from = me;

  //   console.log("[Client] Emitting clientEmits:", {
  //     name: from,
  //     type,
  //     subType,
  //     actionType,
  //   }); // 💥 Add this BEFORE emitting!

  //   socket.emit("clientEmits", {
  //     name: from,
  //     type,
  //     subType,
  //     actionType,
  //   });
  // };

  const radiusX = svgCenter.x * (isMobile ? 0.85 : 0.85);
  const radiusY = svgCenter.y * (isMobile ? 0.8 : 0.85);
  const positions: Record<string, { x: number; y: number }> = {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-100 p-4 flex flex-col items-center justify-start text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 mt-2 sm:mt-3 text-center z-20">
        SoulCircle Table
      </h1>
      <span className="block h-2 sm:h-4"></span>
      <div
        ref={containerRef}
        className="relative w-full max-w-[700px] aspect-[5/6] sm:aspect-[7/5] bg-white rounded-full shadow-2xl border-4 border-emerald-100 flex items-center justify-center overflow-visible">
        <div
          ref={containerRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-2 rounded-xl shadow-md border border-gray-300 text-sm text-gray-700 space-y-1 bg-white overflow-y-auto w-[60%] max-w-[280px] sm:w-[280px] h-[100px] sm:h-[160px] text-xs sm:text-sm opacity-95">
          {logs.map((log, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {log}
            </div>
          ))}
          {isMeLive ? (
            <textarea
              value={userInput}
              onChange={handleLogInput}
              className="w-full bg-transparent outline-none resize-none text-sm"
              rows={1}
              style={{ lineHeight: "1.25rem", maxHeight: "6.5rem" }}
              placeholder="Type here..."
            />
          ) : (
            userInput && <div className="whitespace-pre-wrap">{userInput}</div>
          )}
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

      <div className="w-full px-2 sm:px-0 mt-12 sm:mt-12">
        <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md rounded-xl shadow-md p-4 flex flex-wrap justify-center gap-2">
          {isParticipant &&
            (isSyncActive ? (
              liveSpeakerName === me ? (
                <SoulCirclePanel me={me} />
              ) : (
                // <ListenerSyncPanel
                //   emitListenerAction={emitListenerAction}
                //   hidden={panelHidden}
                //   toggle={() => setPanelHidden(!panelHidden)}
                //   onSelect={handleListenerSelect}
                //   speakerName={liveSpeakerName || "Unknown"} // ✨ new prop
                // />
                <SoulCirclePanel me={me} />
              )
            ) : (
              // <AttentionSelector
              //   participants={participants.filter((p) => p.name !== me)}
              //   onSelect={handleSelect}
              //   hidden={panelHidden}
              //   toggle={() => setPanelHidden(!panelHidden)}
              //   selected={selectedTarget || ""}
              //   raiseHand={raiseHand}
              //   raiseHandMode={selectedTarget === me}
              //   me={me}
              // />
              <SoulCirclePanel me={me} />
            ))}
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
