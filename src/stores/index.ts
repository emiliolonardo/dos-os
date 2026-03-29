// D.O.S. Collaboration OS - State Management
// Export all Zustand stores

// Types
export type {
  User,
  Organization,
  Workspace,
  Channel,
  Message,
  MessageReaction,
  Project,
  Task,
  ProjectPhase,
  UserRole,
  UserMode,
  SubscriptionPlan,
  ChannelType,
  ProjectStatus,
  ABCoDEPhase,
  TaskStatus,
  TaskPriority,
  ActivePanel,
  Theme,
} from './types';

// Auth Store
export { useAuthStore } from './auth-store';
export {
  selectCurrentUser,
  selectCurrentOrganization,
  selectAuthCurrentWorkspace,
  selectUserMode,
  selectIsAuthenticated,
} from './auth-store';

// Workspace Store
export { useWorkspaceStore } from './workspace-store';
export {
  selectWorkspaces,
  selectCurrentWorkspaceId,
  selectCurrentWorkspace,
  selectChannels,
  selectCurrentChannelId,
  selectCurrentChannel,
} from './workspace-store';

// Chat Store
export { useChatStore } from './chat-store';
export {
  selectMessages,
  selectActiveThread,
  selectThreadMessages,
  selectIsLoading,
  selectHasMore,
} from './chat-store';

// Project Store
export { useProjectStore } from './project-store';
export {
  selectProjects,
  selectCurrentProjectId,
  selectCurrentProject,
  selectTasks,
  selectCurrentPhase,
  selectPhases,
  selectTasksByStatus,
  selectTasksByPhase,
} from './project-store';

// UI Store
export { useUIStore } from './ui-store';
export {
  selectSidebarOpen,
  selectRightPanelOpen,
  selectActivePanel,
  selectTheme,
  selectIsCommandPaletteOpen,
} from './ui-store';
