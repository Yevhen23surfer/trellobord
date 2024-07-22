export type ID = string;

export interface Column{
    title: string;
    id: ID;
    tasks: Task[];
}

export interface Task{
    id: ID;
    title: string;
    createdAt: Date;
    description?: string;
    subtasks: Subtask[]; 
}

export interface Subtask {
    id: ID;
    text: string;
    completed: boolean; 
    isEditing: boolean; 
}
