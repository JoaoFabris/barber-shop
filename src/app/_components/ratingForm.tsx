import { Button } from "@/components/ui/button";
import { Rating, Star } from '@smastrom/react-rating';
import React, { useState } from 'react';
import '@smastrom/react-rating/style.css';

interface RatingFormProps {
  onRatingSubmit: (rating: number) => void;
}

function RatingForm({ onRatingSubmit }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onRatingSubmit(rating);
      // Feedback de sucesso já está sendo tratado no componente pai
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h3 className="text-sm font-medium">Avalie sua experiência</h3>
      <Rating
        itemStyles={{
          itemShapes: Star,
          activeFillColor: '#C49CFF',
          activeStrokeColor: '#61bb00',
          inactiveFillColor: '#e4e5e9',
          inactiveStrokeColor: '#e4e5e9'
        }}
        style={{ maxWidth: 150 }}
        value={rating}
        onChange={setRating}
      />
      <Button 
        onClick={handleSubmit} 
        disabled={rating === 0 || isSubmitting}
        className="w-full mt-2"
      >
        {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </div>
  );
}

export default RatingForm;