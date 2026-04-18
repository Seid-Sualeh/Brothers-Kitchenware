import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export const socket = io(baseURL || undefined, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export function connectSocket() {
  if (!socket.connected) socket.connect();
  return socket;
}
