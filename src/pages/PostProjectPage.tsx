import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Create a validation schema
const projectSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  description: z.string().min(20, 'A descrição deve ter pelo menos 20 caracteres'),
  category: z.string().min(1, 'Por favor, selecione uma categoria'),
  budget: z.number().positive('O orçamento deve ser um número positivo'),
  deadline: z.string().refine(val => new Date(val) > new Date(), 'Por favor, selecione uma data futura')
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const PostProjectPage: React.FC = () => {
  const { categories, createProject } = useApp();
  const { currentUser, isAuthenticated, isClient } = useAuth();
  const navigate = useNavigate();
  const [attachment, setAttachment] = useState<string | undefined>(undefined);
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema)
  });
  
  const onSubmit = (data: ProjectFormValues) => {
    if (!isAuthenticated || !isClient) {
      toast.error('Você precisa estar logado como cliente para publicar um projeto');
      navigate('/login');
      return;
    }

    // Create project with validated data
    createProject({
      clientId: currentUser!.id,
      clientName: currentUser!.username,
      ...data,
      status: 'open',
      attachmentUrl: attachment
    });
    
    toast.success('Projeto criado com sucesso!');
    navigate('/projects');
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Projeto</Label>
                <Input
                  id="title"
                  placeholder="Ex: Desenvolvimento de Website para Pequena Empresa"
                  className="conecta-input"
                  {...register('title')}
                  required
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Projeto</Label>
                <Textarea
                  id="description"
                  placeholder="Forneça detalhes sobre seu projeto, requisitos e expectativas..."
                  className="conecta-input min-h-[150px]"
                  {...register('description')}
                  required
                />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                    )}
                  />
                  {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Orçamento (R$)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Digite seu orçamento em reais"
                    className="conecta-input"
                    {...register('budget', { valueAsNumber: true })}
                    min="1"
                    step="0.01"
                    required
                  />
                  {errors.budget && <p className="text-red-500">{errors.budget.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Prazo</Label>
                  <div className="relative">
                    <Input
                      id="deadline"
                      type="date"
                      className="conecta-input pl-10"
                      {...register('deadline')}
                      required
                    />
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-conecta-green" />
                  </div>
                  {errors.deadline && <p className="text-red-500">{errors.deadline.message}</p>}
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
