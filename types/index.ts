export type Frequency = 'quotidienne' | 'hebdomadaire' | 'mensuelle' | 'saisonnière' | 'annuelle' | 'trimestrielle';

export interface Task {
  id: number;
  name: string;
  frequency: Frequency;
  zone: string;
  estimatedTime?: number;
}

export interface TaskInstance {
  taskId: number;
  scheduledDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  color: string;
  avatar: string;
  points: number;
}

export interface TaskAssignment {
  taskId: number;
  memberId: string;
  assignedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: number;
  memberId: string;
  comment: string;
  createdAt: string;
}
