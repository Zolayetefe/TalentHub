import Application from "../models/Application.js";
import { uploadToCloudinary } from "../utils/upload.js";

// POST /applications → Apply to job
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    //  Check if user already applied for this job
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        application: existingApplication,
      });
    }

    // Upload resume PDF/DOC to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(req.file.buffer);

    const application = new Application({
      jobId,
      userId,
      resumeUrl: cloudinaryUrl, // store secure_url in DB
      status: "applied",
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// GET /applications/:userId → List user’s applications
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id
 
    const applications = await Application.find({ userId }) .populate({
      path: 'userId',
      select: '_id name email' // Select only the required user fields
    })
    .populate("jobId")
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
  try {
    const { ApplicationId} = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    // Update the application status
    const application = await Application.findByIdAndUpdate(
      ApplicationId,
      { status },
      { new: true }

    )

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
