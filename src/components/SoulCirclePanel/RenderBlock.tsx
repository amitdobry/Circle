import React from "react";
import { PanelBlock } from "./blockTypes";
import SmartButtonRenderer from "./SmartButtonRenderer";
import socket from "../../socket";

type Props = {
  block: PanelBlock;
  me: string;
};

export default function RenderBlock({ block, me }: Props) {
  switch (block.type) {
    case "text":
      return (
        <p data-testid={`text-${block.id}`} className={block.textClass}>
          {block.content}
        </p>
      );

    case "emoji":
      return (
        <div style={{ fontSize: block.size || 32 }} className="text-center">
          {block.emoji}
        </div>
      );

    case "spacer":
      return <div style={{ height: block.height || 16 }} />;

    case "button":
      const isSelected = block.button?.state === "selected";
      const className =
        isSelected && block.buttonClassSelected
          ? block.buttonClassSelected
          : block.buttonClass;
      // console.log("[RenderBlock] final buttonClass:", className);
      return (
        <SmartButtonRenderer
          me={me}
          config={block.button}
          buttonClass={className}
          iconClass={block.iconClass}
        />
      );

    case "subjectSelection":
      return (
        <div data-testid="subject-selection" className="w-full space-y-3">
          {block.subjects.map((subject) => {
            const isSelected = block.selectedSubject === subject.key;
            const isDisabled = block.hasVoted;

            return (
              <button
                key={subject.key}
                data-testid={`subject-vote-${subject.key}`}
                onClick={() => {
                  if (!isDisabled) {
                    socket.emit("content:vote-subject", {
                      subjectKey: subject.key,
                    });
                  }
                }}
                disabled={isDisabled}
                className={`
                  w-full p-3 rounded-lg text-left transition-all duration-200
                  ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-lg scale-[1.02]"
                      : "bg-white/80 text-gray-800 hover:bg-emerald-50 border border-gray-200"
                  }
                  ${isDisabled && !isSelected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}>
                <div className="font-semibold text-sm mb-1">
                  {subject.label}
                </div>
                <div
                  className={`text-xs ${isSelected ? "text-emerald-100" : "text-gray-600"}`}>
                  {subject.description}
                </div>
              </button>
            );
          })}
        </div>
      );

    case "roundDisplay":
      return (
        <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-purple-200 mb-6">
          {/* Glyph Display */}
          <div className="text-center mb-4">
            <div className="text-xs text-purple-600 font-semibold tracking-wider uppercase mb-2">
              Round {block.roundNumber} • {block.subjectKey}
            </div>
            <div className="text-2xl font-serif text-gray-800 leading-relaxed px-4">
              "{block.glyphText}"
            </div>
          </div>

          {/* Readiness Control */}
          <div className="flex flex-col items-center space-y-3 mt-6">
            <button
              onClick={() => {
                if (block.userIsReady) {
                  socket.emit("round:unready");
                } else {
                  socket.emit("round:ready");
                }
              }}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all duration-200
                ${
                  block.userIsReady
                    ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
                }
              `}>
              {block.userIsReady ? "✓ Ready" : "Mark Ready for Next Question"}
            </button>

            {/* Readiness Count */}
            <div className="text-sm text-gray-600">
              {block.readyCount} / {block.totalCount} ready
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
