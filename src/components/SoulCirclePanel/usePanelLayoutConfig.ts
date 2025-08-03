import { useEffect, useState, useCallback } from "react";
import socket from "../../socket";
import { PanelConfig } from "./blockTypes";

export function usePanelLayoutConfig(userName: string) {
  const [panelConfig, setPanelConfig] = useState<PanelConfig | null>(null);

  useEffect(() => {
    socket.on("receive:panelConfig", (payload) => {
      console.log(
        `[Client] 📦 PANEL-RESPONSE: Received panelConfig for ${userName}:`,
        payload
      );
      setPanelConfig(payload);
    });

    return () => {
      socket.off("receive:panelConfig");
    };
  }, [userName]);

  // ✅ Memoize fetchPanelLayout so it doesn't change on every render
  const fetchPanelLayout = useCallback(() => {
    const timestamp = Date.now();
    console.log(
      `[Client] 🚀 PANEL-REQUEST: Emitting request:panelConfig for ${userName} at ${timestamp}`
    );
    socket.emit("request:panelConfig", { userName });
  }, [userName]); // Only recreate if userName changes

  return { panelConfig, fetchPanelLayout };
}
