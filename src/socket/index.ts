import { io } from "socket.io-client";
import { SOCKET_SERVER_URL } from "../config";

console.log("🔌 [Socket] Connecting to:", SOCKET_SERVER_URL);
const socket = io(SOCKET_SERVER_URL);

socket.on("connect", () => {
  console.log("✅ [Socket] Connected to server:", SOCKET_SERVER_URL);
});

socket.on("disconnect", () => {
  console.log("❌ [Socket] Disconnected from server");
});

socket.on("connect_error", (error) => {
  console.error("🚨 [Socket] Connection error:", error);
});

export default socket;
