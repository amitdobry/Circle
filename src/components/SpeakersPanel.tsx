import React from "react";

type SpeakerPanelProps = {
  hidden: boolean;
  toggle: () => void;
};

function SpeakerPanel({ hidden, toggle }: SpeakerPanelProps) {
  if (hidden) {
    return (
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg z-20">
        Show Speaker Panel
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <p className="text-lg font-semibold text-red-600">🎤 You are LIVE!</p>
      <button
        onClick={toggle}
        className="px-3 py-1 text-xs bg-rose-100 text-rose-500 rounded-full border border-rose-200">
        Hide
      </button>
    </div>
  );
}

export default SpeakerPanel;
