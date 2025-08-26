import { body } from "express-validator";

const validStatuses = ["applied", "shortlisted", "rejected"];

// Validation for applying to a job
export const applyToJobValidation = [
  body("jobId")
    .notEmpty().withMessage("Job ID is required")
    .isMongoId().withMessage("Job ID must be a valid Mongo ObjectId"),

  body("coverLetter")
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage("Cover letter must be at least 10 characters long"),
];

//  Validation for updating application status
export const updateApplicationStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(validStatuses).withMessage(`Status must be one of: ${validStatuses.join(", ")}`)
];
