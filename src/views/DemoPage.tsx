import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GliffLog from "../components/GliffMessageComponent/GliffLog";
import { GliffMessage } from "../types/gliffMessage";
import {
  gliffPlaybackService,
  PlaybackOptions,
} from "../services/gliffLogPlayback";

export default function DemoPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<GliffMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleStartDemo = useCallback(() => {
    if (gliffPlaybackService.isCurrentlyPlaying()) {
      return;
    }

    const options: PlaybackOptions = {
      speedMultiplier: 0.15, // Slightly slower for better viewing
      onStart: () => {
        setIsPlaying(true);
        setIsComplete(false);
        setMessages([]);
      },
      onUpdate: (currentMessages) => {
        setMessages([...currentMessages]);
      },
      onComplete: () => {
        setIsPlaying(false);
        setIsComplete(true);
      },
    };

    gliffPlaybackService.startPlayback(options);
  }, []);

  const handleStopDemo = useCallback(() => {
    gliffPlaybackService.stopPlayback();
    setIsPlaying(false);
  }, []);

  const handleReset = useCallback(() => {
    gliffPlaybackService.reset();
    setMessages([]);
    setIsPlaying(false);
    setIsComplete(false);
  }, []);

  const backgroundImage = "/backgrounds/glif-background6.png";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-white/80 hover:bg-white/90 rounded-lg font-medium text-gray-800 transition-colors">
            ← Back to Home
          </button>

          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            SoulCircle Demo
          </h1>

          <div className="flex gap-2">
            <button
              onClick={handleStartDemo}
              disabled={isPlaying}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isPlaying
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}>
              {isPlaying ? "🎬 Running..." : "🎬 Run Demo"}
            </button>

            {isPlaying && (
              <button
                onClick={handleStopDemo}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                ⏹️ Stop
              </button>
            )}

            <button
              onClick={handleReset}
              disabled={isPlaying}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isPlaying
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}>
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            {/* Demo Info */}
            {!isPlaying && messages.length === 0 && (
              <div className="text-center mb-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Live Conversation Playback
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Watch as a real SoulCircle conversation unfolds in
                    real-time. You'll see text messages and gesture reactions
                    from three participants:
                    <span className="font-semibold"> Camren</span>,
                    <span className="font-semibold"> Peter</span>, and
                    <span className="font-semibold"> Jim</span>.
                  </p>
                  <div className="text-sm text-gray-500">
                    🎭 The conversation includes both text input and gesture
                    reactions
                    <br />
                    ⏱️ Messages appear with realistic timing delays
                    <br />
                    💬 Watch the natural flow of digital dialogue
                  </div>
                </div>
              </div>
            )}

            {/* Status Indicator */}
            {(isPlaying || messages.length > 0) && (
              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
                    isPlaying
                      ? "bg-green-100 text-green-800 border-2 border-green-300"
                      : isComplete
                      ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border-2 border-gray-300"
                  }`}>
                  {isPlaying && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  {isPlaying
                    ? "Live Conversation in Progress..."
                    : isComplete
                    ? "✅ Demo Complete"
                    : "⏸️ Demo Paused"}
                  <span className="text-sm">
                    ({messages.length}/8 messages)
                  </span>
                </div>
              </div>
            )}

            {/* Conversation Display */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg min-h-[400px] flex items-center justify-center">
              {messages.length > 0 ? (
                <GliffLog entries={messages} me="Observer" />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <div className="text-lg">
                    Conversation will appear here...
                  </div>
                </div>
              )}
            </div>

            {/* Completion Message */}
            {isComplete && (
              <div className="text-center mt-6">
                <div className="bg-emerald-100 border-2 border-emerald-300 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">
                    🎉 Demo Complete!
                  </h3>
                  <p className="text-emerald-700 mb-4">
                    You've just witnessed a complete SoulCircle conversation
                    playback. The system successfully rendered {messages.length}{" "}
                    messages with realistic timing.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                    🔄 Run Demo Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
