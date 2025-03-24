import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, X, Edit2, User } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProjectCard from '@/components/ProjectCard';
import ImageUpload from '@/components/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { ClientProfile, FreelancerProfile, PortfolioItem } from '@/types/models';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const ProfilePage: React.FC = () => {
  const { currentUser, isAuthenticated, isFreelancer, isClient } = useAuth();
  const { getProjectsByUser, updateFreelancerProfile, updateClientProfile } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [portfolioImage, setPortfolioImage] = useState('');
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  
  // Freelancer profile state
  const [profileImage, setProfileImage] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  // Client profile state for client
  const [clientDescription, setClientDescription] = useState('');
  
  // User projects
  const [userProjects, setUserProjects] = useState([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isFreelancer) {
      const freelancerUser = currentUser as FreelancerProfile;
      setProfileImage(freelancerUser.profileImage || '');
      setDescription(freelancerUser.description || '');
      setSkills([...freelancerUser.skills]);
      setPortfolio([...freelancerUser.portfolio]);
      setWhatsappNumber(freelancerUser.whatsappNumber || '');
    } else if (isClient) {
      const clientUser = currentUser as ClientProfile;
      setProfileImage(clientUser.profileImage || '');
      setClientDescription(clientUser.description || '');
    }
    
    if (currentUser) {
      setUserProjects(getProjectsByUser(currentUser.id));
    }
  }, [currentUser, isAuthenticated, isFreelancer, isClient, navigate, getProjectsByUser]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    if (skills.includes(newSkill.trim())) {
      toast.error('This skill already exists');
      return;
    }
    
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddPortfolioItem = () => {
    if (!portfolioTitle.trim() || !portfolioDescription.trim()) {
      toast.error('Please fill in both title and description');
      return;
    }
    
    const newItem: PortfolioItem = {
      id: uuidv4(),
      title: portfolioTitle,
      description: portfolioDescription,
      imageUrl: portfolioImage || undefined
    };
    
    setPortfolio([...portfolio, newItem]);
    setPortfolioTitle('');
    setPortfolioDescription('');
    setPortfolioImage('');
    setShowAddPortfolio(false);
    toast.success('Portfolio item added');
  };

  const handleRemovePortfolioItem = (id: string) => {
    setPortfolio(portfolio.filter(item => item.id !== id));
  };

  const handleSaveProfile = () => {
    if (isFreelancer && currentUser) {
      const updatedProfile: FreelancerProfile = {
        ...(currentUser as FreelancerProfile),
        profileImage: profileImage || undefined,
        description,
        skills,
        portfolio,
        whatsappNumber: whatsappNumber || undefined
      };
      
      updateFreelancerProfile(updatedProfile);
    } else if (isClient && currentUser) {
      const updatedProfile: ClientProfile = {
        ...(currentUser as ClientProfile),
        profileImage: profileImage || undefined,
        description: clientDescription
      };
      
      updateClientProfile(updatedProfile);
    }
    
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-conecta-green to-conecta-green-dark"></div>
            
            {/* Profile Section */}
            <div className="relative px-6 md:px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-end -mt-20">
                {isEditing ? (
                  <div className="h-32 w-32 mb-4 md:mb-0">
                    <ImageUpload
                      initialImage={profileImage}
                      onImageUpload={setProfileImage}
                      className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md"
                    />
                  </div>
                ) : (
                  <Avatar className="h-32 w-32 border-4 border-white shadow-md mb-4 md:mb-0">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback className="bg-conecta-green text-white text-4xl">
                      {getInitials(currentUser.username)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="md:ml-6 md:flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-conecta-earth-dark">
                        {currentUser.username}
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        {currentUser.email} • {currentUser.role === 'freelancer' ? 'Freelancer' : 'Client'}
                      </p>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      {isEditing ? (
                        <div className="flex space-x-3">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            className="conecta-button" 
                            onClick={handleSaveProfile}
                          >
                            <Save size={16} className="mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="conecta-button" 
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 size={16} className="mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  {isClient && <TabsTrigger value="projects">My Projects</TabsTrigger>}
                  {isFreelancer && <TabsTrigger value="portfolio">Portfolio</TabsTrigger>}
                </TabsList>
                
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">About</h2>
                        {isEditing ? (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Tell clients about yourself, your experience, and your expertise..."
                              className="conecta-input min-h-[150px]"
                              value={isFreelancer ? description : clientDescription}
                              onChange={(e) => isFreelancer ? setDescription(e.target.value) : setClientDescription(e.target.value)}
                            />
                          </div>
                        ) : (
                          <p className="whitespace-pre-line">
                            {isFreelancer
                              ? (description || "You haven't added a description yet.")
                              : (clientDescription || "You haven't added a description yet.")}
                          </p>
                        )}
                      </div>
                      
                      {isFreelancer && (
                        <div className="mb-8">
                          <h2 className="text-xl font-semibold mb-4">Skills</h2>
                          {isEditing ? (
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2 mb-3">
                                {skills.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="bg-conecta-pastel-mint/30 border-0 pr-1">
                                    {skill}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 ml-1 hover:bg-red-100 hover:text-red-500"
                                      onClick={() => handleRemoveSkill(skill)}
                                    >
                                      <X size={12} />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add a skill (e.g., Web Development, Design)"
                                  className="conecta-input"
                                  value={newSkill}
                                  onChange={(e) => setNewSkill(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                />
                                <Button
                                  onClick={handleAddSkill}
                                  className="conecta-button"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {skills && skills.length > 0 ? (
                                skills.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="bg-conecta-pastel-mint/30 border-0">
                                    {skill}
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-muted-foreground">No skills listed yet</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {isFreelancer && isEditing && (
                        <div className="mb-4">
                          <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
                            Número do WhatsApp
                          </label>
                          <Input
                            id="whatsapp"
                            type="tel"
                            placeholder="+55 (99) 99999-9999"
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value)}
                            className="w-full"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Este número será usado para contatos via WhatsApp
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="bg-slate-50 rounded-lg p-5">
                        <h3 className="font-medium mb-4">Account Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <User size={18} className="mr-3 text-conecta-green mt-0.5" />
                            <div>
                              <p className="font-medium">Username</p>
                              <p className="text-muted-foreground">{currentUser.username}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] mr-3 text-conecta-green mt-0.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-muted-foreground">{currentUser.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] mr-3 text-conecta-green mt-0.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <div>
                              <p className="font-medium">Member Since</p>
                              <p className="text-muted-foreground">
                                {new Date(currentUser.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isClient && (
                        <Button
                          className="conecta-button w-full mt-6"
                          onClick={() => navigate('/post-project')}
                        >
                          <Plus size={16} className="mr-2" />
                          Post New Project
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                {/* Projects Tab (Client Only) */}
                {isClient && (
                  <TabsContent value="projects">
                    <h2 className="text-xl font-semibold mb-6">My Projects</h2>
                    
                    {userProjects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userProjects.map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-muted-foreground">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                        </svg>
                        <p className="text-muted-foreground mb-4">You haven't posted any projects yet</p>
                        <Button 
                          className="conecta-button"
                          onClick={() => navigate('/post-project')}
                        >
                          <Plus size={16} className="mr-2" />
                          Post Your First Project
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                )}
                
                {/* Portfolio Tab (Freelancer Only) */}
                {isFreelancer && (
                  <TabsContent value="portfolio">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Portfolio</h2>
                      {isEditing && (
                        <Button 
                          className="conecta-button"
                          onClick={() => setShowAddPortfolio(true)}
                        >
                          <Plus size={16} className="mr-2" />
                          Add Portfolio Item
                        </Button>
                      )}
                    </div>
                    
                    {showAddPortfolio && (
                      <div className="bg-slate-50 p-6 rounded-lg mb-6 animate-fade-in">
                        <h3 className="text-lg font-medium mb-4">Add Portfolio Item</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="portfolio-title">Title</Label>
                            <Input
                              id="portfolio-title"
                              placeholder="E.g., Website Redesign, Logo Design"
                              className="conecta-input"
                              value={portfolioTitle}
                              onChange={(e) => setPortfolioTitle(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="portfolio-description">Description</Label>
                            <Textarea
                              id="portfolio-description"
                              placeholder="Describe this project, your role, and the technologies used..."
                              className="conecta-input min-h-[100px]"
                              value={portfolioDescription}
                              onChange={(e) => setPortfolioDescription(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Image (Optional)</Label>
                            <ImageUpload
                              initialImage={portfolioImage}
                              onImageUpload={setPortfolioImage}
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-3 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowAddPortfolio(false);
                                setPortfolioTitle('');
                                setPortfolioDescription('');
                                setPortfolioImage('');
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="conecta-button"
                              onClick={handleAddPortfolioItem}
                            >
                              Add Item
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {portfolio && portfolio.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {portfolio.map((item) => (
                          <div key={item.id} className="bg-white border border-conecta-pastel-mint/30 rounded-lg overflow-hidden shadow-sm">
                            {item.imageUrl && (
                              <div className="relative">
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-full h-48 object-cover"
                                />
                                {isEditing && (
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 opacity-90 hover:opacity-100"
                                    onClick={() => handleRemovePortfolioItem(item.id)}
                                  >
                                    <X size={16} />
                                  </Button>
                                )}
                              </div>
                            )}
                            <div className="p-4">
                              <h3 className="font-medium mb-2">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                              
                              {isEditing && !item.imageUrl && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="mt-4"
                                  onClick={() => handleRemovePortfolioItem(item.id)}
                                >
                                  <X size={14} className="mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-muted-foreground">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p className="text-muted-foreground">No portfolio items yet</p>
                        {isEditing && (
                          <Button 
                            className="conecta-button mt-4"
                            onClick={() => setShowAddPortfolio(true)}
                          >
                            <Plus size={16} className="mr-2" />
                            Add Portfolio Item
                          </Button>
                        )}
                      </div>
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
