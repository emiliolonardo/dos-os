"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Code,
  Link,
  Smile,
  Paperclip,
  Send,
  AtSign,
  Hash,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { User, Channel } from "@/stores/types";

// ============================================
// TYPES
// ============================================

interface MessageInputProps {
  channelId: string;
  placeholder?: string;
  maxLength?: number;
  users?: User[];
  channels?: Channel[];
  onSend: (content: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  className?: string;
}

// ============================================
// MESSAGE INPUT COMPONENT
// ============================================

export function MessageInput({
  channelId,
  placeholder = "Message #channel",
  maxLength = 4000,
  users = [],
  channels = [],
  onSend,
  onTypingStart,
  onTypingStop,
  className,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [showChannels, setShowChannels] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Character count
  const charCount = content.length;
  const isOverLimit = charCount > maxLength;

  // Filtered users for mentions
  const filteredUsers = useMemo(() => {
    if (!mentionFilter) return users;
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(mentionFilter.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(mentionFilter.toLowerCase())
    );
  }, [users, mentionFilter]);

  // Filtered channels for references
  const filteredChannels = useMemo(() => {
    if (!channelFilter) return channels;
    return channels.filter((channel) =>
      channel.name.toLowerCase().includes(channelFilter.toLowerCase())
    );
  }, [channels, channelFilter]);

  // Handle typing indicator - managed via refs to avoid render-cycle issues
  const handleTypingStart = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart?.();
    }
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // Set new timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingStop?.();
    }, 3000);
  }, [onTypingStart, onTypingStop]);

  const handleTypingEnd = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    isTypingRef.current = false;
    onTypingStop?.();
  }, [onTypingStop]);

  // Handle send
  const handleSend = useCallback(() => {
    if (content.trim() && !isOverLimit) {
      onSend(content.trim());
      setContent("");
      handleTypingEnd();
    }
  }, [content, isOverLimit, onSend, handleTypingEnd]);

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;
    setContent(value);
    setCursorPosition(position);

    // Handle typing indicator
    if (value.length > 0) {
      handleTypingStart();
    }

    // Check for @mention trigger
    const lastAtIndex = value.lastIndexOf("@", position);
    if (lastAtIndex !== -1 && position > lastAtIndex) {
      const textAfterAt = value.slice(lastAtIndex + 1, position);
      // Check if there's a space between @ and cursor (which would mean not a mention)
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        setMentionFilter(textAfterAt);
        setShowMentions(true);
        setShowChannels(false);
        return;
      }
    }

    // Check for #channel trigger
    const lastHashIndex = value.lastIndexOf("#", position);
    if (lastHashIndex !== -1 && position > lastHashIndex) {
      const textAfterHash = value.slice(lastHashIndex + 1, position);
      if (!textAfterHash.includes(" ") && !textAfterHash.includes("\n")) {
        setChannelFilter(textAfterHash);
        setShowChannels(true);
        setShowMentions(false);
        return;
      }
    }

    setShowMentions(false);
    setShowChannels(false);
  };

  // Insert mention
  const insertMention = (user: User) => {
    const beforeMention = content.slice(0, content.lastIndexOf("@"));
    const afterCursor = content.slice(cursorPosition);
    const mention = `@${user.displayName || user.name || "user"}`;
    const newContent = beforeMention + mention + " " + afterCursor;
    setContent(newContent);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  // Insert channel reference
  const insertChannelReference = (channel: Channel) => {
    const beforeHash = content.slice(0, content.lastIndexOf("#"));
    const afterCursor = content.slice(cursorPosition);
    const reference = `#${channel.slug}`;
    const newContent = beforeHash + reference + " " + afterCursor;
    setContent(newContent);
    setShowChannels(false);
    textareaRef.current?.focus();
  };

  // Insert formatting
  const insertFormatting = (format: "bold" | "italic" | "code" | "link") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);

    let formattedText = "";
    let cursorOffset = 0;

    switch (format) {
      case "bold":
        formattedText = `**${selectedText || "text"}**`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case "italic":
        formattedText = `*${selectedText || "text"}*`;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case "code":
        formattedText = `\`${selectedText || "code"}\``;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case "link":
        formattedText = `[${selectedText || "link"}](url)`;
        cursorOffset = selectedText ? -1 : -5;
        break;
    }

    const newContent = content.slice(0, start) + formattedText + content.slice(end);
    setContent(newContent);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Insert emoji
  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newContent = content.slice(0, start) + emoji + content.slice(start);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  return (
    <div className={cn("border-t bg-background p-4", className)}>
      {/* Toolbar */}
      <div className="mb-2 flex items-center gap-1">
        <ToolbarButton
          icon={Bold}
          tooltip="Bold"
          onClick={() => insertFormatting("bold")}
        />
        <ToolbarButton
          icon={Italic}
          tooltip="Italic"
          onClick={() => insertFormatting("italic")}
        />
        <ToolbarButton
          icon={Code}
          tooltip="Code"
          onClick={() => insertFormatting("code")}
        />
        <ToolbarButton
          icon={Link}
          tooltip="Link"
          onClick={() => insertFormatting("link")}
        />
        <EmojiPicker onEmojiSelect={insertEmoji} />
        <ToolbarButton icon={Paperclip} tooltip="Attach file" />
        <div className="ml-auto flex items-center gap-2">
          <span
            className={cn(
              "text-xs",
              isOverLimit ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {charCount}/{maxLength}
          </span>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[60px] max-h-[200px] resize-none pr-12"
          rows={1}
        />

        {/* Mentions Dropdown */}
        <AnimatePresence>
          {showMentions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full left-0 mb-1 w-full max-w-xs"
            >
              <MentionsDropdown
                users={filteredUsers}
                onSelect={insertMention}
                onClose={() => setShowMentions(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Channels Dropdown */}
        <AnimatePresence>
          {showChannels && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full left-0 mb-1 w-full max-w-xs"
            >
              <ChannelsDropdown
                channels={filteredChannels}
                onSelect={insertChannelReference}
                onClose={() => setShowChannels(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Send Button */}
        <Button
          size="icon"
          className="absolute right-2 bottom-2 size-8"
          onClick={handleSend}
          disabled={!content.trim() || isOverLimit}
        >
          <Send className="size-4" />
        </Button>
      </div>

      {/* Typing Hint */}
      <div className="mt-1 text-xs text-muted-foreground">
        Press <kbd className="rounded bg-muted px-1 py-0.5">Enter</kbd> to send,{" "}
        <kbd className="rounded bg-muted px-1 py-0.5">Shift+Enter</kbd> for new line
      </div>
    </div>
  );
}

// ============================================
// TOOLBAR BUTTON COMPONENT
// ============================================

interface ToolbarButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  onClick?: () => void;
}

function ToolbarButton({ icon: Icon, tooltip, onClick }: ToolbarButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={onClick}
      title={tooltip}
    >
      <Icon className="size-4" />
    </Button>
  );
}

// ============================================
// EMOJI PICKER COMPONENT
// ============================================

const QUICK_EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🤔",
  "👍",
  "👋",
  "🎉",
  "🔥",
  "❤️",
  "✨",
  "👀",
  "🚀",
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <Smile className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="grid grid-cols-6 gap-1">
          {QUICK_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="icon"
              className="size-8 text-lg"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================
// MENTIONS DROPDOWN COMPONENT
// ============================================

interface MentionsDropdownProps {
  users: User[];
  onSelect: (user: User) => void;
  onClose: () => void;
}

function MentionsDropdown({ users, onSelect, onClose }: MentionsDropdownProps) {
  return (
    <div className="rounded-md border bg-popover shadow-lg">
      <Command>
        <CommandList>
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup heading="Mention">
            <ScrollArea className="max-h-48">
              {users.slice(0, 10).map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.name || user.id}
                  onSelect={() => onSelect(user)}
                  className="flex items-center gap-2"
                >
                  <Avatar className="size-6">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {user.name?.slice(0, 2).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.displayName || user.name}</span>
                  {user.displayName && user.name !== user.displayName && (
                    <span className="text-xs text-muted-foreground">
                      ({user.name})
                    </span>
                  )}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

// ============================================
// CHANNELS DROPDOWN COMPONENT
// ============================================

interface ChannelsDropdownProps {
  channels: Channel[];
  onSelect: (channel: Channel) => void;
  onClose: () => void;
}

function ChannelsDropdown({ channels, onSelect }: ChannelsDropdownProps) {
  return (
    <div className="rounded-md border bg-popover shadow-lg">
      <Command>
        <CommandList>
          <CommandEmpty>No channels found.</CommandEmpty>
          <CommandGroup heading="Channel">
            <ScrollArea className="max-h-48">
              {channels.slice(0, 10).map((channel) => (
                <CommandItem
                  key={channel.id}
                  value={channel.name}
                  onSelect={() => onSelect(channel)}
                  className="flex items-center gap-2"
                >
                  <Hash className="size-4 text-muted-foreground" />
                  <span>{channel.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {channel.type.toLowerCase()}
                  </Badge>
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export default MessageInput;
