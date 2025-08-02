// src/components/ui/ProductCard.jsx
import React, { useState } from "react";
import WishlistButton from "./shared/WishlistButton";
import RatingStars from "./shared/RatingStars";
import formatPrice from "../../utils/formatPrice";
import AddToCartButton from "./shared/AddToCartButton";
import BadgeList from "./shared/BadgeList";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const showDiscount = product.originalPrice > product.price;

  const renderImage = () => {
    if (imageError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-sm">Image not available</span>
        </div>
      );
    } else {
      return (
        <div className="aspect-square">
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => {
              // Add delay before showing image
              setTimeout(() => {
                setImageLoading(false);
              }, 500); // 500ms delay
            }}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        </div>
      );
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <Link to={`/product/${product.id}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100">
          {/* Product Image */}
          <div>{renderImage()}</div>
          {/* Loading Skeleton */}
          {imageLoading && <Loading variant="skeleton" />}

          {/* Badges */}
          <BadgeList product={product} />

          {/* Wishlist Button */}
          <WishlistButton />

          {/* Quick Add to Cart - Shows on Hover */}
          <AddToCartButton />

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white text-black px-3 py-1 rounded-md font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>

          {/* Title */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center space-x-1">
              <RatingStars rating={product.rating} />
            </div>
            <span className="text-xs text-gray-500">
              ({product.rating.count})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {showDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Colors (if available) */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1 mb-2">
              <span className="text-xs text-gray-500">Colors:</span>
              <div className="flex space-x-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{
                      backgroundColor: color.toLowerCase(),
                    }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sizes (if available) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-xs text-gray-500">
              Sizes: {product.sizes.slice(0, 3).join(", ")}
              {product.sizes.length > 3 && ` +${product.sizes.length - 3} more`}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
