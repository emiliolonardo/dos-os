// D.O.S. Collaboration OS - Project Store
// Manages projects, tasks, and ABCoDE phases

import { create } from 'zustand';
import type { Project, Task, ABCoDEPhase, TaskStatus, ProjectPhase } from './types';

// ============================================
// PROJECT STORE STATE
// ============================================

interface ProjectState {
  // State
  projects: Project[];
  currentProjectId: string | null;
  tasks: Task[];
  currentPhase: ABCoDEPhase;
  phases: ProjectPhase[];
  isLoading: boolean;

  // Actions - Projects
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  setCurrentProjectById: (id: string | null) => void;

  // Actions - Tasks
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;

  // Actions - Phases
  setPhases: (phases: ProjectPhase[]) => void;
  setCurrentPhase: (phase: ABCoDEPhase) => void;
  updatePhaseProgress: (phase: ABCoDEPhase, progress: number) => void;

  // Actions - Loading
  setLoading: (loading: boolean) => void;

  // Actions - Reset
  reset: () => void;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  projects: [],
  currentProjectId: null,
  tasks: [],
  currentPhase: 'ACQUAINTANCE' as ABCoDEPhase,
  phases: [],
  isLoading: false,
};

// ============================================
// PROJECT STORE
// ============================================

export const useProjectStore = create<ProjectState>((set, get) => ({
  ...initialState,

  // Project Actions
  setProjects: (projects) => {
    set({ projects });
  },

  addProject: (project) => {
    set((state) => ({
      projects: [...state.projects, project],
    }));
  },

  updateProject: (id, projectUpdate) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...projectUpdate } : p
      ),
    }));
  },

  removeProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
    }));
  },

  setCurrentProject: (project) => {
    set({
      currentProjectId: project?.id ?? null,
      currentPhase: project?.currentPhase ?? 'ACQUAINTANCE',
    });
  },

  setCurrentProjectById: (id) => {
    const project = get().projects.find((p) => p.id === id);
    set({
      currentProjectId: id,
      currentPhase: project?.currentPhase ?? 'ACQUAINTANCE',
    });
  },

  // Task Actions
  setTasks: (tasks) => {
    set({ tasks });
  },

  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
  },

  updateTask: (id, taskUpdate) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...taskUpdate } : t
      ),
    }));
  },

  updateTaskStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completedAt: status === 'done' ? new Date() : t.completedAt,
            }
          : t
      ),
    }));
  },

  removeTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  // Phase Actions
  setPhases: (phases) => {
    set({ phases });
  },

  setCurrentPhase: (phase) => {
    set({ currentPhase: phase });
    // Also update the current project if one is selected
    const currentProjectId = get().currentProjectId;
    if (currentProjectId) {
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === currentProjectId ? { ...p, currentPhase: phase } : p
        ),
      }));
    }
  },

  updatePhaseProgress: (phase, progress) => {
    set((state) => ({
      phases: state.phases.map((p) =>
        p.phase === phase ? { ...p, progress } : p
      ),
    }));
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

export const selectProjects = (state: ProjectState) => state.projects;
export const selectCurrentProjectId = (state: ProjectState) => state.currentProjectId;
export const selectCurrentProject = (state: ProjectState) =>
  state.projects.find((p) => p.id === state.currentProjectId) ?? null;
export const selectTasks = (state: ProjectState) => state.tasks;
export const selectCurrentPhase = (state: ProjectState) => state.currentPhase;
export const selectPhases = (state: ProjectState) => state.phases;
export const selectTasksByStatus = (status: TaskStatus) => (state: ProjectState) =>
  state.tasks.filter((t) => t.status === status);
export const selectTasksByPhase = (phase: ABCoDEPhase) => (state: ProjectState) =>
  state.tasks.filter((t) => t.abcodeTag === phase);
