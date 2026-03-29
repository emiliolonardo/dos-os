"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  Lock,
  MessageCircle,
  Plus,
  ChevronDown,
  ChevronRight,
  User,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Channel } from "@/stores/types";

// ============================================
// TYPES
// ============================================

interface ChannelWithUnread extends Channel {
  unreadCount?: number;
}

interface DirectMessage {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  isOnline?: boolean;
  unreadCount?: number;
}

interface ChannelCategory {
  id: string;
  name: string;
  channels: ChannelWithUnread[];
}

interface ChannelListProps {
  channels: Channel[];
  currentChannelId: string | null;
  directMessages?: DirectMessage[];
  onChannelSelect: (channel: Channel) => void;
  onDirectMessageSelect?: (dm: DirectMessage) => void;
  onAddChannel?: () => void;
  onAddDirectMessage?: () => void;
  className?: string;
}

// ============================================
// CHANNEL LIST COMPONENT
// ============================================

export function ChannelList({
  channels,
  currentChannelId,
  directMessages = [],
  onChannelSelect,
  onDirectMessageSelect,
  onAddChannel,
  onAddDirectMessage,
  className,
}: ChannelListProps) {
  // Group channels into categories
  const categories = useMemo<ChannelCategory[]>(() => {
    const publicChannels = channels.filter((c) => c.type === "PUBLIC" && !c.isArchived);
    const privateChannels = channels.filter((c) => c.type === "PRIVATE" && !c.isArchived);

    return [
      {
        id: "public",
        name: "Channels",
        channels: publicChannels.map((c) => ({ ...c, unreadCount: 0 })),
      },
      {
        id: "private",
        name: "Private Channels",
        channels: privateChannels.map((c) => ({ ...c, unreadCount: 0 })),
      },
    ].filter((cat) => cat.channels.length > 0);
  }, [channels]);

  return (
    <div className={cn("flex h-full flex-col bg-muted/30", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Chat</h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onAddChannel}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Channel List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {categories.map((category) => (
            <ChannelCategory
              key={category.id}
              category={category}
              currentChannelId={currentChannelId}
              onChannelSelect={onChannelSelect}
            />
          ))}
        </div>

        {/* Direct Messages Section */}
        {directMessages.length > 0 && (
          <div className="border-t p-2">
            <DirectMessagesSection
              directMessages={directMessages}
              onDirectMessageSelect={onDirectMessageSelect}
              onAddDirectMessage={onAddDirectMessage}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ============================================
// CHANNEL CATEGORY COMPONENT
// ============================================

interface ChannelCategoryProps {
  category: ChannelCategory;
  currentChannelId: string | null;
  onChannelSelect: (channel: Channel) => void;
}

function ChannelCategory({
  category,
  currentChannelId,
  onChannelSelect,
}: ChannelCategoryProps) {
  const [isOpen, setIsOpen] = useState(true);

  const totalUnread = category.channels.reduce(
    (sum, ch) => sum + (ch.unreadCount || 0),
    0
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
          {isOpen ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
          <span className="uppercase tracking-wide">{category.name}</span>
          {totalUnread > 0 && (
            <Badge variant="default" className="ml-auto size-5 rounded-full p-0 text-[10px]">
              {totalUnread}
            </Badge>
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatePresence>
          <div className="mt-1 space-y-0.5">
            {category.channels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isActive={currentChannelId === channel.id}
                onClick={() => onChannelSelect(channel)}
              />
            ))}
          </div>
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================
// CHANNEL ITEM COMPONENT
// ============================================

interface ChannelItemProps {
  channel: ChannelWithUnread;
  isActive: boolean;
  onClick: () => void;
}

function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  const Icon = channel.type === "PRIVATE" ? Lock : Hash;

  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{channel.name}</span>
      {channel.unreadCount && channel.unreadCount > 0 && (
        <Badge
          variant="default"
          className="ml-auto size-5 rounded-full p-0 text-[10px]"
        >
          {channel.unreadCount}
        </Badge>
      )}
    </motion.button>
  );
}

// ============================================
// DIRECT MESSAGES SECTION
// ============================================

interface DirectMessagesSectionProps {
  directMessages: DirectMessage[];
  onDirectMessageSelect?: (dm: DirectMessage) => void;
  onAddDirectMessage?: () => void;
}

function DirectMessagesSection({
  directMessages,
  onDirectMessageSelect,
  onAddDirectMessage,
}: DirectMessagesSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
          {isOpen ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
          <MessageCircle className="size-3" />
          <span className="uppercase tracking-wide">Direct Messages</span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 space-y-0.5">
          {directMessages.map((dm) => (
            <DirectMessageItem
              key={dm.id}
              directMessage={dm}
              onClick={() => onDirectMessageSelect?.(dm)}
            />
          ))}
          {onAddDirectMessage && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={onAddDirectMessage}
            >
              <Plus className="size-4" />
              <span>Add teammate</span>
            </Button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================
// DIRECT MESSAGE ITEM COMPONENT
// ============================================

interface DirectMessageItemProps {
  directMessage: DirectMessage;
  onClick: () => void;
}

function DirectMessageItem({ directMessage, onClick }: DirectMessageItemProps) {
  const initials = directMessage.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
    >
      <div className="relative">
        <Avatar className="size-6">
          <AvatarImage src={directMessage.userImage} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        {directMessage.isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-500 ring-2 ring-background" />
        )}
      </div>
      <span className="truncate">{directMessage.userName}</span>
      {directMessage.unreadCount && directMessage.unreadCount > 0 && (
        <Badge
          variant="default"
          className="ml-auto size-5 rounded-full p-0 text-[10px]"
        >
          {directMessage.unreadCount}
        </Badge>
      )}
    </motion.button>
  );
}

export default ChannelList;
