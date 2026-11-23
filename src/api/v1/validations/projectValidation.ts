import Joi from "joi";
import { RequestSchema } from "../middleware/validate";

/**
 * Status schema organised by request type
 */
export const projectSchema: Record<string, RequestSchema> = {
    // POST /api/v1/projects - Create new Project
    create: {
        body: Joi.object({
            name: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            }),
            status: Joi.string().required().messages({
                "any.required": "Description is required",
                "string.empty": "Description cannot be empty",
            }),
        }),
    },

    // PUT /api/v1/projects/:id - Update project
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Item ID is required",
                "string.empty": "Item ID cannot be empty",
            }),
        }),
        body: Joi.object({
            name: Joi.string().optional().messages({
                "string.empty": "Name cannot be empty",
            }),
            status: Joi.string().optional().messages({
                "string.empty": "Description cannot be empty",
            }),
        }),
    },
};
