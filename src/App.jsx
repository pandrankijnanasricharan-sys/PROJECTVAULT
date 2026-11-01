import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Auth from './pages/Auth.jsx';
import ProjectForm from './pages/ProjectForm.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import MyProjects from './pages/MyProjects.jsx';
import Profile from './pages/Profile.jsx';
import { useAuth } from './context/AuthContext.jsx';
function Protected({children}) { const {user,loading}=useAuth(); const location=useLocation(); if(loading)return <div className="route-loading">Loading ProjectVault…</div>; return user?children:<Navigate to="/login" replace state={{from:location.pathname}}/>; }
export default function App(){return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/explore" element={<Explore/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/projects/:id" element={<ProjectDetail/>}/><Route path="/new" element={<Protected><ProjectForm/></Protected>}/><Route path="/projects/:id/edit" element={<Protected><ProjectForm/></Protected>}/><Route path="/my-projects" element={<Protected><MyProjects/></Protected>}/><Route path="/saved" element={<Protected><MyProjects savedOnly/></Protected>}/><Route path="/profile" element={<Protected><Profile/></Protected>}/><Route path="*" element={<div className="not-found"><h1>404</h1><p>This page wandered outside the vault.</p><a href="/explore" className="button">Explore projects</a></div>}/></Routes></Layout>}
