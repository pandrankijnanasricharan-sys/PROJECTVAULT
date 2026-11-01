import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Project from './models/Project.js';
if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in .env first.');
await mongoose.connect(process.env.MONGO_URI);
const email = 'demo@projectvault.dev';
const previousDemo = await User.findOne({ email });
if (previousDemo) await Project.deleteMany({ owner: previousDemo._id });
await User.deleteOne({ email });
const demo = await User.create({ name: 'Aarav Sharma', email, password: 'ProjectVault123!', department: 'Computer Science', bio: 'Building useful things with code.' });
const examples = [
 { title: 'Campus Navigation Assistant', summary: 'Find lecture halls, labs and facilities without wandering around campus.', description: 'A campus map experience with searchable buildings, accessible route notes and student-submitted updates. Future work could include indoor navigation and QR-based location confirmation.', category: 'Web Development', status: 'Completed', techStack: ['React', 'Node.js', 'MongoDB', 'Leaflet'], tags: ['campus', 'maps', 'accessibility'], repoUrl: 'https://github.com/', demoUrl: '', owner: demo._id },
 { title: 'Plant Disease Classifier', summary: 'A student-friendly prototype for classifying common leaf diseases.', description: 'A machine-learning prototype that accepts leaf images and returns a predicted class with confidence. The interface should clearly explain that results are educational and not a substitute for expert agricultural advice.', category: 'AI & ML', status: 'In Progress', techStack: ['Python', 'TensorFlow', 'React', 'FastAPI'], tags: ['machine-learning', 'agriculture', 'computer-vision'], repoUrl: 'https://github.com/', owner: demo._id },
 { title: 'Smart Energy Dashboard', summary: 'Visualize sample electricity usage and highlight possible savings.', description: 'A dashboard that displays time-series energy data, compares usage periods and lets users annotate unusual peaks. This demo uses sample data; real deployment needs a trusted meter integration.', category: 'IoT & Hardware', status: 'Idea', techStack: ['React', 'Node.js', 'MongoDB', 'Chart.js'], tags: ['iot', 'sustainability', 'dashboard'], owner: demo._id },
 { title: 'Study Group Matcher', summary: 'Help students find peers with compatible subjects and study goals.', description: 'Students choose subjects, preferred study times and learning goals. A matching service can suggest groups and track sessions while protecting personal information.', category: 'Web Development', status: 'In Progress', techStack: ['React', 'Express', 'MongoDB'], tags: ['education', 'collaboration', 'students'], owner: demo._id }
];
await Project.insertMany(examples);
console.log('Seed complete. Demo login: demo@projectvault.dev / ProjectVault123!');
await mongoose.disconnect();
