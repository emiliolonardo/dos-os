/**
 * D.O.S. Collaboration OS - TypeScript Type Definitions
 * 
 * Comprehensive type definitions for the multi-tenant collaboration system.
 * Architecture: Organization → Workspace → Users → Projects → Modules
 */

// ============================================
// ENUMS
// ============================================

/**
 * User roles within organizations and workspaces
 */
export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

/**
 * User interaction modes for personalized experience
 */
export enum UserMode {
  DESIGN = 'DESIGN',
  INNOVATION = 'INNOVATION',
  EDUCATION = 'EDUCATION',
}

/**
 * Organization subscription plans
 */
export enum SubscriptionPlan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

/**
 * Channel visibility types for communication layer
 */
export enum ChannelType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  DIRECT = 'DIRECT',
}

/**
 * Project lifecycle status
 */
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * ABCoDE Methodology Phases
 * A framework for project lifecycle management
 */
export enum ABCoDEPhase {
  /** Discovery, Research, Understanding */
  ACQUAINTANCE = 'ACQUAINTANCE',
  /** Development, Creation, Growth */
  BUILD_UP = 'BUILD_UP',
  /** Maintenance, Evolution, Optimization */
  CONTINUATION = 'CONTINUATION',
  /** Analysis, Problems, Challenges */
  DETERIORATION = 'DETERIORATION',
  /** Conclusion, Documentation, Archive */
  ENDING = 'ENDING',
}

/**
 * Task status for project management
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

/**
 * Task priority levels
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Concept lifecycle status
 */
export enum ConceptStatus {
  DRAFT = 'draft',
  REFINED = 'refined',
  ARCHIVED = 'archived',
}

/**
 * Mesh node types for the innovation graph
 */
export enum MeshNodeType {
  USER = 'USER',
  PROJECT = 'PROJECT',
  CONCEPT = 'CONCEPT',
  TASK = 'TASK',
  KNOWLEDGE = 'KNOWLEDGE',
}

// ============================================
// MULTI-TENANT TYPES
// ============================================

/**
 * Organization entity representing a company or team
 */
export type Organization = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  plan: SubscriptionPlan;
  trialEndsAt?: Date | null;
  settings?: string | null; // JSON stored as string
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Organization membership linking users to organizations
 */
export type OrganizationMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: UserRole;
  joinedAt: Date;
};

/**
 * Invitation for new organization members
 */
export type Invitation = {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date;
  createdAt: Date;
};

/**
 * Workspace within an organization for team isolation
 */
export type Workspace = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  isDefault: boolean;
  settings?: string | null; // JSON stored as string
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Workspace membership linking users to workspaces
 */
export type WorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: UserRole;
  joinedAt: Date;
};

/**
 * User entity with profile and preferences
 */
export type User = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  password?: string | null;
  displayName?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  mode: UserMode;
  preferences?: string | null; // JSON stored as string
  emailVerified?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// COMMUNICATION TYPES
// ============================================

/**
 * Channel for team communication (Slack-like)
 */
export type Channel = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string | null;
  type: ChannelType;
  icon?: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Channel membership tracking
 */
export type ChannelMember = {
  id: string;
  channelId: string;
  userId: string;
  joinedAt: Date;
  lastReadAt?: Date | null;
};

/**
 * Message in a channel or thread
 */
export type Message = {
  id: string;
  channelId: string;
  userId: string;
  parentId?: string | null; // For threaded messages
  content: string; // Markdown content
  attachments?: string | null; // JSON array of attachments
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Emoji reaction to a message
 */
export type MessageReaction = {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: Date;
};

/**
 * Thread of messages (replies to a parent message)
 */
export type Thread = {
  id: string;
  parentMessageId: string;
  channelId: string;
  replyCount: number;
  lastReplyAt: Date;
  participants: string[]; // User IDs
};

// ============================================
// PROJECT TYPES
// ============================================

/**
 * Project entity with ABCoDE methodology integration
 */
export type Project = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  status: ProjectStatus;
  progress: number;
  currentPhase: ABCoDEPhase;
  startDate?: Date | null;
  endDate?: Date | null;
  isArchived: boolean;
  settings?: string | null; // JSON stored as string
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Project phase following ABCoDE methodology
 */
export type ProjectPhase = {
  id: string;
  projectId: string;
  phase: ABCoDEPhase;
  name: string;
  description?: string | null;
  objectives?: string | null; // JSON array of objectives
  status: 'pending' | 'active' | 'completed';
  progress: number;
  startDate?: Date | null;
  endDate?: Date | null;
  completedAt?: Date | null;
  output?: string | null; // Generated output for this phase
  insights?: string | null; // AI-generated insights
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Task within a project
 */
export type Task = {
  id: string;
  projectId: string;
  phaseId?: string | null;
  parentId?: string | null; // For subtasks
  title: string;
  description?: string | null;
  assigneeId?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date | null;
  completedAt?: Date | null;
  order: number;
  abcodeTag?: string | null; // Which ABCoDE phase this task relates to
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Comment on a task
 */
export type TaskComment = {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * File attachment on a task
 */
export type TaskAttachment = {
  id: string;
  taskId: string;
  name: string;
  url: string;
  type: string; // MIME type
  size?: number | null; // in bytes
  createdAt: Date;
};

/**
 * Deliverable for project milestones
 */
export type Deliverable = {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  content?: string | null; // Markdown content
  attachments?: string | null; // JSON array of attachments
  dueDate?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// CONCEPT TYPES
// ============================================

/**
 * Concept for idea generation and innovation
 */
export type Concept = {
  id: string;
  workspaceId?: string | null;
  projectId?: string | null;
  userId: string;
  title: string;
  description: string;
  category?: string | null; // product, service, experience, etc.
  isAIGenerated: boolean;
  aiPrompt?: string | null; // The prompt used to generate
  content?: string | null; // Markdown detailed content
  tags?: string | null; // JSON array of tags
  variants?: string | null; // JSON array of variants
  imageUrl?: string | null;
  status: ConceptStatus;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// PROMPT BUILDER TYPES
// ============================================

/**
 * Structured prompt for AI interactions
 */
export type Prompt = {
  id: string;
  workspaceId?: string | null;
  userId: string;
  title: string;
  description?: string | null;
  objective?: string | null; // What you want to achieve
  context?: string | null; // Background information
  desiredOutput?: string | null; // Expected output format
  tone?: string | null; // Voice/tone preferences
  constraints?: string | null; // JSON array of constraints
  generatedPrompt: string; // The final optimized prompt
  isTemplate: boolean;
  templateCategory?: string | null;
  model?: string | null; // Which AI model this is for
  category?: string | null; // Category of prompt
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Reusable prompt template
 */
export type PromptTemplate = {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  structure: string; // JSON template structure
  isPublic: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// KNOWLEDGE TYPES
// ============================================

/**
 * Knowledge page for documentation (Notion-like)
 */
export type KnowledgePage = {
  id: string;
  workspaceId?: string | null;
  projectId?: string | null;
  parentId?: string | null; // For nested pages
  title: string;
  slug: string;
  icon?: string | null;
  coverImage?: string | null;
  content: string; // Markdown content
  isArchived: boolean;
  isPublished: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

// ============================================
// MESH TYPES
// ============================================

/**
 * Node in the innovation mesh graph
 */
export type MeshNode = {
  id: string;
  workspaceId?: string | null;
  projectId?: string | null;
  userId?: string | null;
  type: MeshNodeType;
  referenceId: string; // ID of the referenced entity
  label: string;
  description?: string | null;
  x?: number | null; // Visualization position
  y?: number | null; // Visualization position
  color?: string | null;
  size?: number | null;
  weight: number; // Connection weight
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Edge connecting nodes in the mesh graph
 */
export type MeshEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  type: string; // created_by, works_on, relates_to, depends_on, etc.
  label?: string | null;
  weight: number;
  isAISuggested: boolean;
  createdAt: Date;
};

// ============================================
// AI TYPES
// ============================================

/**
 * AI session for conversational interactions
 */
export type AISession = {
  id: string;
  userId: string;
  type: 'concept_generation' | 'prompt_building' | 'synthesis' | 'suggestion';
  context?: string | null; // JSON context
  messages: string; // JSON array of messages
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
};

/**
 * AI-generated suggestion for users
 */
export type AISuggestion = {
  id: string;
  type: 'task' | 'concept' | 'connection' | 'insight';
  content: string; // JSON suggestion content
  projectId?: string | null;
  taskId?: string | null;
  conceptId?: string | null;
  status: 'pending' | 'accepted' | 'dismissed';
  createdAt: Date;
};

// ============================================
// ACTIVITY & NOTIFICATION TYPES
// ============================================

/**
 * Activity record for tracking user actions
 */
export type Activity = {
  id: string;
  userId?: string | null;
  projectId?: string | null;
  type: string; // task_completed, message_sent, concept_created, etc.
  description: string;
  metadata?: string | null; // JSON additional data
  createdAt: Date;
};

/**
 * User notification
 */
export type Notification = {
  id: string;
  userId: string;
  type: string; // mention, assignment, update, etc.
  title: string;
  content?: string | null;
  link?: string | null; // URL to related content
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
};

// ============================================
// FILE STORAGE TYPE
// ============================================

/**
 * File storage metadata
 */
export type File = {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  workspaceId?: string | null;
  projectId?: string | null;
  uploadedBy?: string | null;
  createdAt: Date;
};

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Standard API response wrapper
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
};

/**
 * Paginated API response for list endpoints
 */
export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// ============================================
// UI STATE TYPES
// ============================================

/**
 * User preferences for UI customization
 */
export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    mentions: boolean;
    assignments: boolean;
    updates: boolean;
  };
  sidebar: {
    collapsed: boolean;
    width: number;
  };
  editor: {
    fontSize: number;
    fontFamily: string;
    lineNumbers: boolean;
    wordWrap: boolean;
  };
};

/**
 * Workspace-level settings
 */
export type WorkspaceSettings = {
  features: {
    chat: boolean;
    projects: boolean;
    concepts: boolean;
    knowledge: boolean;
    mesh: boolean;
    ai: boolean;
  };
  defaults: {
    projectStatus: ProjectStatus;
    taskPriority: TaskPriority;
    channelType: ChannelType;
  };
  integrations: {
    enabled: string[];
    config: Record<string, unknown>;
  };
  permissions: {
    allowGuestInvites: boolean;
    requireApproval: boolean;
    defaultRole: UserRole;
  };
};

// ============================================
// RELATIONAL TYPES (for populated entities)
// ============================================

/**
 * Organization with populated members
 */
export type OrganizationWithMembers = Organization & {
  members: (OrganizationMember & { user: User })[];
};

/**
 * Workspace with populated relations
 */
export type WorkspaceWithRelations = Workspace & {
  organization: Organization;
  members: (WorkspaceMember & { user: User })[];
};

/**
 * Project with populated phase information
 */
export type ProjectWithPhases = Project & {
  phases: ProjectPhase[];
  tasks: Task[];
};

/**
 * Message with user and reactions
 */
export type MessageWithRelations = Message & {
  user: User;
  reactions: MessageReaction[];
  replies?: Message[];
};

/**
 * Task with assignee and comments
 */
export type TaskWithRelations = Task & {
  assignee?: User | null;
  comments: (TaskComment & { user: User })[];
  attachments: TaskAttachment[];
  subtasks: Task[];
};

/**
 * Channel with members
 */
export type ChannelWithMembers = Channel & {
  members: (ChannelMember & { user: User })[];
};

/**
 * Mesh node with connected edges
 */
export type MeshNodeWithEdges = MeshNode & {
  outgoingEdges: MeshEdge[];
  incomingEdges: MeshEdge[];
};
