// D.O.S. Collaboration OS - Store Types
// These types mirror the Prisma schema for frontend state management

// ============================================
// ENUMS
// ============================================

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
export type UserMode = 'design' | 'innovation' | 'education';
export type SubscriptionPlan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
export type ChannelType = 'PUBLIC' | 'PRIVATE' | 'DIRECT';
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
export type ABCoDEPhase = 'ACQUAINTANCE' | 'BUILD_UP' | 'CONTINUATION' | 'DETERIORATION' | 'ENDING';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// ============================================
// CORE ENTITIES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  mode: UserMode;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  plan: SubscriptionPlan;
  trialEndsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  type: ChannelType;
  icon: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// MESSAGES & COMMUNICATION
// ============================================

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  parentId: string | null;
  content: string;
  attachments: string | null;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
  user?: User;
}

// ============================================
// PROJECTS & TASKS
// ============================================

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  status: ProjectStatus;
  progress: number;
  currentPhase: ABCoDEPhase;
  startDate: Date | null;
  endDate: Date | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  phaseId: string | null;
  parentId: string | null;
  title: string;
  description: string | null;
  assigneeId: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  completedAt: Date | null;
  order: number;
  abcodeTag: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignee?: User | null;
  subtasks?: Task[];
}

export interface ProjectPhase {
  id: string;
  projectId: string;
  phase: ABCoDEPhase;
  name: string;
  description: string | null;
  objectives: string | null;
  status: string;
  progress: number;
  startDate: Date | null;
  endDate: Date | null;
  completedAt: Date | null;
  output: string | null;
  insights: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// UI TYPES
// ============================================

export type ActivePanel = 'chat' | 'project' | 'concept' | 'prompt' | 'knowledge' | 'mesh' | null;
export type Theme = 'light' | 'dark';
