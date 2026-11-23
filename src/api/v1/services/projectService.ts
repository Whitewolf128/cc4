import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { Project } from "../models/projectModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

// reference to the firestore collection name
const COLLECTION: string = "projects";

/**
 * Retrieves all projects from storage
 * @returns Array of all projects
 */
export const getAllProjects = async (): Promise<Project[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const projects: Project[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
            } as Project;
        });

        return projects;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new Project
 * @param ProjectData - The data for the new Project (name and description)
 * @returns The created Project with generated ID
 */
export const createProject = async (ProjectData: {
    name: string;
    description: string;
    price?: number;
}): Promise<Project> => {
    const dateNow = new Date();
    const newProject: Partial<Project> = {
        ...ProjectData,
        createdAt: dateNow,
        updatedAt: dateNow,
    };

    const ProjectId: string = await createDocument<Project>(COLLECTION, newProject);

    return structuredClone({ id: ProjectId, ...newProject } as Project);
};

/**
 * Retrieves a single Project by ID from the database
 * @param id - This ID of the Project to retrieve
 * @returns The Project if found
 */
export const getProjectById = async (id: string): Promise<Project> => {
    const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id);

    if (!doc) {
        throw new Error(`Project with ID ${id} not found`);
    }

    const data: DocumentData | undefined = doc.data();
    const Project: Project = {
        id: doc.id,
        ...data,
    } as Project;

    return structuredClone(Project);
};

/**
 * Updates (replaces) an existing Project
 * @param id - The ID of the Project to update
 * @param ProjectData - The fields to updates (name and/or description)
 * @returns The updated Project
 * @throws Error if Project with given ID is not found
 */
export const updateProject = async (
    id: string,
    ProjectData: Pick<Project, "name" | "status">
): Promise<Project> => {
    // check if the Project exists before updating
    const Project: Project = await getProjectById(id);
    if (!Project) {
        throw new Error(`Project with ID ${id} not found`);
    }

    const updateProject: Project = {
        ...Project,
        updatedAt: new Date(),
    };

    // I went for the simple option to only update defined values, you could also use an Object method like Object.entries() to be less verbose
    if (ProjectData.name !== undefined) updateProject.name = ProjectData.name;
    if(ProjectData.status !== undefined) updateProject.status = ProjectData.status;

    await updateDocument<Project>(COLLECTION, id, updateProject);

    return structuredClone(updateProject);
};

/**
 * Deletes an Project from storage
 * @param id - The ID of the Project to delete
 * @throws Error if Project with given ID is not found
 */
export const deleteProject = async (id: string): Promise<void> => {
    // check if the Project exists before deleting
    const Project: Project = await getProjectById(id);
    if (!Project) {
        throw new Error(`Project with ID ${id} not found`);
    }

    await deleteDocument(COLLECTION, id);
};

export const getProjectsById = async (id: string): Promise<Project[]> => {
    const project = (await getAllProjects()).find((i) => i.id === id);
  if (!project) {
    return [];
  }

  return [{
    ...project
  }];
};