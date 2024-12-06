import express from 'express';
import User from '../models/user.js';
import Job from '../models/job.js'; // Ensure this model exists
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// Get all users
router.get('/all-users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Get all jobs
router.get('/all-jobs', authenticateToken, isAdmin, async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Failed to fetch jobs' });
    }
});

// Delete a user
router.delete('/users/:userId', authenticateToken, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

// Delete a job
router.delete('/jobs/:jobId', authenticateToken, isAdmin, async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.jobId);
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Failed to delete job' });
    }
});

export default router;
