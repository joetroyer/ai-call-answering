import { create } from 'zustand';
import { TestTemplate } from '../types/agent';

interface Workspace {
  id: string;
  name: string;
}

interface WorkspaceStore {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  templates: TestTemplate[];
  addWorkspace: (workspace: Workspace) => void;
  setCurrentWorkspace: (workspace: Workspace) => void;
  addTemplate: (template: Omit<TestTemplate, 'id'>) => void;
  updateTemplate: (id: string, template: Partial<TestTemplate>) => void;
  deleteTemplate: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  templates: [],
  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    })),
  setCurrentWorkspace: (workspace) =>
    set(() => ({
      currentWorkspace: workspace,
    })),
  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, { ...template, id: crypto.randomUUID() }],
    })),
  updateTemplate: (id, template) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, ...template } : t
      ),
    })),
  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    })),
}));