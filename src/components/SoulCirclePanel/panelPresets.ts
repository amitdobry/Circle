import { PanelConfig } from "./blockTypes";

// export const pauseThinkingPanel: PanelConfig = {
//   id: "thinking-mode-local",
//   label: "Thinking",
//   layout: "column",
//   blocks: [
//     {
//       id: "emoji1",
//       type: "emoji",
//       emoji: "🧠",
//       size: 40,
//     },
//     {
//       id: "text1",
//       type: "text",
//       content: "You're pausing to think...",
//       size: "lg",
//       align: "center",
//     },
//     {
//       id: "spacer1",
//       type: "spacer",
//       height: 24,
//     },
//     {
//       id: "button1",
//       type: "button",
//       button: {
//         label: "Ready to Glow ✨",
//         icon: "👂",
//         type: "gesture",
//         gestureCode: "101",
//         group: "brain",
//         actionType: "syncedGesture",
//       },
//     },
//   ],
// };

export const testPanel: PanelConfig = [
  {
    id: "speaker-mode-panel",
    label: "Speaker Mode",
    layout: "column",
    panelType: "speakerPanel",
    blocks: [
      {
        id: "text1",
        type: "text",
        content: "🎤 You are LIVE!",
        size: "xl",
        align: "center",
        style: "text-red-500 font-semibold", // 🔥 Tailwind style for RED + bold
      },
    ],
  },
  {
    id: "speaker-mode-panel",
    label: "Speaker Mode",
    layout: "row",
    panelType: "speakerPanel",
    blocks: [
      {
        id: "button1",
        type: "button",
        blockClass: "inline-block p-2",
        blockStyle: { border: "1px dashed #ccc" },
        buttonClass:
          "px-4 py-2 bg-white rounded-full border text-sm shadow hover:shadow-md transition-all hover:scale-105",
        iconClass: "mr-1",
        button: {
          label: "Drop the Mic",
          icon: "🎙️",
          type: "speakerControl",
          control: "releaseMic",
          group: "mouth",
        },
      },
      {
        id: "button2",
        type: "button",
        blockClass: "inline-block p-2",
        blockStyle: { border: "1px dashed #ccc" },
        buttonClass:
          "px-4 py-2 bg-white rounded-full border text-sm shadow hover:shadow-md transition-all hover:scale-105",
        iconClass: "mr-1",
        button: {
          label: "Pass the Mic",
          icon: "🔄",
          type: "speakerControl",
          control: "passMic",
          group: "mouth",
        },
      },
    ],
  },
];

export const testPanelAttention: PanelConfig = [
  {
    id: "attention-glow",
    layout: "row",
    panelType: "attentionPanel",
    panelStyle: "",
    label: "Choose one to listen to",
    blocks: [
      {
        id: "ready-to-glow",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 bg-indigo-400 text-white border-indigo-500 hover:bg-indigo-500 hover:shadow-md hover:scale-105 w-full sm:w-auto",
        button: {
          label: "✨ Ready to Glow",
          type: "attentionTarget",
          actionType: "raiseHand",
          targetUser: "EEE",
        },
      },
    ],
  },
  {
    id: "attention-glow",
    layout: "row",
    panelType: "attentionPanel",
    panelStyle: "",
    label: "Choose one to listen to",
    blocks: [
      {
        id: "text1",
        type: "text",
        content: "Choose one to listen to. When all align, a voice is born.",
        size: "xl",
        align: "center",
        style: "text-black-500 font-semibold", // 🔥 Tailwind style for RED + bold
        textClass: "mt-1 mb-1 text-sm text-gray-500 text-center max-w-sm",
      },
    ],
  },
  {
    id: "attention-participants",
    layout: "row",
    panelType: "attentionPanel",
    panelStyle: "flex flex-wrap gap-2 justify-center w-full max-w-md",
    label: "",
    blocks: [
      {
        id: "participant-btn-0",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "AAA",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "AAA",
        },
      },

      {
        id: "participant-btn-1",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "BBB",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "BBB",
        },
      },
      {
        id: "participant-btn-2",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "CCC",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "CCC",
        },
      },
      {
        id: "participant-btn-0",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "AAA",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "AAA",
        },
      },
      {
        id: "participant-btn-1",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "BBB",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "BBB",
        },
      },
      {
        id: "participant-btn-2",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "CCC",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "CCC",
        },
      },
      {
        id: "participant-btn-0",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "AAA",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "AAA",
        },
      },
      {
        id: "participant-btn-1",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "BBB",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "BBB",
        },
      },
      {
        id: "participant-btn-2",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "CCC",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "CCC",
        },
      },
      {
        id: "participant-btn-0",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "AAA",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "AAA",
        },
      },
      {
        id: "participant-btn-1",
        type: "button",
        buttonClass:
          "px-6 py-2 rounded-full text-sm font-semibold transition-all border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        button: {
          label: "BBB",
          type: "attentionTarget",
          actionType: "point",
          targetUser: "BBB",
        },
      },
    ],
  },
];

// const mainActionButtons = [
//   {
//     id: "reflect-btn",
//     type: "button",
//     buttonClass:
//       "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-emerald-400 hover:text-white hover:border-emerald-500 transition",
//     button: {
//       label: "👂 Reflect",
//       type: "listenerAction",
//       actionType: "selectEar",
//     },
//   },
//   {
//     id: "think-btn",
//     type: "button",
//     buttonClass:
//       "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-sky-400 hover:text-white hover:border-sky-500 transition",
//     button: {
//       label: "🧠 Think",
//       type: "listenerAction",
//       actionType: "selectBrain",
//     },
//   },
//   {
//     id: "interrupt-btn",
//     type: "button",
//     buttonClass:
//       "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-rose-400 hover:text-white hover:border-rose-500 transition",
//     button: {
//       label: "👄 Interrupt",
//       type: "listenerAction",
//       actionType: "selectMouth",
//     },
//   },
// ];

export const testPanelListenerState1: PanelConfig = [
  {
    id: "listener-top-bar",
    layout: "row",
    panelType: "listenerSyncPanel",
    label: "Listening to message",
    topScopeStyle: "w-full flex flex-col items-center gap-4",
    blocks: [
      {
        id: "listening-to-text",
        type: "text" as const,
        content: "Listening to - Trump",
        size: "md",
        align: "center",
        style: "text-emerald-600 font-semibold",
        textClass: "text-center mb-2",
      },
    ],
  },
  {
    id: "listener-main-buttons",
    layout: "row",
    panelType: "listenerSyncPanel",
    label: "main jester buttons",
    blocks: [
      {
        id: "reflect-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-emerald-400 hover:text-white hover:border-emerald-500 transition",
        button: {
          label: "👂 Reflect",
          type: "listenerAction",
          actionType: "selectEar",
        },
      },
      {
        id: "think-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-sky-400 hover:text-white hover:border-sky-500 transition",
        button: {
          label: "🧠 Think",
          type: "listenerAction",
          actionType: "selectBrain",
        },
      },
      {
        id: "interrupt-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-rose-400 hover:text-white hover:border-rose-500 transition",
        button: {
          label: "👄 Interrupt",
          type: "listenerAction",
          actionType: "selectMouth",
        },
      },
    ],
  },
];

export const testPanelListenerState2: PanelConfig = [
  {
    id: "listener-top-bar",
    layout: "row",
    panelType: "listenerSyncPanel",
    label: "Listening to message",
    topScopeStyle: "w-full flex flex-col items-center gap-4",
    blocks: [
      {
        id: "listening-to-text",
        type: "text" as const,
        content: "Listening to - Trump",
        size: "md",
        align: "center",
        style: "text-emerald-600 font-semibold",
        textClass: "text-center mb-2",
      },
    ],
  },
  {
    id: "listener-main-buttons",
    layout: "row",
    panelType: "listenerSyncPanel",
    label: "main jester buttons",
    blocks: [
      {
        id: "reflect-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 bg-emerald-400 text-white border-emerald-500 hover:bg-emerald-500",
        button: {
          label: "👂 Reflect",
          type: "listenerAction",
          actionType: "selectEar",
        },
      },
      {
        id: "think-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-sky-400 hover:text-white hover:border-sky-500 transition",
        button: {
          label: "🧠 Think",
          type: "listenerAction",
          actionType: "selectBrain",
        },
      },
      {
        id: "interrupt-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-rose-400 hover:text-white hover:border-rose-500 transition",
        button: {
          label: "👄 Interrupt",
          type: "listenerAction",
          actionType: "selectMouth",
        },
      },
    ],
  },
  {
    id: "listener-ear-semi",
    layout: "row",
    panelType: "listenerSyncPanel",
    panelStyle: "flex flex-wrap gap-2 justify-center mt-2",
    label: "sub jester buttons",
    blocks: [
      {
        id: "ear-btn-1",
        type: "button",
        buttonClass:
          "px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 hover:bg-yellow-200 text-yellow-700",
        button: {
          label: "🤝 I feel you",
          type: "semiListenerAction",
          actionType: "feelYou",
        },
      },
      {
        id: "ear-btn-2",
        type: "button",
        buttonClass:
          "px-4 py-2 rounded-full text-sm font-medium bg-orange-100 hover:bg-orange-200 text-orange-700",
        button: {
          label: "😕 I'm confused",
          type: "semiListenerAction",
          actionType: "confused",
        },
      },
      {
        id: "ear-btn-3",
        type: "button",
        buttonClass:
          "px-4 py-2 rounded-full text-sm font-medium bg-pink-100 hover:bg-pink-200 text-pink-700",
        button: {
          label: "🙁 Not feeling it",
          type: "semiListenerAction",
          actionType: "notFeelingIt",
        },
      },
    ],
  },
];

export const testPanelListenerState3: PanelConfig = [
  {
    id: "listener-top-bar",
    layout: "row",
    panelType: "listenerSyncPanel",
    label: "Listening to message",
    topScopeStyle: "w-full flex flex-col items-center gap-4",
    blocks: [
      {
        id: "listening-to-text",
        type: "text" as const,
        content: "Listening to - Trump",
        size: "md",
        align: "center",
        style: "text-emerald-600 font-semibold",
        textClass: "text-center mb-2",
      },
    ],
  },
  {
    id: "listener-main-buttons",
    layout: "row",
    panelType: "listenerSyncPanel",
    label: "main jester buttons",
    blocks: [
      {
        id: "reflect-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-emerald-400 hover:text-white hover:border-emerald-500 transition",
        button: {
          label: "👂 Reflect",
          type: "listenerAction",
          actionType: "selectEar",
        },
      },
      {
        id: "think-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 bg-sky-400 text-white border-sky-500 hover:bg-sky-500",
        button: {
          label: "🧠 Think",
          type: "listenerAction",
          actionType: "selectBrain",
        },
      },
      {
        id: "interrupt-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-rose-400 hover:text-white hover:border-rose-500 transition",
        button: {
          label: "👄 Interrupt",
          type: "listenerAction",
          actionType: "selectMouth",
        },
      },
    ],
  },
  {
    id: "listener-brain-semi",
    layout: "row",
    panelType: "listenerSyncPanel",
    panelStyle: "flex flex-wrap gap-2 justify-center mt-2",
    label: "sub jester buttons",
    blocks: [
      {
        id: "brain-btn-1",
        type: "button",
        buttonClass:
          "px-4 py-2 rounded-full text-sm font-medium bg-blue-100 hover:bg-blue-200 text-blue-700",
        button: {
          label: "🌊 Processing",
          type: "semiListenerAction",
          actionType: "processing",
        },
      },
      {
        id: "brain-btn-2",
        type: "button",
        buttonClass:
          "px-4 py-2 rounded-full text-sm font-medium bg-purple-100 hover:bg-purple-200 text-purple-700",
        button: {
          label: "💭 Forming a thought",
          type: "semiListenerAction",
          actionType: "formingThought",
        },
      },
      {
        id: "brain-btn-3",
        type: "button",
        buttonClass:
          "px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 hover:bg-indigo-200 text-indigo-700",
        button: {
          label: "⏳ Need a moment",
          type: "semiListenerAction",
          actionType: "needMoment",
        },
      },
    ],
  },
];

export const testPanelListenerState4: PanelConfig = [
  {
    id: "listener-top-bar",
    layout: "row",
    panelType: "listenerSyncPanel",
    label: "Listening to message",
    topScopeStyle: "w-full flex flex-col items-center gap-4",
    blocks: [
      {
        id: "listening-to-text",
        type: "text" as const,
        content: "Listening to - Trump",
        size: "md",
        align: "center",
        style: "text-emerald-600 font-semibold",
        textClass: "text-center mb-2",
      },
    ],
  },
  {
    id: "listener-main-buttons",
    layout: "row",
    panelType: "listenerSyncPanel",
    label: "main jester buttons",
    blocks: [
      {
        id: "reflect-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-emerald-400 hover:text-white hover:border-emerald-500 transition",
        button: {
          label: "👂 Reflect",
          type: "listenerAction",
          actionType: "selectEar",
        },
      },
      {
        id: "think-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border bg-gray-100 text-gray-700 border-gray-300 hover:bg-sky-400 hover:text-white hover:border-sky-500 transition",
        button: {
          label: "🧠 Think",
          type: "listenerAction",
          actionType: "selectBrain",
        },
      },
      {
        id: "interrupt-btn",
        type: "button",
        buttonClass:
          "px-6 py-3 rounded-full text-base font-semibold border transition-all duration-200 bg-rose-400 text-white border-rose-500 hover:bg-rose-500",
        button: {
          label: "👄 Interrupt",
          type: "listenerAction",
          actionType: "selectMouth",
        },
      },
    ],
  },
  {
    id: "listener-mouth-semi",
    layout: "row",
    panelType: "listenerSyncPanel",
    panelStyle: "flex flex-wrap gap-2 justify-center mt-2",
    label: "sub jester buttons",
    blocks: [
      {
        id: "mouth-btn-1",
        type: "button",
        buttonClass:
          "px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 hover:bg-yellow-200 text-yellow-700",
        button: {
          label: "➕ Add on",
          type: "semiListenerAction",
          actionType: "addOn",
        },
      },
      {
        id: "mouth-btn-2",
        type: "button",
        buttonClass:
          "px-4 py-2 rounded-full text-sm font-medium bg-purple-100 hover:bg-purple-200 text-purple-700",
        button: {
          label: "❓ Clarify",
          type: "semiListenerAction",
          actionType: "clarify",
        },
      },
      {
        id: "mouth-btn-3",
        type: "button",
        buttonClass:
          "px-4 py-2 rounded-full text-sm font-medium bg-pink-100 hover:bg-pink-200 text-pink-700",
        button: {
          label: "❌ Disagree",
          type: "semiListenerAction",
          actionType: "disagree",
        },
      },
    ],
  },
];
