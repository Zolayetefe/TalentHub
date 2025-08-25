import Job from '../models/Job.js';

// create a new job (Employer only)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      jobType,
      jobSite,
      location,
      skills,
      sector,
      experienceLevel,
      deadline,
      status
    } = req.body;

    // Validate required fields
    if (!title || !description || !location || !deadline) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, description, location, and deadline are required' 
      });
    }

    // Validate location structure
    if (!location.city || !location.country) {
      return res.status(400).json({ 
        message: 'Location must include both city and country' 
      });
    }

    // Validate deadline is in the future
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return res.status(400).json({ 
        message: 'Deadline must be in the future' 
      });
    }

    // Validate enum values
    const validJobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];
    const validJobSites = ['ONSITE', 'REMOTE', 'HYBRID'];
    const validExperienceLevels = ['JUNIOR', 'MID', 'SENIOR'];
    const validStatuses = ['OPEN', 'CLOSED'];

    if (jobType && !validJobTypes.includes(jobType)) {
      return res.status(400).json({ 
        message: `Invalid jobType. Must be one of: ${validJobTypes.join(', ')}` 
      });
    }

    if (jobSite && !validJobSites.includes(jobSite)) {
      return res.status(400).json({ 
        message: `Invalid jobSite. Must be one of: ${validJobSites.join(', ')}` 
      });
    }

    if (experienceLevel && !validExperienceLevels.includes(experienceLevel)) {
      return res.status(400).json({ 
        message: `Invalid experienceLevel. Must be one of: ${validExperienceLevels.join(', ')}` 
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Validate skills array
    if (skills && !Array.isArray(skills)) {
      return res.status(400).json({ 
        message: 'Skills must be an array' 
      });
    }

    const job = await Job.create({
      title: title.trim(),
      description,
      jobType: jobType || 'FULL_TIME',
      jobSite: jobSite || 'ONSITE',
      location,
      skills: skills || [],
      sector,
      experienceLevel: experienceLevel || 'MID',
      deadline: deadlineDate,
      status: status || 'OPEN',
      createdBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get jobs by employer ID
export const getJobsByEmployer = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.params.employerId });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update job status
export const updateJobStatus = async (req, res) => {
  try {
    const { jobId} = req.params;
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
  
    // Update the job status
    const job = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true }
      
    )


    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }

    res.status(200).json({
      message: "job status updated successfully",
      data: job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete job (Employer/Admin only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
