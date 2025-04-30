import React, { useState } from "react";
import GestureButtonGroup from "./ListenerButtons/GestureButtonGroup";
import { useGestureButtons } from "./ListenerButtons/useGestureButtons";
import { GestureButton } from "../types/gestureButtons";

type ListenerSyncPanelProps = {
  hidden: boolean;
  toggle: () => void;
  onSelect: (mode: "ear" | "brain" | "mouth") => void;
  speakerName: string;
  emitListenerAction: (payload: GestureButton) => void;
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
  const { buttons, fetchGestures } = useGestureButtons();

  if (hidden)
    return (
      <button
        onClick={() => {
          fetchGestures();
          toggle();
        }}
        className="fixed bottom-4 right-4 bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg z-20">
        Show Listener Panel
      </button>
    );

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="text-sm sm:text-md font-semibold text-emerald-700 text-center">
        Listening to - {speakerName}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => {
            fetchGestures();
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

        <button
          onClick={() => {
            fetchGestures();
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

        <button
          onClick={() => {
            fetchGestures();
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

      {reflecting && (
        <GestureButtonGroup
          buttons={buttons.ear}
          emitListenerAction={emitListenerAction}
        />
      )}
      {thinking && (
        <GestureButtonGroup
          buttons={buttons.brain}
          emitListenerAction={emitListenerAction}
        />
      )}
      {interrupting && (
        <GestureButtonGroup
          buttons={buttons.mouth}
          emitListenerAction={emitListenerAction}
        />
      )}
    </div>
  );
}

export default ListenerSyncPanel;
