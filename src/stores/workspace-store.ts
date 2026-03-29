// D.O.S. Collaboration OS - Workspace Store
// Manages workspace and channel state

import { create } from 'zustand';
import type { Workspace, Channel } from './types';

// ============================================
// WORKSPACE STORE STATE
// ============================================

interface WorkspaceState {
  // State
  workspaces: Workspace[];
  currentWorkspaceId: string | null;
  channels: Channel[];
  currentChannelId: string | null;
  isLoading: boolean;

  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, workspace: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setCurrentWorkspaceById: (id: string | null) => void;
  setChannels: (channels: Channel[]) => void;
  addChannel: (channel: Channel) => void;
  updateChannel: (id: string, channel: Partial<Channel>) => void;
  removeChannel: (id: string) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setCurrentChannelById: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  workspaces: [],
  currentWorkspaceId: null,
  channels: [],
  currentChannelId: null,
  isLoading: false,
};

// ============================================
// WORKSPACE STORE
// ============================================

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  ...initialState,

  setWorkspaces: (workspaces) => {
    set({ workspaces });
  },

  addWorkspace: (workspace) => {
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    }));
  },

  updateWorkspace: (id, workspaceUpdate) => {
    set((state) => ({
      workspaces: state.workspaces.map((ws) =>
        ws.id === id ? { ...ws, ...workspaceUpdate } : ws
      ),
    }));
  },

  removeWorkspace: (id) => {
    set((state) => ({
      workspaces: state.workspaces.filter((ws) => ws.id !== id),
      currentWorkspaceId: state.currentWorkspaceId === id ? null : state.currentWorkspaceId,
    }));
  },

  setCurrentWorkspace: (workspace) => {
    set({
      currentWorkspaceId: workspace?.id ?? null,
      // Clear channels when switching workspaces
      channels: workspace ? [] : get().channels,
      currentChannelId: workspace ? null : get().currentChannelId,
    });
  },

  setCurrentWorkspaceById: (id) => {
    set({
      currentWorkspaceId: id,
      channels: [],
      currentChannelId: null,
    });
  },

  setChannels: (channels) => {
    set({ channels });
  },

  addChannel: (channel) => {
    set((state) => ({
      channels: [...state.channels, channel],
    }));
  },

  updateChannel: (id, channelUpdate) => {
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.id === id ? { ...ch, ...channelUpdate } : ch
      ),
    }));
  },

  removeChannel: (id) => {
    set((state) => ({
      channels: state.channels.filter((ch) => ch.id !== id),
      currentChannelId: state.currentChannelId === id ? null : state.currentChannelId,
    }));
  },

  setCurrentChannel: (channel) => {
    set({ currentChannelId: channel?.id ?? null });
  },

  setCurrentChannelById: (id) => {
    set({ currentChannelId: id });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  reset: () => {
    set(initialState);
  },
}));

// ============================================
// SELECTORS
// ============================================

export const selectWorkspaces = (state: WorkspaceState) => state.workspaces;
export const selectCurrentWorkspaceId = (state: WorkspaceState) => state.currentWorkspaceId;
export const selectCurrentWorkspace = (state: WorkspaceState) =>
  state.workspaces.find((ws) => ws.id === state.currentWorkspaceId) ?? null;
export const selectChannels = (state: WorkspaceState) => state.channels;
export const selectCurrentChannelId = (state: WorkspaceState) => state.currentChannelId;
export const selectCurrentChannel = (state: WorkspaceState) =>
  state.channels.find((ch) => ch.id === state.currentChannelId) ?? null;
