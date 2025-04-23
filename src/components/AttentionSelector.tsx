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
        className={`px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 ${
          raiseHandMode
            ? "bg-indigo-200 text-indigo-600 border-indigo-300 opacity-70 cursor-not-allowed"
            : "bg-indigo-400 text-white border-indigo-500 hover:bg-indigo-500 hover:shadow-md hover:scale-105"
        }`}>
        {raiseHandMode ? "Glow Requested ✨" : "✨ Ready to Glow"}
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
