import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { projectSchema } from "../validations/projectValidation";
import * as projectController from "../controllers/projectController";

const router: Router = express.Router();

// "/api/v1/items" prefixes all below routes
router.get("/", projectController.getAllProjects);

router.post(
    "/",
    validateRequest(projectSchema.create),
    projectController.createProject
);

router.put(
    "/:id",
    validateRequest(projectSchema.update),
    projectController.updateProject
);

router.delete("/:id", projectController.deleteProject);

export default router;
