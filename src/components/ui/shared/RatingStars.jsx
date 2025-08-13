import { Star } from "lucide-react";

const RatingStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative w-4 h-4">
        <Star size={16} className="text-gray-300" />
        <Star
          size={16}
          className="fill-yellow-400 text-yellow-400 absolute top-0 left-0"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      </div>
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-300" />);
  }

  return stars;
};

export default RatingStars;
