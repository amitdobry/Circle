import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket";
import AttentionSelector from "./AttentionSelector";

export default function TableView() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");
  const isParticipant = mode === "participant";
  const me = queryParams.get("name") || "Guest";

  const [participants, setParticipants] = useState([]);
  const [pointerMap, setPointerMap] = useState({});
  const [liveSpeakerName, setLiveSpeakerName] = useState(null);
  const [panelHidden, setPanelHidden] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);

  const seatCount = participants.length;
  const radiusX = 300;
  const radiusY = 180;
  const positions = {};

  const videoRef = useRef(null);

  useEffect(() => {
    const requestCameraAccess = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Camera API not supported in this environment.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setCameraError(
          "Camera access denied or unavailable. Please allow camera permissions and reload the page."
        );
      }
    };

    requestCameraAccess();
  }, []);

  useEffect(() => {
    socket.emit("join", { name: me });

    socket.on("user-list", (userList) => {
      setParticipants(userList);
    });

    socket.on("update-pointing", ({ from, to }) => {
      setPointerMap((prev) => ({ ...prev, [from]: to }));
    });

    socket.on("initial-pointer-map", (entries) => {
      const map = {};
      for (const { from, to } of entries) {
        map[from] = to;
      }
      setPointerMap(map);
    });

    socket.on("live-speaker", ({ name }) => {
      setLiveSpeakerName(name);
    });

    socket.on("live-speaker-cleared", () => {
      setLiveSpeakerName(null);
    });

    return () => {
      socket.emit("leave", { name: me });
      socket.off("user-list");
      socket.off("update-pointing");
      socket.off("initial-pointer-map");
      socket.off("live-speaker");
      socket.off("live-speaker-cleared");
    };
  }, [me]);

  const handleSelect = (id) => {
    setSelectedTarget(id);
    socket.emit("pointing", { from: me, to: id });
  };

  const raiseHand = () => {
    setSelectedTarget(me);
    socket.emit("pointing", { from: me, to: me });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-emerald-100 p-4 flex flex-col items-center justify-center text-gray-800">
      <h1 className="text-3xl font-bold mb-6">SoulCircle Table</h1>

      <div className="relative w-[700px] h-[500px] bg-white rounded-full shadow-2xl border-4 border-emerald-100 flex items-center justify-center">
        <div className="absolute w-64 h-36 rounded-xl overflow-hidden shadow-lg border border-gray-300 z-10">
          {cameraError ? (
            <div className="w-full h-full flex items-center justify-center text-sm text-red-600 bg-white p-2 text-center">
              {cameraError}
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={liveSpeakerName !== me}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                liveSpeakerName === me ? "opacity-100" : "opacity-20"
              }`}
            />
          )}
        </div>

        {participants.map((user, i) => {
          const angle = (i / seatCount) * 2 * Math.PI;
          const x = radiusX * Math.cos(angle);
          const y = radiusY * Math.sin(angle);
          const isMe = user.name === me;
          const isLive = user.name === liveSpeakerName;
          const isPointingAtSelf = pointerMap[user.name] === user.name;
          positions[user.name] = { x, y };

          return (
            <div
              key={user.name}
              className={`absolute w-24 h-24 rounded-full shadow-md flex flex-col items-center justify-center text-xs border ${
                isMe
                  ? "border-emerald-600 ring-4 ring-emerald-300"
                  : "border-gray-300"
              }`}
              style={{ transform: `translate(${x}px, ${y}px)` }}>
              <div className="w-10 h-10 rounded-full bg-emerald-200 mb-1 relative">
                {isPointingAtSelf && (
                  <div className="absolute -right-1 -bottom-1 text-yellow-500 text-lg">
                    ☝️
                  </div>
                )}
                {isLive && (
                  <div className="absolute -left-1 -bottom-1 text-xs bg-red-500 text-white px-1 rounded">
                    Live
                  </div>
                )}
              </div>
              <span className="font-semibold">{user.name}</span>
              {isMe && (
                <span className="text-[10px] text-emerald-600">You</span>
              )}
            </div>
          );
        })}

        {Object.entries(pointerMap).map(([from, to]) => {
          if (!positions[from] || !positions[to] || from === to) return null;
          return (
            <svg
              key={from}
              className="absolute inset-0 pointer-events-none z-0"
              width="100%"
              height="100%">
              <defs>
                <marker
                  id={`arrowhead-${from}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="0"
                  refY="3.5"
                  orient="auto"
                  fill="green">
                  <polygon points="0 0, 10 3.5, 0 7" />
                </marker>
              </defs>
              <line
                x1={positions[from].x + 350}
                y1={positions[from].y + 250}
                x2={positions[to].x + 350}
                y2={positions[to].y + 250}
                stroke="green"
                strokeWidth="2"
                markerEnd={`url(#arrowhead-${from})`}
              />
            </svg>
          );
        })}
      </div>

      {isParticipant && (
        <>
          <AttentionSelector
            participants={participants.filter((p) => p.name !== me)}
            onSelect={handleSelect}
            hidden={panelHidden}
            toggle={() => setPanelHidden(!panelHidden)}
            selected={selectedTarget}
            raiseHandMode={selectedTarget === me}
          />
          <button
            onClick={raiseHand}
            disabled={selectedTarget === me}
            className="mt-4 px-6 py-2 bg-yellow-300 text-yellow-800 rounded-full border border-yellow-400 shadow disabled:opacity-50">
            ☝️ I wish to speak
          </button>
        </>
      )}

      <p className="mt-6 text-sm text-gray-500 text-center max-w-sm">
        Choose one to listen to. When all align, a voice is born.
      </p>
    </div>
  );
}
