import React, { useState } from "react";

interface SessionLengthPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (durationMinutes: number) => void;
}

const SessionLengthPicker: React.FC<SessionLengthPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const durations = [60, 30, 15, 5]; // Preset options as requested
  const [showCustom, setShowCustom] = useState(false);
  const [customDuration, setCustomDuration] = useState("");

  if (!isOpen) return null;

  const handleCustomSubmit = () => {
    const duration = parseInt(customDuration);
    if (duration && duration > 0 && duration <= 120) {
      onSelect(duration);
    } else {
      alert("Please enter a valid duration between 1 and 120 minutes.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-center">
          Choose Session Length
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          As the first person to join, you get to set how long this session will
          last.
        </p>

        {!showCustom ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {durations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => onSelect(duration)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  {duration} minutes
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCustom(true)}
              className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Custom Duration
            </button>
          </>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Duration (1-120 minutes):
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter minutes..."
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleCustomSubmit}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Start Session
              </button>
              <button
                onClick={() => setShowCustom(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors">
                Back
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SessionLengthPicker;
