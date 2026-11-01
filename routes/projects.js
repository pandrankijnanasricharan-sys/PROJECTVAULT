import { Router } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const populated = query => query.populate('owner', 'name department').populate('comments.author', 'name');
const cleanArray = value => Array.isArray(value) ? value.map(x => String(x).trim()).filter(Boolean).slice(0, 20) : String(value || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 20);
const normalize = body => ({ ...body, techStack: cleanArray(body.techStack), tags: cleanArray(body.tags) });
router.get('/', async (req, res) => {
  const { q = '', category = '', status = '', sort = 'newest', owner = '' } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (status && status !== 'All') filter.status = status;
  if (owner && mongoose.isValidObjectId(owner)) filter.owner = owner;
  if (q.trim()) filter.$or = [ { title: { $regex: q.trim(), $options: 'i' } }, { summary: { $regex: q.trim(), $options: 'i' } }, { tags: { $regex: q.trim(), $options: 'i' } }, { techStack: { $regex: q.trim(), $options: 'i' } } ];
  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, popular: { views: -1, createdAt: -1 } };
  const projects = await populated(Project.find(filter).sort(sortMap[sort] || sortMap.newest).limit(100));
  res.json({ projects });
});
router.get('/saved', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('savedProjects');
  const projects = await populated(Project.find({ _id: { $in: user.savedProjects } }).sort({ createdAt: -1 }));
  res.json({ projects });
});
router.post('/', protect, async (req, res) => {
  const data = normalize(req.body);
  for (const key of ['title', 'summary', 'description', 'category']) if (!String(data[key] || '').trim()) return res.status(400).json({ message: `${key} is required.` });
  const project = await Project.create({ ...data, owner: req.user._id });
  res.status(201).json({ project: await populated(Project.findById(project._id)) });
});
router.get('/:id', async (req, res) => {
  const project = await populated(Project.findById(req.params.id));
  if (!project) return res.status(404).json({ message: 'Project not found.' });
  await Project.updateOne({ _id: project._id }, { $inc: { views: 1 } });
  res.json({ project });
});
router.put('/:id', protect, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found.' });
  if (String(project.owner) !== String(req.user._id)) return res.status(403).json({ message: 'You can only edit your own projects.' });
  Object.assign(project, normalize(req.body));
  await project.save();
  res.json({ project: await populated(Project.findById(project._id)) });
});
router.delete('/:id', protect, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found.' });
  if (String(project.owner) !== String(req.user._id)) return res.status(403).json({ message: 'You can only delete your own projects.' });
  await project.deleteOne(); await User.updateMany({}, { $pull: { savedProjects: project._id } });
  res.json({ message: 'Project deleted.' });
});
router.post('/:id/save', protect, async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found.' });
  const user = await User.findById(req.user._id);
  const exists = user.savedProjects.some(id => String(id) === String(project._id));
  if (exists) user.savedProjects.pull(project._id); else user.savedProjects.addToSet(project._id);
  await user.save();
  res.json({ saved: !exists, message: exists ? 'Removed from saved projects.' : 'Project saved.' });
});
router.post('/:id/comments', protect, async (req, res) => {
  const text = String(req.body.text || '').trim();
  if (!text || text.length > 1200) return res.status(400).json({ message: 'Comment must be between 1 and 1200 characters.' });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found.' });
  project.comments.push({ author: req.user._id, text }); await project.save();
  res.status(201).json({ project: await populated(Project.findById(project._id)) });
});
export default router;
