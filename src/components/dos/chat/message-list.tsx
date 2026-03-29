"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { format, isToday, isYesterday, isSameDay, parseISO } from "date-fns";
import {
  Loader2,
  MessageSquare,
  Smile,
  MoreHorizontal,
  Reply,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Message, MessageReaction, User } from "@/stores/types";

// ============================================
// TYPES
// ============================================

interface MessageWithUser extends Message {
  user?: User;
  reactions?: MessageReaction[];
  replyCount?: number;
}

interface MessageGroup {
  date: Date;
  label: string;
  messages: MessageWithUser[];
}

interface MessageListProps {
  messages: MessageWithUser[];
  currentUserId?: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onOpenThread?: (messageId: string) => void;
  className?: string;
}

// ============================================
// MESSAGE LIST COMPONENT
// ============================================

export function MessageList({
  messages,
  currentUserId,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  onOpenThread,
  className,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Group messages by date
  const messageGroups = useMemo<MessageGroup[]>(() => {
    const groups: Map<string, MessageGroup> = new Map();

    messages.forEach((message) => {
      const date = new Date(message.createdAt);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups.has(dateKey)) {
        groups.set(dateKey, {
          date,
          label: formatDateLabel(date),
          messages: [],
        });
      }

      groups.get(dateKey)!.messages.push(message);
    });

    return Array.from(groups.values());
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (shouldAutoScroll && scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, shouldAutoScroll]);

  // Handle scroll for auto-scroll detection
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const isAtBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
      setShouldAutoScroll(isAtBottom);

      // Load more when scrolled to top
      if (target.scrollTop === 0 && hasMore && onLoadMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, onLoadMore, isLoading]
  );

  return (
    <div className={cn("relative flex h-full flex-col", className)}>
      {/* Load More Button */}
      {hasMore && (
        <div className="sticky top-0 z-10 flex justify-center border-b bg-background/80 backdrop-blur-sm py-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={() => onLoadMore?.()}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              "Load older messages"
            )}
          </Button>
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1" onScroll={handleScroll}>
        <div className="flex flex-col gap-1 p-4">
          <AnimatePresence mode="popLayout">
            {messageGroups.map((group) => (
              <div key={format(group.date, "yyyy-MM-dd")}>
                {/* Date Separator */}
                <DateSeparator label={group.label} />

                {/* Messages in group */}
                {group.messages.map((message, index) => {
                  const prevMessage = group.messages[index - 1];
                  const showHeader =
                    !prevMessage ||
                    prevMessage.userId !== message.userId ||
                    !isSameDay(
                      new Date(prevMessage.createdAt),
                      new Date(message.createdAt)
                    ) ||
                    differenceInMinutes(
                      new Date(message.createdAt),
                      new Date(prevMessage.createdAt)
                    ) > 5;

                  return (
                    <MessageItem
                      key={message.id}
                      message={message}
                      showHeader={showHeader}
                      isOwn={message.userId === currentUserId}
                      onReply={onReply}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onReaction={onReaction}
                      onOpenThread={onOpenThread}
                    />
                  );
                })}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================
// DATE SEPARATOR COMPONENT
// ============================================

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="relative my-4 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" />
      </div>
      <span className="relative z-10 bg-background px-3 text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// ============================================
// MESSAGE ITEM COMPONENT
// ============================================

interface MessageItemProps {
  message: MessageWithUser;
  showHeader: boolean;
  isOwn: boolean;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onOpenThread?: (messageId: string) => void;
}

function MessageItem({
  message,
  showHeader,
  isOwn,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  onOpenThread,
}: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
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
      <div className="py-1 px-12 text-sm text-muted-foreground italic">
        This message was deleted
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "group relative flex gap-3 py-0.5 px-2 -mx-2 rounded-md",
        isHovered && "bg-muted/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar */}
      {showHeader ? (
        <Avatar className="size-9 shrink-0 mt-0.5">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-9 shrink-0" />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {showHeader && (
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-sm">
              {user?.displayName || user?.name || "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(new Date(message.createdAt))}
            </span>
            {message.isEdited && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <ReactionBadges
            reactions={message.reactions}
            onReact={(emoji) => onReaction?.(message.id, emoji)}
          />
        )}

        {/* Thread Reply Count */}
        {message.replyCount && message.replyCount > 0 && (
          <button
            onClick={() => onOpenThread?.(message.id)}
            className="flex items-center gap-1.5 mt-1 text-xs text-primary hover:underline"
          >
            <MessageSquare className="size-3" />
            <span>{message.replyCount} replies</span>
          </button>
        )}
      </div>

      {/* Actions */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute -top-3 right-2 flex items-center gap-0.5 rounded-md border bg-background p-0.5 shadow-sm"
          >
            <ReactionPicker onReaction={(emoji) => onReaction?.(message.id, emoji)} />
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => onReply?.(message)}
            >
              <Reply className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => onOpenThread?.(message.id)}
            >
              <MessageSquare className="size-3.5" />
            </Button>
            {isOwn && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => onEdit?.(message)}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive hover:text-destructive"
                  onClick={() => onDelete?.(message.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Copy Text</DropdownMenuItem>
                <DropdownMenuItem>Copy Link</DropdownMenuItem>
                <DropdownMenuItem>Pin Message</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// REACTION BADGES COMPONENT
// ============================================

interface ReactionBadgesProps {
  reactions: MessageReaction[];
  onReact?: (emoji: string) => void;
}

function ReactionBadges({ reactions, onReact }: ReactionBadgesProps) {
  // Group reactions by emoji
  const groupedReactions = reactions.reduce(
    (acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = [];
      }
      acc[reaction.emoji].push(reaction);
      return acc;
    },
    {} as Record<string, MessageReaction[]>
  );

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(groupedReactions).map(([emoji, reactionList]) => (
        <button
          key={emoji}
          onClick={() => onReact?.(emoji)}
          className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-xs hover:bg-muted/80 transition-colors"
        >
          <span>{emoji}</span>
          <span className="text-muted-foreground">{reactionList.length}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// REACTION PICKER COMPONENT
// ============================================

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉", "👀", "🚀"];

function ReactionPicker({ onReaction }: { onReaction: (emoji: string) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {QUICK_REACTIONS.map((emoji) => (
        <Button
          key={emoji}
          variant="ghost"
          size="icon"
          className="size-7 text-base"
          onClick={() => onReaction(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDateLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d, yyyy");
}

function formatTime(date: Date): string {
  return format(date, "h:mm a");
}

function differenceInMinutes(dateA: Date, dateB: Date): number {
  return Math.abs((dateA.getTime() - dateB.getTime()) / (1000 * 60));
}

export default MessageList;
