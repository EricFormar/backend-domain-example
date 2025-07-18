export interface Task{
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: Date;
    completedAt?: Date;
    visible: boolean;
    userId: string;
}