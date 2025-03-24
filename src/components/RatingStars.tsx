
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  initialRating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  initialRating = 0, 
  onRate, 
  readonly = false,
  size = 'md' 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const starSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  
  const handleClick = (value: number) => {
    if (!readonly) {
      setRating(value);
      if (onRate) {
        onRate(value);
      }
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`cursor-${readonly ? 'default' : 'pointer'} transition-colors duration-200`}
        >
          <Star
            size={starSizes[size]}
            className={`
              ${
                (hoverRating || rating) >= star
                  ? "fill-conecta-yellow text-conecta-yellow"
                  : "text-gray-300"
              }
              ${!readonly && "hover:text-conecta-yellow"}
              transition-colors
            `}
          />
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
