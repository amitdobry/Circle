import { useEffect, useState } from "react";
import socket from "../../socket"; // adjust path if needed

export function useGestureButtons() {
  const [buttons, setButtons] = useState<{ [key: string]: any[] }>({
    ear: [],
    brain: [],
    mouth: [],
  });

  // Only listen once for gesture buttons
  useEffect(() => {
    socket.on("receive:gestureButtons", (payload) => {
      console.log(
        "[Client] Received gestureButtons:",
        JSON.stringify(payload, null, 2)
      );
      setButtons(payload);
    });

    return () => {
      socket.off("receive:gestureButtons");
    };
  }, []);

  // 🆕 Expose a function to request them
  const fetchGestures = () => {
    console.log(
      "[Client] Emitting request:gestureButtons from ListenerSyncPanel"
    );
    socket.emit("request:gestureButtons");
  };

  return { buttons, fetchGestures };
}
