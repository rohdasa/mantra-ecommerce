import { Heart } from "lucide-react";
import { useState } from "react";

const WishlistButton = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Add to wishlist API call
  };
  return (
    <div>
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Heart
          size={16}
          className={`${
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
          } transition-colors hover:fill-red-400 hover:text-red-400`}
        />
      </button>
    </div>
  );
};

export default WishlistButton;
