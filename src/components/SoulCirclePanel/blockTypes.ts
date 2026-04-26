export type BlockType =
  | "text"
  | "emoji"
  | "spacer"
  | "button"
  | "subjectSelection"
  | "roundDisplay";

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
    flavor?: string;
    type:
      | "gesture"
      | "attentionTarget"
      | "speakerControl"
      | "listenerAction"
      | "semiListenerAction"
      | "listenerControl";
    group?: "ear" | "brain" | "mouth" | "blue";
    targetUser?: string;
    control?: "interrupt" | "passMic" | "releaseMic" | "startPassMic";
    state?: string;
  };
};

export type SubjectSelectionBlock = BaseBlock & {
  type: "subjectSelection";
  subjects: Array<{
    key: string;
    label: string;
    description: string;
  }>;
  selectedSubject: string | null;
  hasVoted: boolean;
};

export type RoundDisplayBlock = BaseBlock & {
  type: "roundDisplay";
  roundNumber: number;
  glyphText: string;
  subjectKey: string;
  userIsReady: boolean;
  readyCount: number;
  totalCount: number;
};

export type PanelBlock =
  | TextBlock
  | EmojiBlock
  | SpacerBlock
  | ButtonBlock
  | SubjectSelectionBlock
  | RoundDisplayBlock;

export type PanelConfig = PanelSection[];

export type PanelSection = {
  id: string;
  label: string;
  layout?: "row" | "column";
  panelType?:
    | "speakerPanel"
    | "speakerPanelAction"
    | "attentionPanel"
    | "thinkingPanel"
    | "listenerSyncPanel";
  panelStyle?: string;
  topScopeStyle?: string;
  blocks: PanelBlock[];
};
