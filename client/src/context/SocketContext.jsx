import React, { createContext, useContext, useEffect, useState } from "react";
import { socket, connectSocket } from "../lib/socket";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onOrderProcessing(data) {
      console.log("Order processing:", data);
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent("socket:order:processing", { detail: data }));
    }

    function onOrderCompleted(data) {
      console.log("Order completed:", data);
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent("socket:order:completed", { detail: data }));
    }

    function onInventoryAlert(data) {
      console.log("Inventory alert:", data);
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent("socket:inventory:alert", { detail: data }));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("order:processing", onOrderProcessing);
    socket.on("order:completed", onOrderCompleted);
    socket.on("inventory:alert", onInventoryAlert);

    // Connect socket
    connectSocket();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("order:processing", onOrderProcessing);
      socket.off("order:completed", onOrderCompleted);
      socket.off("inventory:alert", onInventoryAlert);
    };
  }, []);

  const value = {
    isConnected,
    socket,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}