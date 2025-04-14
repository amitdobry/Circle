import React, { useState, useEffect, useRef, JSX } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket/index";
import AttentionSelector from "./AttentionSelector";
import { Participant } from "../types/participant";

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
  const [panelHidden, setPanelHidden] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const participantsRef = useRef<Participant[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCenter, setSvgCenter] = useState({ x: 350, y: 250 });
  const isMobile = window.innerWidth < 640;

  const radiusX = isMobile ? 180 : 300;
  const radiusY = isMobile ? 300 : 180;
  const positions: Record<string, { x: number; y: number }> = {};

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
    const updateCenter = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSvgCenter({
          x: rect.width / 2,
          y: rect.height / 2,
        });
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
    });

    socket.on("live-speaker-cleared", () => {
      setLiveSpeakerName(null);
    });

    if (
      isParticipant &&
      me &&
      !participantsRef.current.some((p) => p.name === me)
    ) {
      socket.emit("joined-table", { name: me });
    }

    return () => {
      const stillIn = participantsRef.current.some((p) => p.name === me);
      if (stillIn) socket.emit("leave", { name: me });
      socket.off("user-list");
      socket.off("update-pointing");
      socket.off("initial-pointer-map");
      socket.off("live-speaker");
      socket.off("live-speaker-cleared");
      socket.off("log-event");
    };
  }, [me, isParticipant]);

  const handleSelect = (id: string) => {
    setSelectedTarget(id);
    socket.emit("pointing", { from: me, to: id });
  };

  const raiseHand = () => {
    setSelectedTarget(me);
    socket.emit("pointing", { from: me, to: me });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-100 p-4 flex flex-col items-center justify-between text-gray-800">
      <h1 className="text-3xl font-bold mb-4 sm:mb-6 mt-3 text-center z-20">
        SoulCircle Table
      </h1>

      <div
        ref={containerRef}
        className="relative w-full max-w-[700px] aspect-[5/7] sm:aspect-[7/5] bg-white rounded-full shadow-2xl border-4 border-emerald-100 flex items-center justify-center">
        <div
          className={`absolute z-10 p-2 rounded-xl shadow-md border border-gray-300 text-sm text-gray-700 space-y-1 bg-white overflow-y-auto transition-all
            ${
              isMobile
                ? "bottom-55 left-1/2 transform -translate-x-1/2 w-[80%] h-[100px] text-xs opacity-90"
                : "top-50 left-1/2 transform -translate-x-1/2 w-[280px] h-[160px]"
            }`}>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>

        {/* Avatars */}
        {participants.map((user, i) => {
          const angle = (i / participants.length) * 2 * Math.PI;
          const x = radiusX * Math.cos(angle);
          const y = radiusY * Math.sin(angle);
          const isMe = user.name === me;
          const isLive = user.name === liveSpeakerName;
          const isPointingAtSelf = pointerMap[user.name] === user.name;
          positions[user.name] = { x, y };

          return (
            <div
              key={user.name}
              className="absolute flex flex-col items-center text-center z-10"
              style={{ transform: `translate(${x}px, ${y}px)` }}>
              <div className="font-semibold text-xs sm:text-sm mb-1 truncate max-w-[80px]">
                {user.name}
              </div>
              <div
                className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden relative border-4 shadow-lg ${
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
              <div className="flex items-center gap-1 mt-1 text-xs">
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

        {/* Arrows */}
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

      {isParticipant && (
        <AttentionSelector
          participants={participants.filter((p) => p.name !== me)}
          onSelect={handleSelect}
          hidden={panelHidden}
          toggle={() => setPanelHidden(!panelHidden)}
          selected={selectedTarget || ""}
          raiseHand={raiseHand}
          raiseHandMode={selectedTarget === me}
          me={me}
        />
      )}

      <p className="mt-6 text-sm text-gray-500 text-center max-w-sm">
        Choose one to listen to. When all align, a voice is born.
      </p>
    </div>
  );
}
