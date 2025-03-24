
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from '@/components/ImageUpload';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { validateProjectTitle, validateProjectDescription, validateProjectBudget, validateProjectDeadline } from '@/lib/validation';
import { toast } from 'sonner';

const PostProjectPage: React.FC = () => {
  const { categories, createProject } = useApp();
  const { currentUser, isAuthenticated, isClient } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [attachment, setAttachment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate minimum date for deadline (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !isClient) {
      toast.error('Você precisa estar logado como cliente para publicar um projeto');
      navigate('/login');
      return;
    }
    
    // Validate input
    if (!validateProjectTitle(title)) {
      toast.error('O título deve ter pelo menos 5 caracteres');
      return;
    }
    
    if (!validateProjectDescription(description)) {
      toast.error('A descrição deve ter pelo menos 20 caracteres');
      return;
    }
    
    if (!category) {
      toast.error('Por favor, selecione uma categoria');
      return;
    }
    
    const budgetValue = parseFloat(budget);
    if (!validateProjectBudget(budgetValue)) {
      toast.error('O orçamento deve ser um número positivo');
      return;
    }
    
    if (!validateProjectDeadline(deadline)) {
      toast.error('Por favor, selecione uma data futura válida');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      createProject({
        clientId: currentUser!.id,
        clientName: currentUser!.username,
        title,
        description,
        category,
        budget: budgetValue,
        deadline,
        status: 'open',
        attachmentUrl: attachment || undefined
      });
      
      navigate('/projects');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Ocorreu um erro ao criar o projeto');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated || !isClient) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Você precisa estar logado como cliente</h1>
            <p className="mb-6">Por favor, faça login ou crie uma conta de cliente para publicar um projeto.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/login')} variant="outline">
                Entrar
              </Button>
              <Button onClick={() => navigate('/register?role=client')} className="conecta-button">
                Cadastrar como Cliente
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-conecta-earth-dark mb-2">Publicar um Novo Projeto</h1>
            <p className="text-conecta-earth">Compartilhe detalhes sobre seu projeto para encontrar o freelancer perfeito</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Projeto</Label>
                <Input
                  id="title"
                  placeholder="Ex: Desenvolvimento de Website para Pequena Empresa"
                  className="conecta-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Projeto</Label>
                <Textarea
                  id="description"
                  placeholder="Forneça detalhes sobre seu projeto, requisitos e expectativas..."
                  className="conecta-input min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    required
                  >
                    <SelectTrigger id="category" className="conecta-input">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Orçamento (R$)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Digite seu orçamento em reais"
                    className="conecta-input"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Prazo</Label>
                  <div className="relative">
                    <Input
                      id="deadline"
                      type="date"
                      className="conecta-input pl-10"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      min={minDate}
                      required
                    />
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-conecta-green" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Imagem do Projeto (Opcional)</Label>
                <ImageUpload
                  initialImage={attachment}
                  onImageUpload={setAttachment}
                />
              </div>
              
              <Button
                type="submit"
                className="conecta-button w-full mt-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Criando Projeto..." : "Publicar Projeto"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostProjectPage;
