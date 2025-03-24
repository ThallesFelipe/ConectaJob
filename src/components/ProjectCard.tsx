
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { Project } from '@/types/models';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const deadlineDate = new Date(project.deadline);
  const createdDate = new Date(project.createdAt);
  
  const isDeadlinePassed = deadlineDate < new Date();
  const hasManyProposals = project.proposals.length > 5;

  return (
    <Link to={`/projects/${project.id}`} className="block">
      <div className="conecta-card hover:shadow-lg border border-conecta-pastel-mint/30 group animate-fade-in">
        <div className="flex justify-between mb-2">
          <Badge 
            variant="outline" 
            className="bg-conecta-pastel-mint/30 text-conecta-green-dark border-0"
          >
            {project.category}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(createdDate, { addSuffix: true })}
          </span>
        </div>

        <h3 className="text-xl font-medium mb-2 group-hover:text-conecta-green transition-colors line-clamp-1">
          {project.title}
        </h3>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <DollarSign size={16} className="mr-1 text-conecta-green" />
            <span className="font-medium">R$ {project.budget.toLocaleString('pt-BR')}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar size={16} className="mr-1 text-conecta-green" />
            <span className={isDeadlinePassed ? "text-destructive" : ""}>
              {deadlineDate.toLocaleDateString('pt-BR')}
            </span>
          </div>
          
          <div className="flex items-center ml-auto">
            <Clock size={16} className="mr-1 text-conecta-yellow" />
            <span>
              {project.proposals.length} {project.proposals.length === 1 ? 'proposal' : 'proposals'}
            </span>
          </div>
        </div>
        
        {hasManyProposals && (
          <div className="mt-4 text-xs text-conecta-yellow-dark font-medium">
            Popular project - many freelancers interested!
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProjectCard;
