import * as itemService from "../src/api/v1/services/projectService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Project } from "../src/api/v1/models/projectModel";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Mock the repository module
// jest.mock replaces the entire module with an auto-mocked version
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Project Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create an project successfully", async () => {
        // Arrange
        const mockProjectData: {
            name: string;
            status: string;
            description: string;
        } = {
            name: "Test Project",
            status: "Test Status",
            description: "Test Description",
        };
        const mockDocumentId: string = "test-project-id";

        (
            firestoreRepository.createDocument as jest.MockedFunction<
                typeof firestoreRepository.createDocument
            >
        ).mockResolvedValue(mockDocumentId);

        // Act
        const result: Project = await itemService.createProject(mockProjectData);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "projects",
            expect.objectContaining({
                name: mockProjectData.name,
                description: mockProjectData.description,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            })
        );
        expect(result.id).toBe(mockDocumentId);
        expect(result.name).toBe(mockProjectData.name);
    });

    it("should delete an project successfully", async () => {
        // Arrange
        const mockDocumentId: string = "test-project-id";
        const mockProject: Project = {
            id: mockDocumentId,
            name: "Test Project",
            status: "Test Status",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // jest.spyOn creates a mock for a specific method/function on an object, in our example the itemService
        jest.spyOn(itemService, "getProjectById").mockResolvedValue(mockProject);

        // jest.Mock replaces the auto-mocked version with our specific mocked implementation
        (
            firestoreRepository.deleteDocument as jest.MockedFunction<
                typeof firestoreRepository.deleteDocument
            >
        ).mockResolvedValue(undefined);

        // Act
        await itemService.deleteProject(mockDocumentId);

        // Assert
        expect(itemService.getProjectById).toHaveBeenCalledWith(mockDocumentId);
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(
            "projects",
            mockDocumentId
        );
    });
});
