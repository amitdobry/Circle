const {
  GliffLogPlaybackService,
  sampleGliffLog,
} = require("../../services/gliffLogPlayback");

describe("GliffLogPlaybackService", () => {
  describe("Basic Functionality", () => {
    it("should create service instance with sample data", () => {
      const service = new GliffLogPlaybackService();

      expect(service.isCurrentlyPlaying()).toBe(false);
      expect(service.getCurrentMessages()).toEqual([]);
    });

    it("should have valid sample log data", () => {
      expect(sampleGliffLog).toBeDefined();
      expect(Array.isArray(sampleGliffLog)).toBe(true);
      expect(sampleGliffLog.length).toBe(8);

      // Check first message structure
      expect(sampleGliffLog[0]).toHaveProperty("userName");
      expect(sampleGliffLog[0]).toHaveProperty("message");
      expect(sampleGliffLog[0].userName).toBe("Camren");
    });

    it("should start and stop playback", () => {
      const service = new GliffLogPlaybackService();
      const onStart = jest.fn();

      service.startPlayback({ onStart });
      expect(onStart).toHaveBeenCalledTimes(1);
      expect(service.isCurrentlyPlaying()).toBe(true);

      service.stopPlayback();
      expect(service.isCurrentlyPlaying()).toBe(false);
    });

    it("should reset service state", () => {
      const service = new GliffLogPlaybackService();

      service.startPlayback({});
      service.reset();

      expect(service.isCurrentlyPlaying()).toBe(false);
      expect(service.getCurrentMessages()).toEqual([]);
    });

    it("should prevent multiple simultaneous playbacks", () => {
      const service = new GliffLogPlaybackService();
      const consoleSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      const onStart1 = jest.fn();
      const onStart2 = jest.fn();

      service.startPlayback({ onStart: onStart1 });
      service.startPlayback({ onStart: onStart2 });

      expect(onStart1).toHaveBeenCalledTimes(1);
      expect(onStart2).toHaveBeenCalledTimes(0);
      expect(consoleSpy).toHaveBeenCalledWith("Playback already in progress");

      service.stopPlayback();
      consoleSpy.mockRestore();
    });
  });

  describe("Sample Data Validation", () => {
    it("should contain expected participants", () => {
      const participants = [
        ...new Set(sampleGliffLog.map((entry) => entry.userName)),
      ];
      expect(participants).toEqual(["Camren", "Peter", "Jim"]);
    });

    it("should contain both text and gesture messages", () => {
      const textMessages = sampleGliffLog.filter(
        (entry) => entry.message.messageType === "textInput"
      );
      const gestureMessages = sampleGliffLog.filter(
        (entry) => entry.message.messageType === "gesture"
      );

      expect(textMessages.length).toBe(4);
      expect(gestureMessages.length).toBe(4);
      expect(gestureMessages.every((msg) => msg.message.emoji)).toBe(true);
    });

    it("should have chronologically ordered timestamps", () => {
      const timestamps = sampleGliffLog.map(
        (entry) => entry.message.timestamp || 0
      );
      const sortedTimestamps = [...timestamps].sort((a, b) => a - b);

      expect(timestamps).toEqual(sortedTimestamps);
    });
  });
});
