import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const validate = (req, res, next) => { const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg }); next(); };
const tokenFor = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const safeUser = user => ({ id: user._id, name: user.name, email: user.email, bio: user.bio, department: user.department, savedProjects: user.savedProjects || [] });
router.post('/register', [body('name').trim().isLength({ min: 2, max: 70 }).withMessage('Name must be 2–70 characters.'), body('email').isEmail().withMessage('Enter a valid email address.'), body('password').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters.'), validate], async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: tokenFor(user._id), user: safeUser(user) });
});
router.post('/login', [body('email').isEmail().withMessage('Enter a valid email address.'), body('password').notEmpty().withMessage('Password is required.'), validate], async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  res.json({ token: tokenFor(user._id), user: safeUser(user) });
});
router.get('/me', protect, async (req, res) => { const user = await User.findById(req.user._id).populate('savedProjects'); res.json({ user: safeUser(user) }); });
export default router;
