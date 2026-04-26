import React from "react";

type RoundQuestionProps = {
  roundNumber: number;
  questionText: string;
};

/**
 * RoundQuestion Component - Displays the round's philosophical question in the circle center
 * Shows as a semi-transparent overlay over the participants
 * NOTE: This will be migrated to GliffLog in future (see CONTENT_QUESTION_TO_GLIFFLOG_PLAN.md)
 */
export default function RoundQuestion({
  roundNumber,
  questionText,
}: RoundQuestionProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-white/30 backdrop-blur-sm max-w-md">
        <div className="text-xs font-medium text-gray-700 uppercase tracking-wider">
          Round {roundNumber}
        </div>
        <div className="text-lg sm:text-xl font-serif text-center leading-snug text-gray-800">
          {questionText}
        </div>
      </div>
    </div>
  );
}
