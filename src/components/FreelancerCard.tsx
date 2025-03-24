import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { FreelancerProfile } from '@/types/models';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface FreelancerCardProps {
  freelancer: FreelancerProfile;
}

const FreelancerCard: React.FC<FreelancerCardProps> = ({ freelancer }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Link 
      to={`/freelancers/${freelancer.id}`} 
      className="block" 
      aria-label={`Ver perfil de ${freelancer.username}`}
    >
      <div className="bg-white rounded-xl hover:shadow-md transition-shadow p-4" tabIndex={0}>
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 bg-conecta-yellow/20">
            <AvatarImage src={freelancer.profileImage} />
            <AvatarFallback className="bg-conecta-green text-white text-lg">
              {getInitials(freelancer.username)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-xl font-medium group-hover:text-conecta-green transition-colors">
              {freelancer.username}
            </h3>
            
            <div className="flex items-center mt-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(freelancer.averageRating)
                        ? "fill-conecta-yellow text-conecta-yellow"
                        : i < freelancer.averageRating
                        ? "fill-conecta-yellow/50 text-conecta-yellow"
                        : "text-muted-foreground"
                    }
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                ({freelancer.ratings.length} reviews)
              </span>
            </div>
            
            <p className="text-muted-foreground line-clamp-2 mb-3">
              {freelancer.description || "No description provided."}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {freelancer.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-conecta-pastel-mint/30 border-0">
                  {skill}
                </Badge>
              ))}
              {freelancer.skills.length > 3 && (
                <Badge variant="outline" className="bg-white border-conecta-green/30">
                  +{freelancer.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FreelancerCard;
