import { createServer } from "http";
import { Server, Socket } from "socket.io";

// Create HTTP server
const httpServer = createServer();

// Create Socket.io server with CORS for development
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Port configuration (hardcoded as per requirements)
const PORT = 3003;

// User tracking for channels
interface User {
  id: string;
  socketId: string;
  channels: Set<string>;
}

// Store connected users
const connectedUsers = new Map<string, User>();

// Helper function to log with timestamp
function log(message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, JSON.stringify(data, null, 2));
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
}

// Handle new connection
io.on("connection", (socket: Socket) => {
  log(`User connected: ${socket.id}`);

  // Initialize user
  connectedUsers.set(socket.id, {
    id: socket.id,
    socketId: socket.id,
    channels: new Set(),
  });

  // Handle join-channel event
  socket.on("join-channel", (data: { channelId: string; userId?: string; username?: string }) => {
    try {
      const { channelId, userId, username } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) {
        log(`Error: User not found for socket ${socket.id}`);
        return;
      }

      log(`User ${socket.id} joining channel: ${channelId}`);

      // Join the room
      socket.join(channelId);
      user.channels.add(channelId);

      // Notify others in the channel
      socket.to(channelId).emit("user-joined", {
        channelId,
        userId: userId || socket.id,
        username: username || "Anonymous",
        timestamp: new Date().toISOString(),
      });

      log(`User ${socket.id} successfully joined channel ${channelId}`);
    } catch (error) {
      log(`Error in join-channel:`, error);
      socket.emit("error", { message: "Failed to join channel", error: String(error) });
    }
  });

  // Handle leave-channel event
  socket.on("leave-channel", (data: { channelId: string; userId?: string; username?: string }) => {
    try {
      const { channelId, userId, username } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) {
        log(`Error: User not found for socket ${socket.id}`);
        return;
      }

      log(`User ${socket.id} leaving channel: ${channelId}`);

      // Leave the room
      socket.leave(channelId);
      user.channels.delete(channelId);

      // Notify others in the channel
      socket.to(channelId).emit("user-left", {
        channelId,
        userId: userId || socket.id,
        username: username || "Anonymous",
        timestamp: new Date().toISOString(),
      });

      log(`User ${socket.id} successfully left channel ${channelId}`);
    } catch (error) {
      log(`Error in leave-channel:`, error);
      socket.emit("error", { message: "Failed to leave channel", error: String(error) });
    }
  });

  // Handle send-message event
  socket.on("send-message", (data: { 
    channelId: string; 
    content: string; 
    userId?: string; 
    username?: string;
    messageId?: string;
  }) => {
    try {
      const { channelId, content, userId, username, messageId } = data;
      const user = connectedUsers.get(socket.id);

      if (!user) {
        log(`Error: User not found for socket ${socket.id}`);
        return;
      }

      log(`Message received from ${socket.id} in channel ${channelId}: ${content}`);

      // Create message object
      const message = {
        id: messageId || `msg-${Date.now()}-${socket.id}`,
        channelId,
        content,
        senderId: userId || socket.id,
        senderName: username || "Anonymous",
        timestamp: new Date().toISOString(),
      };

      // Broadcast to all users in the channel (including sender)
      io.to(channelId).emit("message-received", message);

      log(`Message broadcast to channel ${channelId}`);
    } catch (error) {
      log(`Error in send-message:`, error);
      socket.emit("error", { message: "Failed to send message", error: String(error) });
    }
  });

  // Handle typing-start event
  socket.on("typing-start", (data: { channelId: string; userId?: string; username?: string }) => {
    try {
      const { channelId, userId, username } = data;

      log(`User ${socket.id} started typing in channel ${channelId}`);

      // Notify others in the channel that user is typing
      socket.to(channelId).emit("user-typing", {
        channelId,
        userId: userId || socket.id,
        username: username || "Anonymous",
        isTyping: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      log(`Error in typing-start:`, error);
    }
  });

  // Handle typing-stop event
  socket.on("typing-stop", (data: { channelId: string; userId?: string; username?: string }) => {
    try {
      const { channelId, userId, username } = data;

      log(`User ${socket.id} stopped typing in channel ${channelId}`);

      // Notify others in the channel that user stopped typing
      socket.to(channelId).emit("user-typing", {
        channelId,
        userId: userId || socket.id,
        username: username || "Anonymous",
        isTyping: false,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      log(`Error in typing-stop:`, error);
    }
  });

  // Handle disconnect event
  socket.on("disconnect", (reason: string) => {
    try {
      const user = connectedUsers.get(socket.id);

      if (user) {
        log(`User ${socket.id} disconnected. Reason: ${reason}`);

        // Notify all channels the user was in
        user.channels.forEach((channelId) => {
          socket.to(channelId).emit("user-left", {
            channelId,
            userId: socket.id,
            username: "Anonymous",
            reason: "disconnected",
            timestamp: new Date().toISOString(),
          });
        });

        // Remove user from tracking
        connectedUsers.delete(socket.id);
      }

      log(`Total connected users: ${connectedUsers.size}`);
    } catch (error) {
      log(`Error in disconnect:`, error);
    }
  });

  // Handle generic errors
  socket.on("error", (error: Error) => {
    log(`Socket error for ${socket.id}:`, error);
  });
});

// Start the server
httpServer.listen(PORT, () => {
  log(`D.O.S. Chat Service started on port ${PORT}`);
  log(`Socket.io server ready for connections`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  log("SIGTERM received, shutting down gracefully...");
  io.close(() => {
    log("Socket.io server closed");
    httpServer.close(() => {
      log("HTTP server closed");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  log("SIGINT received, shutting down gracefully...");
  io.close(() => {
    log("Socket.io server closed");
    httpServer.close(() => {
      log("HTTP server closed");
      process.exit(0);
    });
  });
});
