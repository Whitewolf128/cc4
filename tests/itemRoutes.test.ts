import request from "supertest";
import type { Request, Response } from "express";
import app from "../src/app";
import * as projectController from "../src/api/v1/controllers/projectController";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { createProject, deleteProject, getAllProjects, updateProject } from "../src/api/v1/services/projectService";


jest.mock("../src/api/v1/controllers/projectController", () => ({
    getAllProjects: jest.fn((req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
    createProject: jest.fn((req: Request, res: Response) => res.status(HTTP_STATUS.CREATED).send()),
    updateProject: jest.fn((req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
    deleteProject: jest.fn((req: Request, res: Response) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Project Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/projects/", () => {
        it("should call getAllProjects controller", async () => {
            await request(app).get("/api/v1/projects/");
            expect(projectController.getAllProjects).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/projects/", () => {
        it("should call createProject controller with valid data", async () => {
            const mockProject = {
                name: "Test Item",
                description: "Test description",
            }; 

            await request(app).post("/api/v1/items/").send(mockProject);
            expect(projectController.createProject).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/projects/:id", () => {
        it("should call updateProject controller with valid data", async () => {
            const mockProject = {
                name: "Updated Project",
                description: "Updated description",
            }; 

            await request(app).put("/api/v1/projects/testId").send(mockProject);
            expect(projectController.updateProject).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/projects/:id", () => {
        it("should call deleteProject controller with valid data", async () => {
            await request(app).delete("/api/v1/projects/testId");
            expect(projectController.deleteProject).toHaveBeenCalled();
        });
    });
})