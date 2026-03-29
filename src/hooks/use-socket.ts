"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// ============================================
// TYPES
// ============================================

export interface SocketMessage {
  id: string;
  channelId: string;
  userId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    displayName: string | null;
  };
  reactions?: Array<{
    id: string;
    messageId: string;
    userId: string;
    emoji: string;
    user?: {
      id: string;
      name: string | null;
    };
  }>;
}

export interface TypingUser {
  userId: string;
  userName: string;
  channelId: string;
}

export interface UserPresence {
  userId: string;
  userName: string;
  channelId: string;
  joinedAt: string;
}

interface SocketEvents {
  "message-received": (message: SocketMessage) => void;
  "user-typing": (data: TypingUser) => void;
  "user-joined": (data: UserPresence) => void;
  "user-left": (data: { userId: string; channelId: string }) => void;
}

// ============================================
// SOCKET HOOK
// ============================================

interface UseSocketOptions {
  workspaceId?: string;
  userId?: string;
  userName?: string;
  autoConnect?: boolean;
}

interface UseSocketReturn {
  isConnected: boolean;
  emit: <T>(event: string, data: T) => void;
  on: <K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) => void;
  off: <K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]) => void;
  joinChannel: (channelId: string) => void;
  leaveChannel: (channelId: string) => void;
  sendMessage: (channelId: string, content: string, parentId?: string) => void;
  startTyping: (channelId: string) => void;
  stopTyping: (channelId: string) => void;
}

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { workspaceId, userId, userName, autoConnect = true } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!autoConnect || !userId) return;

    // Connect to chat service via XTransformPort header
    const socket = io("/", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      extraHeaders: {
        "X-Transform-Port": "3003",
      },
      query: {
        XTransformPort: "3003",
      },
    });

    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [autoConnect, userId]);

  // Generic emit function
  const emit = useCallback(<T,>(event: string, data: T) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  }, [isConnected]);

  // Generic on function
  const on = useCallback(<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback as (...args: unknown[]) => void);
    }
  }, []);

  // Generic off function
  const off = useCallback(<K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]) => {
    if (socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback as (...args: unknown[]) => void);
      } else {
        socketRef.current.off(event);
      }
    }
  }, []);

  // Join a channel
  const joinChannel = useCallback((channelId: string) => {
    if (socketRef.current && userId && userName) {
      socketRef.current.emit("join-channel", {
        channelId,
        userId,
        userName,
      });
    }
  }, [userId, userName]);

  // Leave a channel
  const leaveChannel = useCallback((channelId: string) => {
    if (socketRef.current && userId) {
      socketRef.current.emit("leave-channel", {
        channelId,
        userId,
      });
    }
  }, [userId]);

  // Send a message
  const sendMessage = useCallback((channelId: string, content: string, parentId?: string) => {
    if (socketRef.current && userId) {
      socketRef.current.emit("send-message", {
        channelId,
        userId,
        content,
        parentId: parentId || null,
      });
    }
  }, [userId]);

  // Start typing indicator
  const startTyping = useCallback((channelId: string) => {
    if (socketRef.current && userId && userName) {
      socketRef.current.emit("typing-start", {
        channelId,
        userId,
        userName,
      });
    }
  }, [userId, userName]);

  // Stop typing indicator
  const stopTyping = useCallback((channelId: string) => {
    if (socketRef.current && userId) {
      socketRef.current.emit("typing-stop", {
        channelId,
        userId,
      });
    }
  }, [userId]);

  return {
    isConnected,
    emit,
    on,
    off,
    joinChannel,
    leaveChannel,
    sendMessage,
    startTyping,
    stopTyping,
  };
}

export default useSocket;
