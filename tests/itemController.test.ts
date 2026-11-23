import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as projectController from "../src/api/v1/controllers/projectController";
import * as projectService from "../src/api/v1/services/projectService";
import { Project } from "../src/api/v1/models/projectModel";
import { mock } from "node:test";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("../src/api/v1/services/itemService");

describe("Project Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    // reusable mocks for any controller tests
    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis() as unknown as Response["status"],
            json: jest.fn() as unknown as Response["json"],
        };
        mockNext = jest.fn();
    });

    describe("getAllProjects", () => {
        it("should handle successful operation", async () => {
            const mockProject: Project[] = [
                {
                    id: "1",
                    name: "Test Item",
                    status: "active",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            (projectService.getAllProjects as jest.Mock).mockReturnValue(mockProject);

            await projectController.getAllProjects(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Items successfully retireved",
                status: "success",
                data: mockProject,
            });
        });
    });

    describe("createItem", () => {
        it("should handle successful creation", async () => {
            const mockBody = {
                name: "Test Item",
                description: "Test description",
            };

            const mockProject: Project = {
                id: "test_id",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date(),
                ...mockBody,
            };

            mockReq.body = mockBody;
            (projectService.createProject as jest.Mock).mockReturnValue(mockProject);

            await projectController.createProject(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Item created successfully",
                data: mockProject,
                status: "success",
            });
        });
    });
});
