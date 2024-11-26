import mongoose from 'mongoose';

// Define the Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: Number, required: true },
  company: { type: String, required: true }, // Added company field
  location: { type: String, required: true }, // Added location field
  type: { type: String, required: true }, // Added job type field
  requirements: [{ type: String }],
  contactEmail: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Job model
const Job = mongoose.model('Job', jobSchema);

export default Job;
