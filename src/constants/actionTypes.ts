// constants/actionTypes.ts

export const ActionTypes = {
  SYNCED_GESTURE: "syncedGesture",
  BREAK_SYNC: "breakSync",
} as const;

export type ActionType = (typeof ActionTypes)[keyof typeof ActionTypes];
