/**
 * Represents an project in the system
 */
export interface Project {
    id: string;
    name: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}