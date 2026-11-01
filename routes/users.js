import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
const router = Router();
router.get('/profile/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('name bio department createdAt');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const projects = await Project.find({ owner: user._id }).sort({ createdAt: -1 }).populate('owner', 'name department');
  res.json({ user, projects });
});
router.put('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = String(req.body.name || user.name).trim().slice(0, 70);
  user.bio = String(req.body.bio ?? user.bio).trim().slice(0, 280);
  user.department = String(req.body.department ?? user.department).trim().slice(0, 100);
  await user.save();
  res.json({ user: { id: user._id, name: user.name, email: user.email, bio: user.bio, department: user.department, savedProjects: user.savedProjects } });
});
export default router;
