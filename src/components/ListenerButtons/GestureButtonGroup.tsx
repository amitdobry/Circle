import React from "react";

type GestureButton = {
  type: "ear" | "brain" | "mouth";
  subType: string;
  label: string;
  emoji: string;
  color: string;
  tailwind: string; // ✅ (critical!)
};

type Props = {
  buttons: GestureButton[];
  emitListenerAction: (payload: {
    type: "ear" | "brain" | "mouth";
    subType: string;
  }) => void;
};

function GestureButtonGroup({ buttons, emitListenerAction }: Props) {
  console.log("[Client] Received buttons:", buttons);

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-2 transition-all">
      {buttons.map((btn) => (
        <button
          key={btn.subType}
          onClick={() =>
            emitListenerAction({ type: btn.type, subType: btn.subType })
          }
          className={btn.tailwind}>
          {btn.emoji} {btn.label}
        </button>
      ))}
    </div>
  );
}

export default GestureButtonGroup;
