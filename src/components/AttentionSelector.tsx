import React from "react";
import { Participant } from "../types/participant";

type AttentionSelectorProps = {
  participants: Participant[];
  onSelect: (id: string) => void;
  hidden: boolean;
  toggle: () => void;
  selected: string;
  raiseHandMode: boolean;
  raiseHand: () => void;
  me: string;
};

function AttentionSelector({
  participants,
  onSelect,
  hidden,
  toggle,
  selected,
  raiseHandMode,
  raiseHand,
  me,
}: AttentionSelectorProps) {
  const handleChange = (id: string) => {
    onSelect(id);
  };

  if (hidden)
    return (
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg z-20">
        Show Controls
      </button>
    );

  return (
    <div className="w-full flex flex-wrap gap-2 justify-center">
      {/* return ( */}
      {/* <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl shadow-xl w-[95vw] max-w-lg flex flex-wrap gap-2 justify-center z-20"> */}
      {participants.map((p) => (
        <button
          key={p.name}
          onClick={() => handleChange(p.name)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
            selected === p.name
              ? "bg-emerald-500 text-white border-emerald-600"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}>
          {p.name}
        </button>
      ))}

      <button
        onClick={raiseHand}
        disabled={raiseHandMode}
        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
          raiseHandMode
            ? "bg-yellow-200 text-yellow-600 border-yellow-300 opacity-60"
            : "bg-yellow-300 text-yellow-800 border-yellow-400 hover:bg-yellow-400"
        }`}>
        ☝️ I wish to speak
      </button>

      <button
        onClick={toggle}
        className="px-3 py-1 text-xs bg-rose-100 text-rose-500 rounded-full border border-rose-200">
        Hide
      </button>
    </div>
  );
}

export default AttentionSelector;
