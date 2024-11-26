import express from 'express';
import Job from '../models/job.js';
import { authenticateToken } from '../middleware/auth.js';
import Application from '../models/application.js';
import User from '../models/user.js';

const router = express.Router();

// Get recent jobs
router.get('/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const jobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(limit);
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get employer's jobs
router.get('/employer/my-jobs', authenticateToken, async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all jobs with filters
router.get('/', async (req, res) => {
    try {
        const { search, type, salaryMin, salaryMax, location } = req.query;
        let query = {};

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Job type filter
        if (type) {
            query.type = type;
        }

        // Salary range filter
        if (salaryMin || salaryMax) {
            query.salary = {};
            if (salaryMin) query.salary.$gte = parseInt(salaryMin);
            if (salaryMax) query.salary.$lte = parseInt(salaryMax);
        }

        // Location filter
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        console.log('MongoDB Query:', query); // Debug log

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 });

        console.log(`Found ${jobs.length} jobs matching criteria`); // Debug log
        res.json(jobs);

    } catch (err) {
        console.error('Error in GET /jobs:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get saved jobs for a user
router.get('/saved-jobs', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('savedJobs');
        res.json(user.savedJobs || []);
    } catch (err) {
        console.error('Error getting saved jobs:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get single job
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Save a job
router.post('/:id/save', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user.savedJobs.includes(req.params.id)) {
            user.savedJobs.push(req.params.id);
            await user.save();
        }
        res.json({ message: 'Job saved successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unsave a job
router.delete('/:id/unsave', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        user.savedJobs = user.savedJobs.filter(jobId => jobId.toString() !== req.params.id);
        await user.save();
        res.json({ message: 'Job unsaved successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create job
router.post('/', authenticateToken, async (req, res) => {
    try {
        const job = new Job({
            ...req.body,
            postedBy: req.user.userId
        });
        const newJob = await job.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update job
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        Object.assign(job, req.body);
        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete job
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router; 