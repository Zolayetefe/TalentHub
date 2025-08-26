import { body } from "express-validator";

// Common enums for validation
const validJobTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"];
const validJobSites = ["ONSITE", "REMOTE", "HYBRID"];
const validExperienceLevels = ["JUNIOR", "MID", "SENIOR"];
const validStatuses = ["OPEN", "CLOSED"];

// Validation for creating of job
export const createJobValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Job title is required")
    .isLength({ min: 3 }).withMessage("Job title must be at least 3 characters long"),

  body("description")
    .trim()
    .notEmpty().withMessage("Job description is required"),

  body("jobType")
    .optional()
    .isIn(validJobTypes).withMessage(`Job type must be one of: ${validJobTypes.join(", ")}`),

  body("jobSite")
    .optional()
    .isIn(validJobSites).withMessage(`Job site must be one of: ${validJobSites.join(", ")}`),

  body("location")
    .notEmpty().withMessage("Location is required")
    .custom((value) => {
      if (!value.city || !value.country) {
        throw new Error("Location must include both city and country");
      }
      return true;
    }),

  body("skills")
    .optional()
    .isArray().withMessage("Skills must be an array of strings"),

  body("experienceLevel")
    .optional()
    .isIn(validExperienceLevels).withMessage(`Experience level must be one of: ${validExperienceLevels.join(", ")}`),

  body("sector")
    .optional()
    .trim(),

  body("deadline")
    .notEmpty().withMessage("Deadline is required")
    .isISO8601().withMessage("Deadline must be a valid date")
    .custom((value) => {
      const deadlineDate = new Date(value);
      if (deadlineDate <= new Date()) {
        throw new Error("Deadline must be in the future");
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(validStatuses).withMessage(`Status must be one of: ${validStatuses.join(", ")}`)
];

// Validation for updating status of job
export const updateJobStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(validStatuses).withMessage(`Status must be one of: ${validStatuses.join(", ")}`)
];
