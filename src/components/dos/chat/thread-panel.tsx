"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { X, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TypingIndicator } from "./typing-indicator";
import { MessageInput } from "./message-input";
import type { Message, User } from "@/stores/types";

// ============================================
// TYPES
// ============================================

interface ThreadMessage extends Message {
  user?: User;
}

interface ThreadPanelProps {
  parentMessage: ThreadMessage | null;
  replies: ThreadMessage[];
  participants: User[];
  typingUsers?: Array<{ userId: string; userName: string }>;
  currentUserId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSendReply: (content: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  className?: string;
}

// ============================================
// THREAD PANEL COMPONENT
// ============================================

export function ThreadPanel({
  parentMessage,
  replies,
  participants,
  typingUsers = [],
  currentUserId,
  isOpen,
  onClose,
  onSendReply,
  onTypingStart,
  onTypingStop,
  className,
}: ThreadPanelProps) {
  // Unique participants count
  const participantCount = useMemo(() => {
    const uniqueIds = new Set(participants.map((p) => p.id));
    return uniqueIds.size;
  }, [participants]);

  return (
    <AnimatePresence>
      {isOpen && parentMessage && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed right-0 top-0 z-50 h-full w-96 border-l bg-background shadow-xl",
            "flex flex-col",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-muted-foreground" />
              <h3 className="font-semibold">Thread</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>

          {/* Thread Stats */}
          <div className="flex items-center gap-4 border-b px-4 py-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="size-4" />
              <span>{replies.length} replies</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="size-4" />
              <span>{participantCount} participants</span>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="flex flex-col p-4">
              {/* Parent Message */}
              <div className="mb-4">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Original Message
                </div>
                <ParentMessageCard message={parentMessage} />
              </div>

              <Separator className="my-4" />

              {/* Replies */}
              <div className="space-y-1">
                {replies.map((reply, index) => (
                  <ReplyMessageCard
                    key={reply.id}
                    message={reply}
                    isOwn={reply.userId === currentUserId}
                    showHeader={
                      index === 0 ||
                      replies[index - 1].userId !== reply.userId
                    }
                  />
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <TypingIndicator users={typingUsers} className="border-t" />
          )}

          {/* Input */}
          <MessageInput
            channelId={parentMessage.channelId}
            placeholder="Reply..."
            onSend={onSendReply}
            onTypingStart={onTypingStart}
            onTypingStop={onTypingStop}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// PARENT MESSAGE CARD COMPONENT
// ============================================

interface ParentMessageCardProps {
  message: ThreadMessage;
}

function ParentMessageCard({ message }: ParentMessageCardProps) {
  const user = message.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <div className="flex items-start gap-3">
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-sm">
              {user?.displayName || user?.name || "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), "MMM d 'at' h:mm a")}
            </span>
          </div>
          <div className="mt-1 text-sm prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// REPLY MESSAGE CARD COMPONENT
// ============================================

interface ReplyMessageCardProps {
  message: ThreadMessage;
  isOwn: boolean;
  showHeader: boolean;
}

function ReplyMessageCard({ message, isOwn, showHeader }: ReplyMessageCardProps) {
  const user = message.user;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  if (message.isDeleted) {
    return (
      <div className="py-1 px-10 text-sm text-muted-foreground italic">
        This message was deleted
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex gap-3 py-1 px-2 -mx-2 rounded-md",
        "hover:bg-muted/50"
      )}
    >
      {/* Avatar */}
      {showHeader ? (
        <Avatar className="size-7 shrink-0 mt-0.5">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-7 shrink-0" />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {showHeader && (
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "font-medium text-sm",
                isOwn && "text-primary"
              )}
            >
              {user?.displayName || user?.name || "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), "h:mm a")}
            </span>
            {message.isEdited && (
              <span className="text-xs text-muted-foreground italic">
                (edited)
              </span>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// THREAD PANEL OVERLAY COMPONENT
// ============================================

interface ThreadPanelOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThreadPanelOverlay({ isOpen, onClose }: ThreadPanelOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  );
}

export default ThreadPanel;
