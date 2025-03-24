import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import RatingStars from '@/components/RatingStars';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface Rating {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface RatingSystemProps {
  freelancerId: string;
  projectId: string;
  onRatingComplete?: () => void;
}

export const RatingList: React.FC<{ ratings: Rating[] }> = ({ ratings }) => {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg">
        <p className="text-muted-foreground">Nenhuma avaliação ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ratings.map((rating) => (
        <div key={rating.id} className="mb-6 border-b border-conecta-pastel-mint/30 pb-6 last:border-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-conecta-green text-white">
                  {rating.clientName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{rating.clientName}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(rating.createdAt), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
            <RatingStars initialRating={rating.rating} readonly size="sm" />
          </div>
          <p className="whitespace-pre-line">{rating.comment}</p>
        </div>
      ))}
    </div>
  );
};

const RatingSystem: React.FC<RatingSystemProps> = ({ 
  freelancerId, 
  projectId,
  onRatingComplete 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { currentUser, isAuthenticated, isClient } = useAuth();
  const { addRating } = useApp();

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !isClient) {
      toast.error('Você precisa estar logado como cliente para avaliar');
      return;
    }
    
    if (rating === 0) {
      toast.error('Por favor, selecione uma classificação');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Por favor, adicione um comentário');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addRating(freelancerId, projectId, rating, comment);
      setRating(0);
      setComment('');
      
      if (onRatingComplete) {
        onRatingComplete();
      }
      
      toast.success('Avaliação enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast.error('Ocorreu um erro ao enviar a avaliação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !isClient) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-medium mb-4">Avaliar Freelancer</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-start">
          <p className="mb-2 text-sm text-muted-foreground">Classificação</p>
          <RatingStars initialRating={rating} onRate={handleRatingChange} size="lg" />
        </div>
        
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Comentário</p>
          <Textarea
            placeholder="Compartilhe sua experiência com este freelancer..."
            className="conecta-input min-h-[120px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="conecta-button w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
        </Button>
      </form>
    </div>
  );
};

export default RatingSystem;