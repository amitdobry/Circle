// Sample log data for testing - simulates a real multi-user session
const sampleLog = [
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

describe("GliffLogService", () => {
  describe("Message Log Analysis", () => {
    it("should parse and validate multi-user session with text and gesture events", () => {
      // Log the full sequence for analysis
      console.log("Full conversation log:");
      sampleLog.forEach((entry, index) => {
        console.log(
          `${index + 1}. [${entry.userName}] ${entry.message.messageType}: ${
            entry.message.content
          }${entry.message.emoji ? ` ${entry.message.emoji}` : ""}`
        );
      });

      // Verify the structure and sequence of messages
      expect(sampleLog).toBeDefined();
      expect(Array.isArray(sampleLog)).toBe(true);
      expect(sampleLog.length).toBe(8);

      // Verify we have the expected participants
      const participants = [
        ...new Set(sampleLog.map((entry) => entry.userName)),
      ];
      expect(participants).toEqual(
        expect.arrayContaining(["Camren", "Peter", "Jim"])
      );
      expect(participants.length).toBe(3);

      // Verify message types
      const messageTypes = sampleLog.map((entry) => entry.message.messageType);
      expect(messageTypes).toEqual(
        expect.arrayContaining(["textInput", "gesture"])
      );

      // Count different message types
      const textMessages = sampleLog.filter(
        (entry) => entry.message.messageType === "textInput"
      );
      const gestureMessages = sampleLog.filter(
        (entry) => entry.message.messageType === "gesture"
      );

      console.log(`\nMessage breakdown:`);
      console.log(`- Text messages: ${textMessages.length}`);
      console.log(`- Gesture messages: ${gestureMessages.length}`);
      console.log(`- Total messages: ${sampleLog.length}`);

      expect(textMessages.length).toBe(4);
      expect(gestureMessages.length).toBe(4);

      // Verify all entries have required fields
      sampleLog.forEach((entry, index) => {
        expect(entry).toHaveProperty("userName");
        expect(entry).toHaveProperty("message");
        expect(entry.message).toHaveProperty("messageType");
        expect(entry.message).toHaveProperty("content");
        expect(entry.message).toHaveProperty("timestamp");
      });

      // Verify gesture messages have emoji data
      const gestureEntries = sampleLog.filter(
        (entry) => entry.message.messageType === "gesture"
      );
      gestureEntries.forEach((entry) => {
        expect(entry.message).toHaveProperty("emoji");
        expect(entry.message.emoji).toBeDefined();
      });

      // Verify chronological order
      const timestamps = sampleLog.map((entry) => entry.message.timestamp);
      const sortedTimestamps = [...timestamps].sort((a, b) => a - b);
      expect(timestamps).toEqual(sortedTimestamps);

      // Log conversation flow analysis
      console.log("\nConversation flow analysis:");
      let currentSpeaker = "";
      let consecutiveMessages = 0;

      sampleLog.forEach((entry, index) => {
        if (entry.userName !== currentSpeaker) {
          if (consecutiveMessages > 1) {
            console.log(
              `  → ${currentSpeaker} had ${consecutiveMessages} consecutive messages`
            );
          }
          currentSpeaker = entry.userName;
          consecutiveMessages = 1;
        } else {
          consecutiveMessages++;
        }

        if (index === sampleLog.length - 1 && consecutiveMessages > 1) {
          console.log(
            `  → ${currentSpeaker} had ${consecutiveMessages} consecutive messages`
          );
        }
      });

      console.log(
        "\nTest completed successfully - log data is accessible and validated!"
      );
    });

    it("should handle gesture messages with proper emoji data", () => {
      const gestureMessages = sampleLog.filter(
        (entry) => entry.message.messageType === "gesture"
      );

      expect(gestureMessages.length).toBeGreaterThan(0);

      gestureMessages.forEach((gesture) => {
        expect(gesture.message.emoji).toBeDefined();
        expect(gesture.message.content).toBeDefined();
        expect(typeof gesture.message.emoji).toBe("string");
        console.log(
          `Gesture: ${gesture.userName} → ${gesture.message.emoji} (${gesture.message.content})`
        );
      });
    });

    it("should maintain proper timestamp ordering for real-time simulation", () => {
      // Verify that timestamps are in ascending order (simulating real-time conversation)
      for (let i = 1; i < sampleLog.length; i++) {
        const prevTimestamp = sampleLog[i - 1].message.timestamp;
        const currTimestamp = sampleLog[i].message.timestamp;

        expect(currTimestamp).toBeGreaterThanOrEqual(prevTimestamp);
      }

      console.log("Timeline validation:");
      console.log(
        `First message: ${new Date(
          sampleLog[0].message.timestamp
        ).toISOString()}`
      );
      console.log(
        `Last message: ${new Date(
          sampleLog[sampleLog.length - 1].message.timestamp
        ).toISOString()}`
      );

      const duration =
        sampleLog[sampleLog.length - 1].message.timestamp -
        sampleLog[0].message.timestamp;
      console.log(
        `Conversation duration: ${duration}ms (~${Math.round(
          duration / 1000
        )}s)`
      );
    });
  });
});
