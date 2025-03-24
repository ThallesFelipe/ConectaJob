export type UserRole = 'client' | 'freelancer' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Note: In a real app, this would be hashed and not stored in state
  role: UserRole;
  createdAt: string;
  profileImage?: string;
}

export interface FreelancerProfile extends User {
  role: 'freelancer';
  description: string;
  skills: string[];
  portfolio: PortfolioItem[];
  averageRating: number;
  ratings: Rating[];
  whatsappNumber?: string;
}

export interface ClientProfile extends User {
  role: 'client';
  description?: string;
}

export interface AdminProfile extends User {
  role: 'admin';
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Rating {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type ProjectStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  createdAt: string;
  attachmentUrl?: string;
  proposals: Proposal[];
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancerName: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
