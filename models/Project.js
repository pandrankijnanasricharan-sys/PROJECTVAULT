import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true, maxlength: 1200 }
}, { timestamps: true });
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  summary: { type: String, required: true, trim: true, maxlength: 300 },
  description: { type: String, required: true, trim: true, maxlength: 10000 },
  category: { type: String, required: true, enum: ['AI & ML', 'Web Development', 'Mobile Apps', 'Data Science', 'Cybersecurity', 'IoT & Hardware', 'Cloud & DevOps', 'Other'] },
  status: { type: String, enum: ['Idea', 'In Progress', 'Completed'], default: 'In Progress' },
  techStack: [{ type: String, trim: true }],
  tags: [{ type: String, trim: true, lowercase: true }],
  coverImage: { type: String, default: '' },
  repoUrl: { type: String, default: '' },
  demoUrl: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  comments: [commentSchema]
}, { timestamps: true });
projectSchema.index({ title: 'text', summary: 'text', description: 'text', tags: 'text', techStack: 'text' });
export default mongoose.model('Project', projectSchema);
