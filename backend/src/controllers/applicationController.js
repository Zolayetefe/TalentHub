import { application } from "express";
import Application from "../models/Application.js";

// POST /applications → Apply to job
export const applyToJob = async (req, res) => {
    
  try {
    const { jobId, resumeUrl,coverLetter } = req.body;
    const userId = req.user._id

    // Prevent duplicate application
    const existing = await Application.findOne({ jobId, userId });
    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = new Application({ jobId, userId, resumeUrl,coverLetter});
    await application.save();

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /applications/:userId → List user’s applications
export const getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ userId }).populate("jobId");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /applications/job/:jobId → Employer view applicants
export const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ jobId })
  .populate({
    path: 'userId',
    select: '_id name email' // Select only the required user fields
  })
  .populate({
    path: 'jobId',
    select: 'title' // Assuming the job name is stored in a 'title' field in the Job model
  })
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// updateApplicationStatus
export const updateApplicationStatus = async (req, res) => {
  console.log("requested")
  try {
    const { ApplicationId} = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
console.log("before db opration ")
    // Update the application status
    const application = await Application.findByIdAndUpdate(
      ApplicationId,
      { status },
      { new: true }

    )
    console.log("after db opration ")
     console.log(application)

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application status updated successfully",
      data: application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /applications → Admin view all
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId")
      .populate("jobId");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
