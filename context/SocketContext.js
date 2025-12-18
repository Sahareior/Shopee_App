import React, { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (token && !socketRef.current) {
      socketRef.current = io("http://localhost:8000", {
        transports: ["websocket"],
        auth: { token },
       
      });

      socketRef.current.on("connect", () => {
        console.log("🟢 Socket connected:", socketRef.current.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
