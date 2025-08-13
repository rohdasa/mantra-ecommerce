// src/components/ui/ProductCard.jsx - Enhanced for your transformed product data
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import formatPrice from "../../utils/formatPrice";
import RatingStars from "./shared/RatingStars";

const ProductCard = ({ product, className = "" }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className={`block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 group ${className}`}
    >
      <div className="relative">
        {/* Image */}
        <div className="aspect-square bg-gray-100 overflow-hidden p-5">
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              console.warn(
                `Failed to load image for product ${product.id}: ${product.image}`
              );
              setImageError(true);
              setImageLoading(false);
            }}
          />

          {/* Loading Skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isNew && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Bestseller
            </span>
          )}
          {product.discount && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
              {Math.floor(product.discount)}% off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors bg-slate-200`}
        >
          <Heart
            className={`h-4 w-4 ${
              isWishlisted ? "text-pink-600 fill-pink-600" : ""
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Category */}
        <p className="text-xs text-gray-500 capitalize mb-2">
          {product.category}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center space-x-1">
            <RatingStars rating={product.rating} />
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <span className="text-xs text-red-500">Out of Stock</span>
          )}
        </div>

        {/* Colors (if available) */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-1 mt-2">
            <span className="text-xs text-gray-500">Colors:</span>
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
