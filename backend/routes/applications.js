import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Application from '../models/application.js';
import upload from '../utils/fileUpload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Apply for a job
router.post('/job/:id', authenticateToken, upload.single('cv'), async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.userId;
        
        // Check if user has already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Create new application
        const application = new Application({
            job: jobId,
            applicant: userId,
            coverLetter: req.body.coverLetter,
            cv: {
                filename: req.file.filename,
                path: req.file.path,
                originalName: req.file.originalname
            },
            status: 'pending'
        });

        await application.save();
        res.status(201).json(application);
    } catch (err) {
        console.error('Error in job application:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get applications for a job (employer only)
router.get('/job/:jobId', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email')
            .populate({
                path: 'job',
                populate: {
                    path: 'postedBy'
                }
            })
            .sort('-createdAt');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Download CV
router.get('/cv/:applicationId', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findById(req.params.applicationId)
            .populate({
                path: 'job',
                select: 'postedBy'
            });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check permissions
        if (req.user.role === 'employer' && application.job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (req.user.role === 'jobseeker' && application.applicant.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Get the absolute file path
        const filePath = path.resolve(process.cwd(), application.cv.path);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'CV file not found' });
        }

        // Set the appropriate headers
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${application.cv.originalName}"`
        });

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Error downloading CV:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update application status (employer only)
router.patch('/:applicationId/status', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const application = await Application.findById(req.params.applicationId)
            .populate({
                path: 'job',
                select: 'postedBy'
            });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if this employer owns the job
        if (application.job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update the status
        application.status = req.body.status;
        await application.save();

        // Return the updated application
        const updatedApplication = await Application.findById(application._id)
            .populate('applicant', 'name email')
            .populate('job');

        res.json(updatedApplication);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get user's applications (for job seekers)
router.get('/my-applications', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'jobseeker') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const applications = await Application.find({ applicant: req.user.userId })
            .populate('job')
            .sort('-createdAt');
        
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update application
router.put('/:applicationId', 
    authenticateToken,
    upload.single('cv'),
    async (req, res) => {
        try {
            const application = await Application.findById(req.params.applicationId);
            
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            // Check if this application belongs to the user
            if (application.applicant.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'Not authorized to update this application' });
            }

            // Update fields
            if (req.file) {
                // Delete old CV file if it exists
                if (application.cv && application.cv.path) {
                    const oldFilePath = path.join(process.cwd(), application.cv.path);
                    try {
                        if (fs.existsSync(oldFilePath)) {
                            fs.unlinkSync(oldFilePath);
                        }
                    } catch (err) {
                        console.error('Error deleting old CV:', err);
                    }
                }

                application.cv = {
                    filename: req.file.filename,
                    path: req.file.path,
                    originalName: req.file.originalname
                };
            }

            if (req.body.coverLetter) {
                application.coverLetter = req.body.coverLetter;
            }

            const updatedApplication = await application.save();
            
            // Populate necessary fields before sending response
            await updatedApplication.populate('job');
            
            res.json(updatedApplication);
        } catch (error) {
            console.error('Update application error:', error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Delete application
router.delete('/:applicationId', authenticateToken, async (req, res) => {
    try {
        const application = await Application.findById(req.params.applicationId);
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if this application belongs to the user
        if (application.applicant.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this application' });
        }

        // Delete CV file
        if (application.cv.path) {
            try {
                fs.unlinkSync(application.cv.path);
            } catch (err) {
                console.error('Error deleting CV file:', err);
            }
        }

        await Application.findByIdAndDelete(req.params.applicationId);
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 