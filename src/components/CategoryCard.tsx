
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/types/models';
import * as Icons from 'lucide-react';

const dynamicIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  if (IconComponent) {
    return <IconComponent size={24} />;
  }
  return <Icons.Bookmark size={24} />;
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/projects?category=${encodeURIComponent(category.name)}`}
      className="service-card flex flex-col items-center justify-center p-6 hover:-translate-y-1"
    >
      <div className="mb-4 text-conecta-green">
        {dynamicIcon(category.icon)}
      </div>
      <h3 className="text-lg font-medium text-center">{category.name}</h3>
    </Link>
  );
};

export default CategoryCard;
