import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Clock, MessageCircle, Trash2, User, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import RatingSystem from '@/components/RatingSystem';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getProjectById, 
    submitProposal, 
    deleteProject, 
    completeProject,
    hireFreelancer, 
    removeHiredFreelancer 
  } = useApp();
  const { currentUser, isAuthenticated, isFreelancer, isClient, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  interface Project {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    clientId: string;
    clientName: string;
    createdAt: string;
    deadline: string;
    attachmentUrl?: string;
    proposals: any[];
    status: string;
    hiredFreelancerId?: string;
  }
  
  const [project, setProject] = useState<Project | undefined>(id ? getProjectById(id) : undefined);
  const [proposalMessage, setProposalMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  useEffect(() => {
    if (id) {
      const projectData = getProjectById(id);
      setProject(projectData);
      
      if (!projectData) {
        toast.error('Projeto não encontrado');
        navigate('/projects');
      }
    }
  }, [id, getProjectById]);

  if (!project) {
    return null;
  }

  const createdDate = new Date(project.createdAt);
  const deadlineDate = new Date(project.deadline);
  const isDeadlinePassed = deadlineDate < new Date();
  
  const userProposal = isAuthenticated && isFreelancer
    ? project.proposals.find(p => p.freelancerId === currentUser?.id)
    : null;
  
  const canSubmitProposal = isAuthenticated && isFreelancer && !userProposal && !isDeadlinePassed;
  const isOwner = isAuthenticated && (isClient || isAdmin) && currentUser?.id === project.clientId;
  const canDelete = isAuthenticated && (isOwner || isAdmin);
  
  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!proposalMessage.trim()) {
      toast.error('Por favor, escreva uma mensagem para sua proposta');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      submitProposal(project.id, proposalMessage);
      setProposalMessage('');
      // Update the project data
      setProject(getProjectById(project.id));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    navigate('/projects');
  };

  const handleCompleteProject = () => {
    completeProject(project.id);
    // Use id from URL params instead of project.id
    if (id) {
      setProject(getProjectById(id));
    }
  };

  const handleHireFreelancer = (freelancerId: string, proposalId: string) => {
    hireFreelancer(project.id, freelancerId, proposalId);
    // Use id from URL params instead of project.id
    if (id) {
      setProject(getProjectById(id));
    }
  };

  const handleRemoveFreelancer = () => {
    removeHiredFreelancer(project.id);
    // Use id from URL params instead of project.id
    if (id) {
      setProject(getProjectById(id));
    }
  };

  const handleContactClick = (proposal: any) => {
    if (proposal.freelancerWhatsappNumber) {
      const number = proposal.freelancerWhatsappNumber.replace(/\D/g, ''); // Remove caracteres não numéricos
      const message = `Olá ${proposal.freelancerName}! Estou interessado em discutir o projeto "${project.title}" no ConectaJob.`;
      const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      toast.error('Este freelancer não possui número de WhatsApp cadastrado');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/projects" className="inline-flex items-center text-conecta-green hover:text-conecta-green-dark transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" />
            <span>Voltar aos Projetos</span>
          </Link>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8 animate-fade-in">
            <div className="flex flex-wrap justify-between items-start mb-6">
              <div>
                <Badge 
                  variant="outline" 
                  className="bg-conecta-pastel-mint/30 text-conecta-green-dark border-0 mb-3"
                >
                  {project.category}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-conecta-earth-dark mb-2">
                  {project.title}
                </h1>
                {project.status === 'completed' && (
                  <Badge 
                    variant="outline" 
                    className="bg-green-100 text-green-800 border-0 ml-2"
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Concluído
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground">
                  Publicado por {project.clientName} • {format(createdDate, 'dd/MM/yyyy')}
                </p>
              </div>
              
              {canDelete && (
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="mt-2"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center">
                <DollarSign size={20} className="mr-2 text-conecta-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Orçamento</p>
                  <p className="font-semibold">R$ {project.budget.toLocaleString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar size={20} className="mr-2 text-conecta-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Prazo</p>
                  <p className={`font-semibold ${isDeadlinePassed ? "text-destructive" : ""}`}>
                    {format(deadlineDate, 'dd/MM/yyyy')}
                    {isDeadlinePassed && " (expirado)"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock size={20} className="mr-2 text-conecta-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Propostas</p>
                  <p className="font-semibold">{project.proposals.length} recebidas</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Descrição do Projeto</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{project.description}</p>
              </div>
            </div>
            
            {project.attachmentUrl && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Anexos</h2>
                <div className="border border-conecta-pastel-mint/30 rounded-lg p-4">
                  <img 
                    src={project.attachmentUrl} 
                    alt="Anexo do projeto" 
                    className="max-h-96 object-contain mx-auto rounded-md" 
                  />
                </div>
              </div>
            )}
            
            {isAuthenticated ? (
              <>
                {isClient && isOwner && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Propostas ({project.proposals.length})</h2>
                    
                    {project.proposals.length > 0 ? (
                      <div className="space-y-4">
                        {project.proposals.map(proposal => (
                          <div key={proposal.id} className="border border-conecta-pastel-mint/30 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarFallback className="bg-conecta-green text-white">
                                    {proposal.freelancerName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{proposal.freelancerName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Enviado em {format(new Date(proposal.createdAt), 'dd/MM/yyyy')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleContactClick(proposal)}
                                  variant="outline"
                                >
                                  <MessageCircle size={14} className="mr-1" />
                                  Contatar
                                </Button>
                                
                                {proposal.status !== 'accepted' && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleHireFreelancer(proposal.freelancerId, proposal.id)}
                                    className="conecta-button"
                                  >
                                    <CheckCircle size={14} className="mr-1" />
                                    Contratar
                                  </Button>
                                )}
                                
                                {proposal.status === 'accepted' && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleRemoveFreelancer}
                                  >
                                    <X size={14} className="mr-1" />
                                    Remover
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="whitespace-pre-line">{proposal.message}</p>
                            {proposal.status === 'accepted' && (
                              <div className="mt-2 py-1 px-2 bg-conecta-green/10 text-conecta-green text-sm rounded inline-flex items-center">
                                <CheckCircle size={12} className="mr-1" />
                                Contratado
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-lg">
                        <User size={36} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-muted-foreground">Nenhuma proposta ainda</p>
                      </div>
                    )}
                    {project.status !== 'completed' && (
                      <Button 
                        onClick={handleCompleteProject}
                        className="conecta-button mt-4 w-full"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Marcar Projeto como Concluído
                      </Button>
                    )}
                  </div>
                )}
                
                {isClient && isOwner && project.status === 'completed' && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Avaliar Freelancers</h2>
                    
                    {project.hiredFreelancerId ? (
                      <RatingSystem 
                        freelancerId={project.hiredFreelancerId} 
                        projectId={project.id} 
                      />
                    ) : (
                      <div className="bg-slate-50 p-6 rounded-lg text-center">
                        <p className="text-muted-foreground">
                          Nenhum freelancer contratado para este projeto
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {project.hiredFreelancerId && (
                  <div className="mb-8 p-4 bg-conecta-green/10 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2 flex items-center text-conecta-green">
                      <CheckCircle size={18} className="mr-2" />
                      Freelancer Contratado
                    </h2>
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-conecta-green text-white">
                          {project.proposals.find(p => p.freelancerId === project.hiredFreelancerId)?.freelancerName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {project.proposals.find(p => p.freelancerId === project.hiredFreelancerId)?.freelancerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Trabalhando no projeto
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {isFreelancer && (
                  <div className="mb-8">
                    {userProposal ? (
                      <div className="bg-conecta-green/5 border border-conecta-green/20 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Sua Proposta</h2>
                        <p className="mb-4 whitespace-pre-line">{userProposal.message}</p>
                        <p className="text-sm text-muted-foreground">
                          Enviado em {format(new Date(userProposal.createdAt), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    ) : (
                      <>
                        {canSubmitProposal ? (
                          <>
                            <h2 className="text-xl font-semibold mb-4">Enviar uma Proposta</h2>
                            <form onSubmit={handleProposalSubmit}>
                              <div className="mb-4">
                                <Textarea
                                  placeholder="Descreva por que você é uma boa escolha para este projeto..."
                                  className="conecta-input min-h-[150px]"
                                  value={proposalMessage}
                                  onChange={(e) => setProposalMessage(e.target.value)}
                                  required
                                />
                              </div>
                              <Button
                                type="submit"
                                className="conecta-button"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Enviando..." : "Enviar Proposta"}
                              </Button>
                            </form>
                          </>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-2">Não é possível enviar proposta</h2>
                            <p className="text-conecta-earth">
                              {isDeadlinePassed
                                ? "O prazo para este projeto já passou."
                                : "Você não pode enviar uma proposta para este projeto."}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-conecta-pastel-mint/20 rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Interessado neste projeto?</h2>
                <p className="mb-4">Entre para enviar uma proposta ou contatar o cliente</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => navigate('/login')} variant="outline">
                    Entrar
                  </Button>
                  <Button onClick={() => navigate('/register')} className="conecta-button">
                    Criar Conta
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o projeto e o removerá da plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default ProjectDetailsPage;
