import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            role: role || 'jobseeker'
        });

        console.log('Attempting to save user:', {
            name: user.name,
            email: user.email,
            role: user.role
        });

        const savedUser = await user.save();
        console.log('User saved successfully:', savedUser._id);

        // Create token
        const token = jwt.sign(
            { userId: savedUser._id, role: savedUser.role },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        console.log('Token created for user:', savedUser._id);

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed', 
            error: error.message,
            stack: error.stack
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

router.put('/update-profile', authenticateToken, async (req, res) => {
    try {
        console.log('Update profile request received:', req.body);
        console.log('User from token:', req.user);

        const { name, email, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            console.log('User not found:', req.user.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                console.log('Email already in use:', email);
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // If changing password, verify current password
        if (newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                console.log('Invalid current password for user:', user._id);
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            user.password = newPassword;
        }

        // Update user information
        user.name = name;
        user.email = email;

        const savedUser = await user.save();
        console.log('User updated successfully:', savedUser._id);

        // Return updated user without password
        const updatedUser = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role
        };

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ 
            message: 'Error updating profile',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;