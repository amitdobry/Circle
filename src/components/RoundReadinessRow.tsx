import React from "react";
import RoundReadinessIndicator from "./RoundReadinessIndicator";
import RoundReadyButton from "./RoundReadyButton";

type RoundReadinessRowProps = {
  readyCount: number;
  totalCount: number;
  readyUserIds: string[];
  isUserReady: boolean;
};

/**
 * RoundReadinessRow - Container for readiness indicator and ready button
 * Layout: Desktop = horizontal row, Mobile = vertical stack
 */
export default function RoundReadinessRow({
  readyCount,
  totalCount,
  readyUserIds,
  isUserReady,
}: RoundReadinessRowProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
      <RoundReadinessIndicator
        readyCount={readyCount}
        totalCount={totalCount}
        readyUserIds={readyUserIds}
      />
      <RoundReadyButton isReady={isUserReady} />
    </div>
  );
}
