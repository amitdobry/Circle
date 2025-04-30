// types/gestureButton.ts

import { ActionType } from "../constants/actionTypes";

export type GestureButton = {
  type: "ear" | "brain" | "mouth";
  subType: string;
  label: string;
  emoji: string;
  color: string;
  tailwind: string;
  actionType: ActionType;
};
