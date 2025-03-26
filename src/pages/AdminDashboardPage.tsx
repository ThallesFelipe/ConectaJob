import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckSquare, AlertTriangle, Trash2, Eye, Loader } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminDashboardPage: React.FC = () => {
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const { users, projects, deleteUser, deleteProject } = useApp();
  const navigate = useNavigate();
  
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter out admin users
  const filteredUsers = users.filter(user => user.role !== 'admin');
  
  const handleDeleteUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteUserDialog(true);
  };
  
  const handleDeleteProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setShowDeleteProjectDialog(true);
  };
  
  const confirmDeleteUser = async () => {
    if (selectedUserId) {
      try {
        setIsDeleting(true);
        await deleteUser(selectedUserId);
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      } finally {
        setIsDeleting(false);
        setShowDeleteUserDialog(false);
        setSelectedUserId(null);
      }
    }
  };
  
  const confirmDeleteProject = async () => {
    if (selectedProjectId) {
      try {
        setIsDeleting(true);
        await deleteProject(selectedProjectId);
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
      } finally {
        setIsDeleting(false);
        setShowDeleteProjectDialog(false);
        setSelectedProjectId(null);
      }
    }
  };
  
  const viewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  
  const viewFreelancer = (freelancerId: string) => {
    navigate(`/freelancers/${freelancerId}`);
  };
  
  if (!isAuthenticated || !isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 text-center">
            <AlertTriangle size={48} className="mx-auto mb-4 text-conecta-yellow" />
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6">You need administrator privileges to access this page.</p>
            <Button onClick={() => navigate('/')} className="conecta-button">
              Return to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-conecta-earth-dark mb-2">Admin Dashboard</h1>
            <p className="text-conecta-earth">Manage users and projects on ConectaJob</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 animate-fade-in">
            <Tabs defaultValue="users">
              <TabsList className="mb-6">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Users</span>
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <CheckSquare size={16} />
                  <span>Projects</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Users Tab */}
              <TabsContent value="users">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={user.role === 'freelancer' 
                                  ? 'bg-conecta-green/10 text-conecta-green border-0' 
                                  : 'bg-conecta-yellow/10 text-conecta-yellow-dark border-0'
                                }
                              >
                                {user.role === 'freelancer' ? 'Freelancer' : 'Client'}
                              </Badge>
                            </TableCell>
                            <TableCell>{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell className="text-right">
                              {user.role === 'freelancer' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => viewFreelancer(user.id)}
                                  className="mr-2"
                                  aria-label={`View profile of ${user.username}`}
                                >
                                  <Eye size={16} className="mr-1" />
                                  View
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                aria-label={`Delete user ${user.username}`}
                              >
                                <Trash2 size={16} className="mr-1" />
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Projects Tab */}
              <TabsContent value="projects">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium truncate max-w-[200px]">
                              {project.title}
                            </TableCell>
                            <TableCell>{project.clientName}</TableCell>
                            <TableCell>{project.category}</TableCell>
                            <TableCell>R$ {project.budget.toLocaleString('pt-BR')}</TableCell>
                            <TableCell>{format(new Date(project.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => viewProject(project.id)}
                                className="mr-2"
                                aria-label={`View project ${project.title}`}
                              >
                                <Eye size={16} className="mr-1" />
                                View
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProject(project.id)}
                                aria-label={`Delete project ${project.title}`}
                              >
                                <Trash2 size={16} className="mr-1" />
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No projects found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Delete User Confirmation Dialog */}
      <AlertDialog 
        open={showDeleteUserDialog} 
        onOpenChange={setShowDeleteUserDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the user account and cannot be undone. 
              All associated data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground"
              onClick={confirmDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <Loader size={16} className="mr-2 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Project Confirmation Dialog */}
      <AlertDialog 
        open={showDeleteProjectDialog} 
        onOpenChange={setShowDeleteProjectDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the project and all associated proposals.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground"
              onClick={confirmDeleteProject}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <Loader size={16} className="mr-2 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminDashboardPage;
