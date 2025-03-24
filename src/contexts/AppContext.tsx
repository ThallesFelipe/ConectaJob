
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import {
  Project,
  Category,
  Proposal,
  FreelancerProfile,
  ClientProfile,
  User,
  Rating,
  AdminProfile
} from '@/types/models';
import {
  getProjects,
  saveProjects,
  getCategories,
  getUsers,
  updateUser,
  removeUser,
  removeProject
} from '@/lib/storage';
import { useAuth } from './AuthContext';

interface AppContextType {
  projects: Project[];
  categories: Category[];
  users: (User | FreelancerProfile | ClientProfile | AdminProfile)[];
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'proposals'>) => void;
  submitProposal: (projectId: string, message: string) => void;
  deleteProject: (projectId: string) => void;
  addRating: (freelancerId: string, projectId: string, rating: number, comment: string) => void;
  deleteUser: (userId: string) => void;
  getProjectsByUser: (userId: string) => Project[];
  getFreelancers: () => FreelancerProfile[];
  getFreelancerById: (freelancerId: string) => FreelancerProfile | null;
  updateFreelancerProfile: (freelancer: FreelancerProfile) => void;
  updateClientProfile: (client: ClientProfile) => void;
  getProjectById: (projectId: string) => Project | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<(User | FreelancerProfile | ClientProfile | AdminProfile)[]>([]);
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    setProjects(getProjects());
    setCategories(getCategories());
    setUsers(getUsers());
  }, []);

  const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'proposals'>) => {
    if (!isAuthenticated || currentUser?.role !== 'client') {
      toast.error('You must be logged in as a client to create a project');
      return;
    }

    const newProject: Project = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      proposals: [],
      ...projectData
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    toast.success('Project created successfully');
  };

  const submitProposal = (projectId: string, message: string) => {
    if (!isAuthenticated || currentUser?.role !== 'freelancer') {
      toast.error('You must be logged in as a freelancer to submit a proposal');
      return;
    }

    const updatedProjects = [...projects];
    const projectIndex = updatedProjects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      toast.error('Project not found');
      return;
    }

    // Check if freelancer has already submitted a proposal for this project
    const existingProposal = updatedProjects[projectIndex].proposals.find(
      p => p.freelancerId === currentUser.id
    );

    if (existingProposal) {
      toast.error('You have already submitted a proposal for this project');
      return;
    }

    const newProposal: Proposal = {
      id: uuidv4(),
      projectId,
      freelancerId: currentUser.id,
      freelancerName: currentUser.username,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    updatedProjects[projectIndex].proposals.push(newProposal);
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    toast.success('Proposal submitted successfully');
  };

  const deleteProject = (projectId: string) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to delete a project');
      return;
    }

    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      toast.error('Project not found');
      return;
    }

    // Only client who created the project or admin can delete it
    if (currentUser?.role !== 'admin' && currentUser?.id !== project.clientId) {
      toast.error('You do not have permission to delete this project');
      return;
    }

    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    removeProject(projectId);
    toast.success('Project deleted successfully');
  };

  const addRating = (freelancerId: string, projectId: string, rating: number, comment: string) => {
    if (!isAuthenticated || currentUser?.role !== 'client') {
      toast.error('You must be logged in as a client to add a rating');
      return;
    }

    const updatedUsers = [...users];
    const freelancerIndex = updatedUsers.findIndex(
      u => u.id === freelancerId && u.role === 'freelancer'
    );

    if (freelancerIndex === -1) {
      toast.error('Freelancer not found');
      return;
    }

    const freelancer = updatedUsers[freelancerIndex] as FreelancerProfile;
    
    // Check if client has already rated this freelancer for this project
    const existingRating = freelancer.ratings.find(
      r => r.clientId === currentUser.id && r.projectId === projectId
    );

    if (existingRating) {
      toast.error('You have already rated this freelancer for this project');
      return;
    }

    const newRating: Rating = {
      id: uuidv4(),
      clientId: currentUser.id,
      clientName: currentUser.username,
      projectId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    freelancer.ratings.push(newRating);
    
    // Recalculate average rating
    const totalRating = freelancer.ratings.reduce((sum, r) => sum + r.rating, 0);
    freelancer.averageRating = totalRating / freelancer.ratings.length;
    
    updatedUsers[freelancerIndex] = freelancer;
    setUsers(updatedUsers);
    updateUser(freelancer);
    toast.success('Rating added successfully');
  };

  const deleteUser = (userId: string) => {
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      toast.error('You must be logged in as an admin to delete a user');
      return;
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    removeUser(userId);
    
    // Also remove projects created by this user if it's a client
    const userProjects = projects.filter(p => p.clientId === userId);
    if (userProjects.length > 0) {
      const updatedProjects = projects.filter(p => p.clientId !== userId);
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
    }
    
    toast.success('User deleted successfully');
  };

  const getProjectsByUser = (userId: string) => {
    return projects.filter(p => p.clientId === userId);
  };

  const getFreelancers = () => {
    return users.filter(u => u.role === 'freelancer') as FreelancerProfile[];
  };

  const getFreelancerById = (freelancerId: string) => {
    const freelancer = users.find(
      u => u.id === freelancerId && u.role === 'freelancer'
    ) as FreelancerProfile | undefined;
    
    return freelancer || null;
  };

  const updateFreelancerProfile = (freelancer: FreelancerProfile) => {
    if (!isAuthenticated || currentUser?.id !== freelancer.id) {
      toast.error('You do not have permission to update this profile');
      return;
    }

    const updatedUsers = [...users];
    const freelancerIndex = updatedUsers.findIndex(u => u.id === freelancer.id);
    
    if (freelancerIndex === -1) {
      toast.error('Freelancer not found');
      return;
    }
    
    updatedUsers[freelancerIndex] = freelancer;
    setUsers(updatedUsers);
    updateUser(freelancer);
    toast.success('Profile updated successfully');
  };

  const updateClientProfile = (client: ClientProfile) => {
    if (!isAuthenticated || currentUser?.id !== client.id) {
      toast.error('You do not have permission to update this profile');
      return;
    }

    const updatedUsers = [...users];
    const clientIndex = updatedUsers.findIndex(u => u.id === client.id);
    
    if (clientIndex === -1) {
      toast.error('Client not found');
      return;
    }
    
    updatedUsers[clientIndex] = client;
    setUsers(updatedUsers);
    updateUser(client);
    toast.success('Profile updated successfully');
  };

  const getProjectById = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const value = {
    projects,
    categories,
    users,
    createProject,
    submitProposal,
    deleteProject,
    addRating,
    deleteUser,
    getProjectsByUser,
    getFreelancers,
    getFreelancerById,
    updateFreelancerProfile,
    updateClientProfile,
    getProjectById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
