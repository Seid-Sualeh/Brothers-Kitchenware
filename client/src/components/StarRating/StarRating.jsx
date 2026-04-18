import React from 'react';

const StarRating = ({ rating, totalRatings, size = 'sm' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }, (_, i) => (
        <svg key={`full-${i}`} className={`${starSize} text-yellow-400 fill-current`} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <svg className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg className={`${starSize} text-yellow-400 fill-current absolute top-0 left-0`} viewBox="0 0 24 24" style={{ clipPath: 'inset(0 50% 0 0)' }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }, (_, i) => (
        <svg key={`empty-${i}`} className={`${starSize} text-gray-300 fill-current`} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      
      {totalRatings && (
        <span className="text-xs text-gray-600 ml-1">
          ({totalRatings})
        </span>
      )}
    </div>
  );
};

export default StarRating;