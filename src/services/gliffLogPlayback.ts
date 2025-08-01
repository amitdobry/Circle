import { GliffMessage } from "../types/gliffMessage";

// Sample log data for playback - simulates a real multi-user session
export const sampleGliffLog: GliffMessage[] = [
  {
    userName: "Camren",
    message: {
      messageType: "textInput" as const,
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

export type PlaybackCallback = (messages: GliffMessage[]) => void;
export type PlaybackOptions = {
  speedMultiplier?: number; // Default 1.0, use 0.1 for 10x faster
  onUpdate?: PlaybackCallback;
  onComplete?: () => void;
  onStart?: () => void;
};

export class GliffLogPlaybackService {
  private isPlaying = false;
  private currentIndex = 0;
  private timeoutId: NodeJS.Timeout | null = null;
  private startTime = 0;
  private playbackMessages: GliffMessage[] = [];

  constructor(private logData: GliffMessage[] = sampleGliffLog) {}

  async startPlayback(options: PlaybackOptions = {}) {
    if (this.isPlaying) {
      console.warn("Playback already in progress");
      return;
    }

    const {
      speedMultiplier = 0.1, // 10x faster for demo purposes
      onUpdate,
      onComplete,
      onStart,
    } = options;

    this.isPlaying = true;
    this.currentIndex = 0;
    this.playbackMessages = [];
    this.startTime = Date.now();

    console.log("🎬 Starting GliffLog playback...");
    onStart?.();

    const playNextMessage = () => {
      if (!this.isPlaying || this.currentIndex >= this.logData.length) {
        this.completePlayback(onComplete);
        return;
      }

      const currentMessage = this.logData[this.currentIndex];
      this.playbackMessages.push(currentMessage);

      console.log(
        `📩 [${currentMessage.userName}] ${
          currentMessage.message.messageType
        }: ${currentMessage.message.content}${
          currentMessage.message.emoji ? ` ${currentMessage.message.emoji}` : ""
        }`
      );

      // Update UI with current messages
      onUpdate?.(this.playbackMessages);

      this.currentIndex++;

      // Calculate delay to next message
      if (this.currentIndex < this.logData.length) {
        const currentTimestamp = currentMessage.message.timestamp || 0;
        const nextTimestamp =
          this.logData[this.currentIndex].message.timestamp || 0;
        const realDelay = nextTimestamp - currentTimestamp;
        const scaledDelay = Math.max(100, realDelay * speedMultiplier); // Minimum 100ms delay

        this.timeoutId = setTimeout(playNextMessage, scaledDelay);
      } else {
        this.completePlayback(onComplete);
      }
    };

    // Start immediately with first message
    playNextMessage();
  }

  stopPlayback() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isPlaying = false;
    console.log("⏹️ Playback stopped");
  }

  private completePlayback(onComplete?: () => void) {
    this.isPlaying = false;
    this.timeoutId = null;
    const duration = Date.now() - this.startTime;
    console.log(`✅ Playback completed in ${duration}ms`);
    onComplete?.();
  }

  getCurrentMessages(): GliffMessage[] {
    return [...this.playbackMessages];
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  reset() {
    this.stopPlayback();
    this.currentIndex = 0;
    this.playbackMessages = [];
  }
}

// Singleton instance for global use
export const gliffPlaybackService = new GliffLogPlaybackService();
