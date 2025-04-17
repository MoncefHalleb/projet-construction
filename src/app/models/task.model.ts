import { Image } from "./Image";
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum Status {
  UNREACHED = 'UNREACHED',
  INPROGRESS = 'INPROGRESS',
  DONE = 'DONE'
}

export interface Task {
  id: number | null; // Optionnel car généré automatiquement
  title: string;
  description: string;
  priority: Priority;
  startDate: string; // Format YYYY-MM-DD
  dueDate: string;
  status: Status;
  missionIds?: number[]; // Liste des IDs des missions liées
  image?: Image;
}
