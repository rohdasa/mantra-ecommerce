import { Star } from "lucide-react";

const RatingStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating.rate);
  const hasHalfStar = rating.rate % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <Star
        key={`half-${fullStars}`}
        size={12}
        className="fill-yellow-400 text-yellow-400 opacity-50"
      />
    );
  }

  const emptyStars = 5 - Math.ceil(rating.rate);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} size={12} className="text-gray-300" />);
  }

  return stars;
};

export default RatingStars;
