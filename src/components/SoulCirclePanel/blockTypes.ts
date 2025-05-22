export type BlockType = "text" | "emoji" | "spacer" | "button";

export type BaseBlock = {
  id: string;
  type: BlockType;
  style?: string;
  visibility?: "always" | "ifActiveThinker" | "ifNotActiveThinker";
};

export type TextBlock = BaseBlock & {
  type: "text";
  content: string;
  size?: "sm" | "base" | "lg" | "xl" | "md";
  align?: "left" | "center" | "right";
  textClass?: string;
};

export type EmojiBlock = BaseBlock & {
  type: "emoji";
  emoji: string;
  size?: number;
};

export type SpacerBlock = BaseBlock & {
  type: "spacer";
  height?: number;
};

export type ButtonBlock = BaseBlock & {
  type: "button";
  blockClass?: string; // <div> wrapper class
  buttonClassSelected?: string;
  blockStyle?: React.CSSProperties; // <div> wrapper style
  buttonClass?: string; // <button> element class
  iconClass?: string; // <span> around icon class
  button: {
    label: string;
    icon?: string;
    gestureCode?: string;
    actionType?: string;
    type:
      | "gesture"
      | "attentionTarget"
      | "speakerControl"
      | "listenerAction"
      | "semiListenerAction";
    group?: "ear" | "brain" | "mouth";
    targetUser?: string;
    control?: "interrupt" | "passMic" | "releaseMic";
    state?: string;
  };
};

export type PanelBlock = TextBlock | EmojiBlock | SpacerBlock | ButtonBlock;

export type PanelConfig = PanelSection[];

export type PanelSection = {
  id: string;
  label: string;
  layout?: "row" | "column";
  panelType?:
    | "speakerPanel"
    | "attentionPanel"
    | "thinkingPanel"
    | "listenerSyncPanel";
  panelStyle?: string;
  topScopeStyle?: string;
  blocks: PanelBlock[];
};
