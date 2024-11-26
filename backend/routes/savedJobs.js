import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import SavedJob from '../models/savedJob.js';

const router = express.Router();

// Get user's saved jobs
router.get('/my-saved-jobs', authenticateToken, async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({ user: req.user.userId })
            .populate('job')
            .sort({ savedAt: -1 });
        
        res.json(savedJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Save a job
router.post('/save/:jobId', authenticateToken, async (req, res) => {
    try {
        const savedJob = new SavedJob({
            user: req.user.userId,
            job: req.params.jobId
        });
        
        await savedJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ message: 'Job already saved' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Unsave a job
router.delete('/unsave/:jobId', authenticateToken, async (req, res) => {
    try {
        await SavedJob.findOneAndDelete({
            user: req.user.userId,
            job: req.params.jobId
        });
        
        res.json({ message: 'Job removed from saved jobs' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 