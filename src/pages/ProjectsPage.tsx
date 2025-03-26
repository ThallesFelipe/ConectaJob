import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import FilterBar from '@/components/FilterBar';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types/models';

const ProjectsPage: React.FC = () => {
  const location = useLocation();
  const { projects, categories } = useApp();
  
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(10000);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Handle URL parameters only on initial load or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    setInitialLoadComplete(true);
  }, [location.search]);

  // Apply filters whenever filter conditions change
  useEffect(() => {
    if (initialLoadComplete || projects.length > 0) {
      applyFilters();
    }
  }, [searchQuery, selectedCategory, minBudget, maxBudget, projects, initialLoadComplete]);

  const applyFilters = () => {
    let filtered = [...projects];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        project =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category (only if not "all")
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    // Filter by budget
    filtered = filtered.filter(
      project => project.budget >= minBudget && project.budget <= maxBudget
    );
    
    // Sort by newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredProjects(filtered);
  };

  const handleSearch = () => {
    applyFilters();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-conecta-earth-dark mb-2">Explorar Projetos</h1>
          <p className="text-conecta-earth">Encontre o projeto perfeito para suas habilidades</p>
        </div>
        
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          minBudget={minBudget}
          maxBudget={maxBudget}
          setMinBudget={setMinBudget}
          setMaxBudget={setMaxBudget}
          onSearch={handleSearch}
          categories={categories}
        />
        
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou buscar por termos diferentes
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectsPage;
