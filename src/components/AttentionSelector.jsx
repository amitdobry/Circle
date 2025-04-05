// AttentionSelector.jsx
import React from "react";

function AttentionSelector({
  participants,
  onSelect,
  hidden,
  toggle,
  selected,
}) {
  const handleChange = (id) => {
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
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-lg flex gap-3 flex-wrap justify-center max-w-md z-20">
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
        onClick={toggle}
        className="ml-2 px-3 py-1 text-xs bg-rose-100 text-rose-500 rounded-full border border-rose-200">
        Hide
      </button>
    </div>
  );
}

export default AttentionSelector;
