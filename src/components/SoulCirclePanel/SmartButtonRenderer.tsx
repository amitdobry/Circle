import React from "react";
import socket from "../../socket";

type SmartButtonProps = {
  me: string;
  config: {
    label: string;
    icon?: string;
    gestureCode?: string;
    actionType?: string;
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
      | "releaseMic"
      | "point"
      | "raiseHand"
      | "dropTheMic"
      | "wishToSpeakAfterMicDropped"
      | "declineRequestAfterMicDropped";
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
          case "passMic":
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
          default:
            console.warn("Unhandled speaker control:", config.control);
            break;
        }
        break;

      case "listenerControl":
        switch (config.actionType) {
          case "interrupt":
          case "passMic":
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
