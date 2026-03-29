// D.O.S. Collaboration OS - Auth Store
// Manages user authentication state with localStorage persistence

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Organization, Workspace, UserMode } from './types';

// ============================================
// AUTH STORE STATE
// ============================================

interface AuthState {
  // State
  currentUser: User | null;
  currentOrganization: Organization | null;
  currentWorkspace: Workspace | null;
  userMode: UserMode;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, organization?: Organization, workspace?: Workspace) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setOrganization: (organization: Organization | null) => void;
  setWorkspace: (workspace: Workspace | null) => void;
  setUserMode: (mode: UserMode) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  currentUser: null,
  currentOrganization: null,
  currentWorkspace: null,
  userMode: 'design' as UserMode,
  isAuthenticated: false,
  isLoading: true,
};

// ============================================
// AUTH STORE
// ============================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      login: (user, organization, workspace) => {
        set({
          currentUser: user,
          currentOrganization: organization ?? null,
          currentWorkspace: workspace ?? null,
          userMode: (user.mode as UserMode) || 'design',
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          ...initialState,
          isLoading: false,
        });
      },

      setUser: (user) => {
        set({
          currentUser: user,
          isAuthenticated: user !== null,
        });
      },

      setOrganization: (organization) => {
        set({ currentOrganization: organization });
      },

      setWorkspace: (workspace) => {
        set({ currentWorkspace: workspace });
      },

      setUserMode: (mode) => {
        set({ userMode: mode });
        // Also update the user object if it exists
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, mode }
            : null,
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      reset: () => {
        set({
          ...initialState,
          isLoading: false,
        });
      },
    }),
    {
      name: 'dos-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentOrganization: state.currentOrganization,
        currentWorkspace: state.currentWorkspace,
        userMode: state.userMode,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================
// SELECTORS
// ============================================

export const selectCurrentUser = (state: AuthState) => state.currentUser;
export const selectCurrentOrganization = (state: AuthState) => state.currentOrganization;
export const selectAuthCurrentWorkspace = (state: AuthState) => state.currentWorkspace;
export const selectUserMode = (state: AuthState) => state.userMode;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
