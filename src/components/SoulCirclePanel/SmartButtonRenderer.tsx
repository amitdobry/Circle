import React from "react";
import socket from "../../socket";

type SmartButtonProps = {
  me: string;
  config: {
    label: string;
    icon?: string;
    gestureCode?: string;
    actionType?: string;
    code?: string;
    type:
      | "gesture"
      | "attentionTarget"
      | "speakerControl"
      | "listenerAction"
      | "semiListenerAction"
      | "listenerControl";
    group?: "ear" | "brain" | "mouth";
    targetUser?: string;
    control?:
      | "interrupt"
      | "passMic"
      | "startPassMic"
      | "releaseMic"
      | "point"
      | "raiseHand"
      | "dropTheMic"
      | "wishToSpeakAfterMicDropped"
      | "declineRequestAfterMicDropped"
      | "declineNewCandidateRequestAfterMicDropped"
      | "offerMicToUserFromPassTheMic"
      | "acceptMicOfferFromPassTheMic"
      | "openChooseASpeakerFromPassTheMic";
    tailwind?: string; // consider deprecating in favor of buttonClass (upstream)
  };
  blockClass?: string; // outer wrapper div
  blockStyle?: React.CSSProperties; // optional inline styles
  buttonClass?: string; // button element class
  iconClass?: string; // icon span class
};

export default function SmartButtonRenderer({
  me,
  config,
  buttonClass,
  iconClass,
}: SmartButtonProps) {
  const handleClick = () => {
    switch (config.type) {
      case "gesture":
        switch (config.group) {
          case "brain":
          case "ear":
            if (!config.control || !config.group || !config.actionType) return;
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          case "mouth":
            if (!config.control || !config.group || !config.actionType) return;
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          default:
            console.warn("Unhandled gesture group:", config.group);
            break;
        }
        break;

      case "semiListenerAction":
        switch (config.actionType) {
          case "syncedGesture":
            if (!config.code) return;
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              subType: config.code,
              actionType: config.actionType,
            });
            break;
          // case "point":
          //   if (!config.targetUser) return;
          //   socket.emit("pointing", { from: me, to: config.targetUser });
          //   break;
        }
      case "attentionTarget":
        switch (config.actionType) {
          case "point":
            if (!config.targetUser) return;
            socket.emit("pointing", { from: me, to: config.targetUser });
            break;

          case "raiseHand":
            socket.emit("pointing", { from: me, to: me });
            break;

          default:
            console.warn("Unhandled attention control:", config.control);
            break;
        }
        break;

      case "speakerControl":
        switch (config.control) {
          case "interrupt":
          case "startPassMic":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          case "dropTheMic":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          case "wishToSpeakAfterMicDropped":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          case "declineRequestAfterMicDropped":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          case "openChooseASpeakerFromPassTheMic":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          default:
            console.warn("Unhandled speaker control:", config.control);
            break;
        }
        break;

      case "listenerControl":
        switch (config.actionType) {
          case "interrupt":
          case "startPassMic":
            break;
          case "wishToSpeakAfterMicDropped":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          case "declineRequestAfterMicDropped":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          case "concentNewSpeakerFromMicDropped":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          case "declineNewCandidateRequestAfterMicDropped":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
            });
            break;
          case "offerMicToUserFromPassTheMic":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
              targetUser: config.targetUser,
            });
            break;
          case "acceptMicOfferFromPassTheMic":
            socket.emit("clientEmits", {
              name: me,
              type: config.group,
              control: config.control,
              actionType: config.actionType,
              targetUser: config.targetUser,
            });
            break;
          default:
            console.warn("Unhandled speaker control:", config.control);
            break;
        }
        break;

      case "listenerAction":
        if (!config.actionType) return;
        socket.emit("listenerAction", {
          from: me,
          actionType: config.actionType,
          group: config.group,
          control: config.control,
        });
        break;

      case "semiListenerAction":
        if (!config.actionType) return;
        socket.emit("semiListenerAction", {
          from: me,
          actionType: config.actionType,
          group: config.group,
          control: config.control,
        });
        break;

      default:
        console.warn("Unhandled config.type:", config.type);
        break;
    }
  };

  return (
    <button onClick={handleClick} className={buttonClass}>
      {config.icon && <span className={iconClass}>{config.icon}</span>}
      {config.label}
    </button>
  );
}
