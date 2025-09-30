/**
 * Utilities for calculating project and step progress automatically
 * Based on completed tasks and steps
 */

export interface Task {
  id: string;
  stepId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completedAt?: Date;
}

export interface Step {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  tasks: Task[];
  progress: number; // 0-100 based on completed tasks
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'learning' | 'health' | 'personal' | 'financial';
  priority: 'low' | 'medium' | 'high';
  targetDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number; // 0-100
  steps: Step[];
  createdAt: Date;
}

/**
 * Calculate progress for a step based on completed tasks
 * @param step - The step to calculate progress for
 * @returns Progress percentage (0-100)
 */
export function calculateStepProgress(step: Step): number {
  if (step.tasks.length === 0) {
    // If no tasks, progress is based on step completion status
    return step.completed ? 100 : 0;
  }

  const completedTasks = step.tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / step.tasks.length) * 100);
}

/**
 * Calculate progress for a project based on completed steps and tasks
 * Uses a weighted approach where steps have equal weight
 * @param project - The project to calculate progress for
 * @returns Progress percentage (0-100)
 */
export function calculateProjectProgress(project: Project): number {
  if (project.steps.length === 0) {
    return 0;
  }

  // Calculate total progress across all steps
  let totalProgress = 0;

  for (const step of project.steps) {
    const stepProgress = calculateStepProgress(step);
    // Each step has equal weight in the project progress
    totalProgress += stepProgress;
  }

  return Math.round(totalProgress / project.steps.length);
}

/**
 * Determine project status based on progress and dates
 * @param project - The project to determine status for
 * @returns Updated project status
 */
export function calculateProjectStatus(project: Project): Project['status'] {
  const now = new Date();
  const targetDate = new Date(project.targetDate);

  // Check if project is completed (100% progress)
  if (project.progress >= 100) {
    return 'completed';
  }

  // Check if project is overdue
  if (now > targetDate && project.progress < 100) {
    return 'overdue';
  }

  // Check if project has started (has some progress or completed steps/tasks)
  if (project.progress > 0 || project.steps.some(step => step.completed || step.tasks.some(task => task.completed))) {
    return 'in-progress';
  }

  return 'not-started';
}

/**
 * Update step completion status based on task completion
 * A step is considered completed if all its tasks are completed
 * @param step - The step to update
 * @returns Updated step with correct completion status
 */
export function updateStepCompletionStatus(step: Step): Step {
  if (step.tasks.length === 0) {
    // If no tasks, keep current completion status
    return step;
  }

  const allTasksCompleted = step.tasks.every(task => task.completed);

  return {
    ...step,
    completed: allTasksCompleted,
    completedAt: allTasksCompleted && !step.completed ? new Date() :
                 !allTasksCompleted ? undefined : step.completedAt
  };
}

/**
 * Recalculate all progress values for a project and its steps
 * This is the main function to call when tasks or steps change
 * @param project - The project to recalculate
 * @returns Updated project with recalculated progress and status
 */
export function recalculateProjectProgress(project: Project): Project {
  // Update steps with recalculated progress and completion status
  const updatedSteps = project.steps.map(step => {
    const updatedStep = updateStepCompletionStatus(step);
    return {
      ...updatedStep,
      progress: calculateStepProgress(updatedStep)
    };
  });

  const projectWithUpdatedSteps = {
    ...project,
    steps: updatedSteps
  };

  // Calculate project progress
  const projectProgress = calculateProjectProgress(projectWithUpdatedSteps);

  // Update project with new progress
  const updatedProject = {
    ...projectWithUpdatedSteps,
    progress: projectProgress
  };

  // Calculate and update project status
  const projectStatus = calculateProjectStatus(updatedProject);

  return {
    ...updatedProject,
    status: projectStatus
  };
}

/**
 * Batch recalculate progress for multiple projects
 * Optimized for performance when updating multiple projects
 * @param projects - Array of projects to recalculate
 * @returns Array of updated projects
 */
export function recalculateMultipleProjects(projects: Project[]): Project[] {
  return projects.map(project => recalculateProjectProgress(project));
}