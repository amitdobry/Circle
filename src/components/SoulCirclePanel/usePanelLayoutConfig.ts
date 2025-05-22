import { useEffect, useState } from "react";
import socket from "../../socket";
import { PanelConfig } from "./blockTypes";

export function usePanelLayoutConfig(userName: string) {
  const [panelConfig, setPanelConfig] = useState<PanelConfig | null>(null);

  useEffect(() => {
    socket.on("receive:panelConfig", (payload) => {
      console.log("[Client] 📦 Received panelConfig:", payload);
      setPanelConfig(payload);
    });

    return () => {
      socket.off("receive:panelConfig");
    };
  }, []);

  const fetchPanelLayout = () => {
    console.log("[Client] 🚀 Emitting request:panelConfig");
    socket.emit("request:panelConfig", { userName });
  };

  return { panelConfig, fetchPanelLayout };
}
