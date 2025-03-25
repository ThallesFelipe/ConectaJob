import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import FreelancerCard from '@/components/FreelancerCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, UserRound } from 'lucide-react';
import { FreelancerProfile } from '@/types/models';

const FreelancersPage: React.FC = () => {
  const { getFreelancers } = useApp();
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFreelancers, setFilteredFreelancers] = useState<FreelancerProfile[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar freelancers com um pequeno atraso para garantir que o contexto esteja pronto
    const timer = setTimeout(() => {
      const allFreelancers = getFreelancers();
      console.log('Freelancers carregados:', allFreelancers);
      setFreelancers(allFreelancers);
      setFilteredFreelancers(allFreelancers);
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [getFreelancers]);

  const applyFilters = () => {
    console.log('Aplicando filtros. Total freelancers:', freelancers.length);
    let filtered = [...freelancers];
    
    // Filter by search query
    if (searchQuery.trim()) {
      console.log('Filtrando por query:', searchQuery);
      filtered = filtered.filter(
        freelancer =>
          freelancer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (freelancer.description && freelancer.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (freelancer.skills && freelancer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    // Filter by rating
    if (selectedRating !== null) {
      console.log('Filtrando por rating:', selectedRating);
      filtered = filtered.filter(
        freelancer => freelancer.averageRating >= selectedRating
      );
    }
    
    // Sort by rating
    filtered.sort((a, b) => b.averageRating - a.averageRating);
    
    console.log('Resultado da filtragem:', filtered.length, 'freelancers');
    setFilteredFreelancers(filtered);
  };

  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [selectedRating, loading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleRatingFilter = (rating: number) => {
    setSelectedRating(selectedRating === rating ? null : rating);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-conecta-earth-dark mb-2">Encontrar Freelancers Talentosos</h1>
          <p className="text-conecta-earth">Descubra profissionais para seus projetos</p>
        </div>
        
        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Buscar por nome, habilidade ou descrição..."
              className="conecta-input pr-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-0 top-0 h-full rounded-r-lg"
            >
              <Search size={18} className="mr-2" />
              Buscar
            </Button>
          </form>
          
          <div className="flex items-center justify-center mt-6 space-x-2">
            <span className="text-sm text-muted-foreground">Filtrar por avaliação:</span>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant="ghost"
                className={`px-3 ${selectedRating === rating ? 'bg-conecta-green/10 text-conecta-green' : ''}`}
                onClick={() => handleRatingFilter(rating)}
              >
                <div className="flex items-center">
                  <Star 
                    size={14} 
                    className={`fill-conecta-yellow text-conecta-yellow`} 
                  />
                  <span className="ml-1">{rating}+</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-conecta-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Carregando freelancers...</p>
          </div>
        ) : filteredFreelancers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filteredFreelancers.map(freelancer => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-conecta-pastel-mint/10 rounded-lg max-w-2xl mx-auto">
            <UserRound size={48} className="mx-auto mb-4 text-conecta-green/40" />
            <h3 className="text-xl font-medium mb-2">Nenhum freelancer encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar sua busca ou critérios de filtro
            </p>
            {freelancers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Ainda não há freelancers cadastrados no sistema.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FreelancersPage;
