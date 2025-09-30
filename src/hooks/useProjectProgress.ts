/**
 * Custom hook for optimized project progress management
 * Handles progress calculations with performance optimizations
 */

import { useCallback } from 'react';
import {
  Project,
  Step,
  Task,
  recalculateProjectProgress
} from '@/utils/progressCalculator';

interface UseProjectProgressResult {
  /**
   * Optimized function to toggle a step's completion status
   * Only recalculates progress for the affected project
   */
  toggleStep: (stepId: string, projects: Project[]) => Project[];

  /**
   * Optimized function to toggle a task's completion status
   * Only recalculates progress for the affected project
   */
  toggleTask: (taskId: string, projects: Project[]) => Project[];

  /**
   * Add a new task to a specific step and recalculate progress
   */
  addTask: (projectId: string, stepId: string, title: string, projects: Project[]) => Project[];

  /**
   * Add a new step to a project and recalculate progress
   */
  addStep: (projectId: string, step: Omit<Step, 'id' | 'progress'>, projects: Project[]) => Project[];

  /**
   * Create a new project with calculated initial progress
   */
  createProject: (project: Omit<Project, 'id' | 'progress' | 'status'>, projects: Project[]) => Project[];

  /**
   * Get memoized project statistics
   */
  getProjectStats: (projects: Project[]) => {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    notStarted: number;
  };
}

export function useProjectProgress(): UseProjectProgressResult {
  const toggleStep = useCallback((stepId: string, projects: Project[]): Project[] => {
    // Find which project contains the step to minimize operations
    const projectIndex = projects.findIndex(project =>
      project.steps.some(step => step.id === stepId)
    );

    if (projectIndex === -1) {
      return projects; // Step not found, return unchanged
    }

    const targetProject = projects[projectIndex];

    // Toggle the step in the target project
    const updatedProject = {
      ...targetProject,
      steps: targetProject.steps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            completed: !step.completed,
            completedAt: !step.completed ? new Date() : undefined
          };
        }
        return step;
      })
    };

    // Recalculate progress only for this project
    const recalculatedProject = recalculateProjectProgress(updatedProject);

    // Return new array with only the affected project changed
    const newProjects = [...projects];
    newProjects[projectIndex] = recalculatedProject;
    return newProjects;
  }, []);

  const toggleTask = useCallback((taskId: string, projects: Project[]): Project[] => {
    // Find which project and step contain the task
    const projectIndex = projects.findIndex(project =>
      project.steps.some(step =>
        step.tasks.some(task => task.id === taskId)
      )
    );

    if (projectIndex === -1) {
      return projects; // Task not found, return unchanged
    }

    const targetProject = projects[projectIndex];

    // Toggle the task in the target project
    const updatedProject = {
      ...targetProject,
      steps: targetProject.steps.map(step => ({
        ...step,
        tasks: step.tasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined
            };
          }
          return task;
        })
      }))
    };

    // Recalculate progress only for this project
    const recalculatedProject = recalculateProjectProgress(updatedProject);

    // Return new array with only the affected project changed
    const newProjects = [...projects];
    newProjects[projectIndex] = recalculatedProject;
    return newProjects;
  }, []);

  const addTask = useCallback((
    projectId: string,
    stepId: string,
    title: string,
    projects: Project[]
  ): Project[] => {
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return projects; // Project not found
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      stepId: stepId,
      title: title.trim(),
      completed: false,
      priority: 'medium'
    };

    const targetProject = projects[projectIndex];
    const updatedProject = {
      ...targetProject,
      steps: targetProject.steps.map(step => {
        if (step.id === stepId) {
          return { ...step, tasks: [...step.tasks, task] };
        }
        return step;
      })
    };

    // Recalculate progress for the affected project
    const recalculatedProject = recalculateProjectProgress(updatedProject);

    const newProjects = [...projects];
    newProjects[projectIndex] = recalculatedProject;
    return newProjects;
  }, []);

  const addStep = useCallback((
    projectId: string,
    stepData: Omit<Step, 'id' | 'progress'>,
    projects: Project[]
  ): Project[] => {
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return projects; // Project not found
    }

    const step: Step = {
      ...stepData,
      id: `step-${Date.now()}`,
      progress: 0
    };

    const targetProject = projects[projectIndex];
    const updatedProject = {
      ...targetProject,
      steps: [...targetProject.steps, step]
    };

    // Recalculate progress for the affected project
    const recalculatedProject = recalculateProjectProgress(updatedProject);

    const newProjects = [...projects];
    newProjects[projectIndex] = recalculatedProject;
    return newProjects;
  }, []);

  const createProject = useCallback((
    projectData: Omit<Project, 'id' | 'progress' | 'status'>,
    projects: Project[]
  ): Project[] => {
    const rawProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      progress: 0,
      status: 'not-started'
    };

    // Calculate initial progress and status
    const project = recalculateProjectProgress(rawProject);

    return [...projects, project];
  }, []);

  const getProjectStats = useCallback((projects: Project[]) => {
    const stats = {
      total: projects.length,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      notStarted: 0
    };

    for (const project of projects) {
      switch (project.status) {
        case 'completed':
          stats.completed++;
          break;
        case 'in-progress':
          stats.inProgress++;
          break;
        case 'overdue':
          stats.overdue++;
          break;
        case 'not-started':
          stats.notStarted++;
          break;
      }
    }

    return stats;
  }, []);

  return {
    toggleStep,
    toggleTask,
    addTask,
    addStep,
    createProject,
    getProjectStats
  };
}

export default useProjectProgress;