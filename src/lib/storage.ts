
import {
  User,
  FreelancerProfile,
  ClientProfile,
  AdminProfile,
  Project,
  Category
} from '@/types/models';

const STORAGE_KEYS = {
  USERS: 'conectajob_users',
  PROJECTS: 'conectajob_projects',
  CATEGORIES: 'conectajob_categories',
  CURRENT_USER: 'conectajob_current_user'
};

// User storage
export const saveUsers = (users: (User | FreelancerProfile | ClientProfile | AdminProfile)[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUsers = (): (User | FreelancerProfile | ClientProfile | AdminProfile)[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const findUserByEmail = (email: string): (User | FreelancerProfile | ClientProfile | AdminProfile) | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const findUserById = (id: string): (User | FreelancerProfile | ClientProfile | AdminProfile) | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const addUser = (user: User | FreelancerProfile | ClientProfile | AdminProfile) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUser = (updatedUser: User | FreelancerProfile | ClientProfile | AdminProfile) => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
    return true;
  }
  return false;
};

export const removeUser = (userId: string) => {
  const users = getUsers();
  const newUsers = users.filter(user => user.id !== userId);
  saveUsers(newUsers);
};

// Project storage
export const saveProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const getProjects = (): Project[] => {
  const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return projects ? JSON.parse(projects) : [];
};

export const findProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(project => project.id === id);
};

export const addProject = (project: Project) => {
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
};

export const updateProject = (updatedProject: Project) => {
  const projects = getProjects();
  const index = projects.findIndex(project => project.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    saveProjects(projects);
    return true;
  }
  return false;
};

export const removeProject = (projectId: string) => {
  const projects = getProjects();
  const newProjects = projects.filter(project => project.id !== projectId);
  saveProjects(newProjects);
};

// Category storage
export const saveCategories = (categories: Category[]) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const getCategories = (): Category[] => {
  const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return categories ? JSON.parse(categories) : [];
};

// Current user session
export const saveCurrentUser = (user: User | FreelancerProfile | ClientProfile | AdminProfile | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getCurrentUser = (): (User | FreelancerProfile | ClientProfile | AdminProfile) | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

// Initialize default data
export const initializeStorage = () => {
  if (!getUsers().length) {
    // Create admin account
    const admin: AdminProfile = {
      id: '1',
      username: 'admin',
      email: 'admin@conectajob.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    addUser(admin);
    
    // Create default categories
    const defaultCategories: Category[] = [
      { id: '1', name: 'Programming', icon: 'code' },
      { id: '2', name: 'Design', icon: 'image' },
      { id: '3', name: 'Writing', icon: 'file-text' },
      { id: '4', name: 'Translation', icon: 'globe' },
      { id: '5', name: 'Marketing', icon: 'trending-up' },
      { id: '6', name: 'Video', icon: 'video' },
      { id: '7', name: 'Music', icon: 'music' },
      { id: '8', name: 'Business', icon: 'briefcase' }
    ];
    saveCategories(defaultCategories);
    
    console.log('Default data initialized');
  }
};
