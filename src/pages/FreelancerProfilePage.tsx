import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, MessageCircle, Briefcase, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import RatingStars from '@/components/RatingStars';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { FreelancerProfile, Rating } from '@/types/models';
import { RatingList } from '@/components/RatingSystem';

const FreelancerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getFreelancerById } = useApp();
  const { isAuthenticated } = useAuth();
  
  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null);
  
  useEffect(() => {
    if (id) {
      const freelancerData = getFreelancerById(id);
      setFreelancer(freelancerData);
    }
  }, [id, getFreelancerById]);

  const handleContactClick = () => {
    if (freelancer?.whatsappNumber) {
      // Remove caracteres não numéricos
      const number = freelancer.whatsappNumber.replace(/\D/g, '');
      const message = `Olá ${freelancer.username}! Encontrei seu perfil no ConectaJob e gostaria de discutir um projeto potencial.`;
      const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!freelancer) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold">Freelancer não encontrado</h2>
          <p className="mt-4">
            O perfil de freelancer que você está procurando não existe ou foi removido.
          </p>
          <Link to="/freelancers" className="conecta-button inline-block mt-6">
            Navegar pelos Freelancers
          </Link>
        </div>
      </Layout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const RatingItem = ({ rating }: { rating: Rating }) => (
    <div className="mb-6 border-b border-conecta-pastel-mint/30 pb-6 last:border-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium">{rating.clientName}</p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(rating.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <RatingStars initialRating={rating.rating} readonly size="sm" />
      </div>
      <p className="whitespace-pre-line">{rating.comment}</p>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Link to="/freelancers" className="inline-flex items-center text-conecta-green hover:text-conecta-green-dark transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" />
            <span>Voltar para Freelancers</span>
          </Link>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in">
            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-conecta-green to-conecta-green-dark"></div>
            
            {/* Profile Section */}
            <div className="relative px-6 md:px-8 pb-8 -mt-20">
              <div className="flex flex-col md:flex-row md:items-end">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md mb-4 md:mb-0">
                  <AvatarImage src={freelancer.profileImage} />
                  <AvatarFallback className="bg-conecta-green text-white text-4xl">
                    {getInitials(freelancer.username)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="md:ml-6 md:flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-conecta-earth-dark">
                        {freelancer.username}
                      </h1>
                      <div className="flex items-center mt-2 mb-4">
                        <RatingStars initialRating={freelancer.averageRating} readonly />
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({freelancer.ratings.length} avaliações)
                        </span>
                      </div>
                    </div>
                    
                    {isAuthenticated && (
                      <Button onClick={handleContactClick} className="conecta-button mt-4 md:mt-0">
                        <MessageCircle size={16} className="mr-2" />
                        Contatar Freelancer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Sobre</h2>
                    <p className="whitespace-pre-line">
                      {freelancer.description || "Este freelancer ainda não adicionou uma descrição."}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Habilidades</h2>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills && freelancer.skills.length > 0 ? (
                        freelancer.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-conecta-pastel-mint/30 border-0">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">Nenhuma habilidade listada ainda</p>
                      )}
                    </div>
                  </div>
                  
                  <Tabs defaultValue="portfolio" className="mb-8">
                    <TabsList className="mb-4">
                      <TabsTrigger value="portfolio" className="flex items-center gap-2">
                        <Briefcase size={14} />
                        <span>Portfólio</span>
                      </TabsTrigger>
                      <TabsTrigger value="reviews" className="flex items-center gap-2">
                        <Award size={14} />
                        <span>Avaliações ({freelancer.ratings.length})</span>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="portfolio">
                      {freelancer.portfolio && freelancer.portfolio.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {freelancer.portfolio.map((item, index) => (
                            <div key={index} className="border border-conecta-pastel-mint/30 rounded-lg overflow-hidden">
                              {item.imageUrl && (
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.title} 
                                  className="w-full h-48 object-cover" 
                                />
                              )}
                              <div className="p-4">
                                <h3 className="font-medium mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-lg">
                          <Briefcase size={32} className="mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">Nenhum item no portfólio ainda</p>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="reviews">
                      <div className="mb-4">
                        <div className="flex items-center mb-6">
                          <h3 className="text-lg font-semibold">Avaliações</h3>
                          <div className="flex items-center ml-4">
                            <RatingStars initialRating={freelancer.averageRating} readonly size="sm" />
                            <span className="ml-2 text-conecta-earth font-medium">
                              {freelancer.averageRating ? freelancer.averageRating.toFixed(1) : 'N/A'}
                            </span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({freelancer.ratings.length} avaliações)
                            </span>
                          </div>
                        </div>
                        
                        <RatingList ratings={freelancer.ratings} />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div>
                  <div className="bg-slate-50 rounded-lg p-5 mb-6">
                    <h3 className="font-medium mb-4">Informações de Contato</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Mail size={18} className="mr-3 text-conecta-green mt-0.5" />
                        <span>{freelancer.email}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin size={18} className="mr-3 text-conecta-green mt-0.5" />
                        <span>Remoto</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <p className="text-sm text-muted-foreground">
                      Membro desde {format(new Date(freelancer.createdAt), 'MMMM yyyy')}
                    </p>
                  </div>
                  
                  {isAuthenticated ? (
                    <Button onClick={handleContactClick} className="conecta-button-secondary w-full mb-6">
                      <MessageCircle size={16} className="mr-2" />
                      Contato via WhatsApp
                    </Button>
                  ) : (
                    <div className="bg-conecta-pastel-mint/20 rounded-lg p-5 text-center">
                      <p className="mb-4">Faça login para contatar este freelancer</p>
                      <Link to="/login">
                        <Button variant="outline" className="w-full">
                          Entrar
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FreelancerProfilePage;
