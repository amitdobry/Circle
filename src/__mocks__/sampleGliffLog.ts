import { GliffMessage } from "../types/gliffMessage";

export const sampleGliffLog: GliffMessage[] = [
  {
    userName: "Camren",
    message: {
      messageType: "textInput",
      content:
        "Hellow, im Camren nice to meet! before we get started i want to say that i am very excited to be here today! i personaly thing this mock discussion is stunning, do you feel me here you guys? ",
      timestamp: 1753729621489,
    },
  },
  {
    userName: "Peter",
    message: {
      messageType: "gesture",
      content: "I feel you",
      emoji: "🤝",
      timestamp: 1753729626019,
    },
  },
  {
    userName: "Jim",
    message: {
      messageType: "gesture",
      content: "I feel you",
      emoji: "🤝",
      timestamp: 1753729633844,
    },
  },
  {
    userName: "Camren",
    message: {
      messageType: "textInput",
      content: "peter where are you from?",
      timestamp: 1753729661219,
    },
  },
  {
    userName: "Peter",
    message: {
      messageType: "textInput",
      content:
        "hello! you guys! im peter from petersburg, i like swimming with the dphins! ",
      timestamp: 1753729763760,
    },
  },
  {
    userName: "Jim",
    message: {
      messageType: "gesture",
      content: "I'm confused",
      emoji: "🤔",
      timestamp: 1753729766905,
    },
  },
  {
    userName: "Peter",
    message: {
      messageType: "textInput",
      content: "hahaha kidding, i like feeding the birds ",
      timestamp: 1753729788014,
    },
  },
  {
    userName: "Camren",
    message: {
      messageType: "gesture",
      content: "Not feeling it",
      emoji: "😕",
      timestamp: 1753729792499,
    },
  },
];
