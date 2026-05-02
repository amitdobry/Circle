import React from "react";

type RoundReadinessIndicatorProps = {
  readyCount: number;
  totalCount: number;
  readyUserIds: string[];
};

/**
 * RoundReadinessIndicator - Displays shared state showing who is ready for the next question
 * Shows count of ready users vs total users
 */
export default function RoundReadinessIndicator({
  readyCount,
  totalCount,
  readyUserIds,
}: RoundReadinessIndicatorProps) {
  return (
    <div
      data-testid="round-readiness-indicator"
      data-ready-count={readyCount}
      data-total-count={totalCount}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
      <span className="text-2xl">⏭️</span>
      <span className="text-sm font-medium">
        {readyCount} / {totalCount} ready for next question
      </span>
    </div>
  );
}
