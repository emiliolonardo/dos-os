// D.O.S. Collaboration OS - Chat Store
// Manages messages, threads, and reactions

import { create } from 'zustand';
import type { Message, MessageReaction } from './types';

// ============================================
// CHAT STORE STATE
// ============================================

interface ChatState {
  // State
  messages: Message[];
  threads: Map<string, Message[]>;
  activeThread: string | null;
  isLoading: boolean;
  hasMore: boolean;
  cursor: string | null;

  // Actions - Messages
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  prependMessages: (messages: Message[]) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  removeMessage: (id: string) => void;

  // Actions - Threads
  setThreadMessages: (parentId: string, messages: Message[]) => void;
  addThreadMessage: (parentId: string, message: Message) => void;
  openThread: (messageId: string) => void;
  closeThread: () => void;

  // Actions - Reactions
  addReaction: (messageId: string, reaction: MessageReaction) => void;
  removeReaction: (messageId: string, userId: string, emoji: string) => void;

  // Actions - Pagination
  setHasMore: (hasMore: boolean) => void;
  setCursor: (cursor: string | null) => void;

  // Actions - Loading
  setLoading: (loading: boolean) => void;

  // Actions - Reset
  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  messages: [],
  threads: new Map<string, Message[]>(),
  activeThread: null,
  isLoading: false,
  hasMore: true,
  cursor: null,
};

// ============================================
// CHAT STORE
// ============================================

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  // Message Actions
  setMessages: (messages) => {
    set({ messages });
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  prependMessages: (messages) => {
    set((state) => ({
      messages: [...messages, ...state.messages],
    }));
  },

  updateMessage: (id, messageUpdate) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...messageUpdate } : msg
      ),
    }));
  },

  removeMessage: (id) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    }));
  },

  // Thread Actions
  setThreadMessages: (parentId, messages) => {
    set((state) => {
      const newThreads = new Map(state.threads);
      newThreads.set(parentId, messages);
      return { threads: newThreads };
    });
  },

  addThreadMessage: (parentId, message) => {
    set((state) => {
      const newThreads = new Map(state.threads);
      const existingThread = newThreads.get(parentId) ?? [];
      newThreads.set(parentId, [...existingThread, message]);
      return { threads: newThreads };
    });
  },

  openThread: (messageId) => {
    set({ activeThread: messageId });
  },

  closeThread: () => {
    set({ activeThread: null });
  },

  // Reaction Actions
  addReaction: (messageId, reaction) => {
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions ?? [];
          // Check if reaction already exists
          const exists = reactions.some(
            (r) => r.userId === reaction.userId && r.emoji === reaction.emoji
          );
          if (exists) return msg;
          return { ...msg, reactions: [...reactions, reaction] };
        }
        return msg;
      }),
    }));
  },

  removeReaction: (messageId, userId, emoji) => {
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions?.filter(
            (r) => !(r.userId === userId && r.emoji === emoji)
          ) ?? [];
          return { ...msg, reactions };
        }
        return msg;
      }),
    }));
  },

  // Pagination Actions
  setHasMore: (hasMore) => {
    set({ hasMore });
  },

  setCursor: (cursor) => {
    set({ cursor });
  },

  // Loading Actions
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Reset
  reset: () => {
    set(initialState);
  },
}));

// ============================================
// SELECTORS
// ============================================

export const selectMessages = (state: ChatState) => state.messages;
export const selectActiveThread = (state: ChatState) => state.activeThread;
export const selectThreadMessages = (parentId: string) => (state: ChatState) =>
  state.threads.get(parentId) ?? [];
export const selectIsLoading = (state: ChatState) => state.isLoading;
export const selectHasMore = (state: ChatState) => state.hasMore;
