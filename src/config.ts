const isProduction = process.env.NODE_ENV === "production";

export const SOCKET_SERVER_URL = isProduction
  ? "https://soulcircle-server-3502a67a2c25.herokuapp.com"
  : "http://localhost:3001";
