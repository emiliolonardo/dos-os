// D.O.S. Collaboration OS - UI Store
// Manages UI state: sidebar, panels, theme

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ActivePanel, Theme } from './types';

// ============================================
// UI STORE STATE
// ============================================

interface UIState {
  // Sidebar State
  sidebarOpen: boolean;
  sidebarWidth: number;

  // Right Panel State
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  activePanel: ActivePanel;

  // Theme
  theme: Theme;

  // Modal States
  isCommandPaletteOpen: boolean;
  isSearchOpen: boolean;

  // Actions - Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;

  // Actions - Right Panel
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
  setRightPanelWidth: (width: number) => void;
  setActivePanel: (panel: ActivePanel) => void;

  // Actions - Theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Actions - Modals
  setCommandPaletteOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;

  // Actions - Reset
  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  sidebarOpen: true,
  sidebarWidth: 280,
  rightPanelOpen: false,
  rightPanelWidth: 400,
  activePanel: null as ActivePanel,
  theme: 'dark' as Theme,
  isCommandPaletteOpen: false,
  isSearchOpen: false,
};

// ============================================
// UI STORE
// ============================================

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Sidebar Actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      setSidebarWidth: (width) => {
        set({ sidebarWidth: width });
      },

      // Right Panel Actions
      toggleRightPanel: () => {
        set((state) => ({
          rightPanelOpen: !state.rightPanelOpen,
          activePanel: !state.rightPanelOpen ? state.activePanel : null,
        }));
      },

      setRightPanelOpen: (open) => {
        set({ rightPanelOpen: open });
      },

      setRightPanelWidth: (width) => {
        set({ rightPanelWidth: width });
      },

      setActivePanel: (panel) => {
        set({
          activePanel: panel,
          rightPanelOpen: panel !== null,
        });
      },

      // Theme Actions
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        // Apply theme to document
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
      },

      // Modal Actions
      setCommandPaletteOpen: (open) => {
        set({ isCommandPaletteOpen: open });
      },

      setSearchOpen: (open) => {
        set({ isSearchOpen: open });
      },

      // Reset
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'dos-ui-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        sidebarWidth: state.sidebarWidth,
        rightPanelOpen: state.rightPanelOpen,
        rightPanelWidth: state.rightPanelWidth,
        theme: state.theme,
      }),
    }
  )
);

// ============================================
// SELECTORS
// ============================================

export const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
export const selectRightPanelOpen = (state: UIState) => state.rightPanelOpen;
export const selectActivePanel = (state: UIState) => state.activePanel;
export const selectTheme = (state: UIState) => state.theme;
export const selectIsCommandPaletteOpen = (state: UIState) => state.isCommandPaletteOpen;
