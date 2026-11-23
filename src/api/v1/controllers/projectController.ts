import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as projectService from "../services/projectService";
import { Project } from "../models/projectModel";
import { successResponse } from "../models/responseModel";

/**
 * Manages requests and reponses to retrieve all Items
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const projects: Project[] = await projectService.getAllProjects();
        res.status(HTTP_STATUS.OK).json(
            successResponse(projects, "Items successfully retireved")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, reponses, and validation to create an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract only the fields we want (destructuring)
        const { name, status } = req.body;

        const newProject: Project = await projectService.createProject({
            name,
            status
        });
        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newProject, "Project created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to update an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateProject = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // const id: string = req.params.id;
        const { id } = req.params;

        // Extract update fields
        const { name, status } = req.body;

        // create the update item object with the fields to be updated
        const updatedProject: Project = await projectService.updateProject(id, {
            name,
            status
        });

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedProject, "Project updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to delete an Item
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        await projectService.deleteProject(id);
        res.status(HTTP_STATUS.OK).json(
            successResponse("Project successfully deleted")
        );
    } catch (error: unknown) {
        next(error);
    }
};

export const getProjectsByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const project = await projectService.getProjectById(id);
        if (!project) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Project not found"
            });
            return;
        }
        res.status(HTTP_STATUS.OK).json({
            message: "Project retrieved",
            data: project
        });
    } catch (error: unknown) {
        next(error);
    }
};

