// backend/src/models/Job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    jobType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'],
      default: 'FULL_TIME'
    },
    jobSite: {
      type: String,
      enum: ['ONSITE', 'REMOTE', 'HYBRID'],
      default: 'ONSITE'
    },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true }
    },
    skills: [String], // e.g. ["Advertising", "Marketing"]
    sector: { type: String },
    experienceLevel: {
      type: String,
      enum: ['JUNIOR', 'MID', 'SENIOR'],
      default: 'MID'
    },
    deadline: { type: Date, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN'
    }
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
