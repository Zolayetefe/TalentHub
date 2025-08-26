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

    


    const job = await Job.create({
      title: title.trim(),
      description,
      jobType: jobType || 'FULL_TIME',
      jobSite: jobSite || 'ONSITE',
      location,
      skills: skills || [],
      sector,
      experienceLevel: experienceLevel || 'MID',
      deadline: deadline,
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
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
