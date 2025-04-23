import React, { useState } from "react";

type ListenerSyncPanelProps = {
  hidden: boolean;
  toggle: () => void;
  onSelect: (mode: "ear" | "brain" | "mouth") => void;
  speakerName: string;
  emitListenerAction: (payload: {
    type: "ear" | "brain" | "mouth";
    subType?: string;
  }) => void;
};

function ListenerSyncPanel({
  hidden,
  toggle,
  onSelect,
  speakerName,
  emitListenerAction,
}: ListenerSyncPanelProps) {
  const [reflecting, setReflecting] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [interrupting, setInterrupting] = useState(false);

  if (hidden)
    return (
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg z-20">
        Show Listener Panel
      </button>
    );

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Title line */}
      <div className="text-sm sm:text-md font-semibold text-emerald-700 text-center">
        Listening to - {speakerName}
      </div>

      {/* Buttons line */}
      <div className="flex flex-wrap gap-2 justify-center">
        {/* Reflect button */}
        <button
          onClick={() => {
            setReflecting((prev) => !prev);
            setThinking(false);
            setInterrupting(false);
          }}
          className={`px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 ${
            reflecting
              ? "bg-emerald-400 text-white border-emerald-500 hover:bg-emerald-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}>
          👂 Reflect
        </button>

        {/* Think button */}
        <button
          onClick={() => {
            setThinking((prev) => !prev);
            setReflecting(false);
            setInterrupting(false);
          }}
          className={`px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 ${
            thinking
              ? "bg-sky-400 text-white border-sky-500 hover:bg-sky-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}>
          🧠 Think
        </button>

        {/* Interrupt button */}
        <button
          onClick={() => {
            setInterrupting((prev) => !prev);
            setReflecting(false);
            setThinking(false);
          }}
          className={`px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 ${
            interrupting
              ? "bg-rose-400 text-white border-rose-500 hover:bg-rose-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}>
          👄 Interrupt
        </button>
      </div>

      {/* Sub-options */}
      {reflecting && (
        <div className="flex flex-wrap gap-2 justify-center mt-2 transition-all">
          <button
            onClick={() => emitListenerAction({ type: "ear", subType: "001" })}
            className="px-4 py-2 rounded-full text-sm bg-emerald-100 text-emerald-700 border border-emerald-300 transition-all duration-200 hover:brightness-110 hover:shadow-md hover:scale-105">
            🤝 I feel you
          </button>

          <button
            onClick={() => emitListenerAction({ type: "ear", subType: "002" })}
            className="px-4 py-2 rounded-full text-sm bg-amber-100 text-amber-700 border border-amber-300 transition-all duration-200 hover:brightness-110 hover:shadow-md hover:scale-105">
            🤔 I'm confused
          </button>

          <button
            onClick={() => emitListenerAction({ type: "ear", subType: "003" })}
            className="px-4 py-2 rounded-full text-sm bg-rose-100 text-rose-700 border border-rose-300 transition-all duration-200 hover:brightness-110 hover:shadow-md hover:scale-105">
            😕 Not feeling it
          </button>
        </div>
      )}

      {thinking && (
        <div className="flex flex-wrap gap-2 justify-center mt-2 transition-all">
          <button
            onClick={() =>
              emitListenerAction({ type: "brain", subType: "101" })
            }
            className="px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-300 transition-all duration-200 hover:brightness-110 hover:shadow-md hover:scale-105">
            🔄 Processing
          </button>

          <button
            onClick={() =>
              emitListenerAction({ type: "brain", subType: "102" })
            }
            className="px-4 py-2 rounded-full text-sm bg-sky-100 text-sky-700 border border-sky-300 transition-all duration-200 hover:brightness-110 hover:shadow-md hover:scale-105">
            💭 Forming a thought
          </button>

          <button
            onClick={() =>
              emitListenerAction({ type: "brain", subType: "103" })
            }
            className="px-4 py-2 rounded-full text-sm bg-indigo-100 text-indigo-700 border border-indigo-300 transition-all duration-200 hover:brightness-110 hover:shadow-md hover:scale-105">
            🕰️ Need a moment
          </button>
        </div>
      )}

      {interrupting && (
        <div className="flex flex-wrap gap-2 justify-center mt-2 transition-all">
          <button
            onClick={() =>
              emitListenerAction({ type: "mouth", subType: "201" })
            }
            className="px-4 py-2 rounded-full text-sm bg-orange-100 text-orange-700 border border-orange-300 transition-all duration-200 hover:brightness-110 hover:shadow-md hover:scale-105">
            ➕ Add on
          </button>

          <button
            onClick={() =>
              emitListenerAction({ type: "mouth", subType: "202" })
            }
            className="px-4 py-2 rounded-full text-sm bg-violet-100 text-violet-700 border border-violet-300 transition-all duration-200 hover:brightness-110 hover:shadow-md hover:scale-105">
            ❓ Clarify
          </button>

          <button
            onClick={() =>
              emitListenerAction({ type: "mouth", subType: "203" })
            }
            className="px-4 py-2 rounded-full text-sm bg-rose-200 text-rose-700 border border-rose-300 transition-all duration-200 hover:brightness-110 hover:shadow-md hover:scale-105">
            ✖️ Disagree
          </button>
        </div>
      )}
    </div>
  );
}

export default ListenerSyncPanel;
