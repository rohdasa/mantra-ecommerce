// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import { productService } from "../services/productService";
import Loading from "../components/ui/Loading";
import ProductCard from "../components/ui/ProductCard";
import formatPrice from "../utils/formatPrice";
import RatingStars from "../components/ui/shared/RatingStars";
import WishlistButton from "../components/ui/shared/WishlistButton";
import AddToCartButton from "../components/ui/shared/AddToCartButton";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Product interaction states
  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  // Mock additional images for gallery
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product?.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Fetch main product
      const productData = await productService.getProduct(id);

      setProduct(productData);

      // Create mock additional images (in real app, these would come from API)
      const mockImages = [
        productData.image,
        productData.image, // Same image for demo - in real app would be different angles
        productData.image,
        productData.image,
      ];
      setProductImages(mockImages);
    } catch (err) {
      setError("Failed to load product details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 5) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading fullScreen variant="dots" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Product not found"}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      {product && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/" className="hover:text-gray-900">
                Home
              </a>
              <ChevronRight size={16} />
              <a
                href={`/category/${product.category.toLowerCase()}`}
                className="hover:text-gray-900 capitalize"
              >
                {product.category}
              </a>
              <ChevronRight size={16} />
              <span className="text-gray-900 font-medium">
                {product?.title?.substring(0, 30)}...
              </span>
            </nav>
          </div>
        </div>
      )}

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              style={{ height: "300px", width: "100%" }}
              className="aspect-square p-5 bg-white rounded-lg overflow-hidden border transition-transform ease-in-out"
            >
              <img
                src={productImages[selectedImageIndex]}
                alt={product.title}
                className="relative w-full h-full object-contain"
              />{" "}
              <span
                style={{
                  position: "absolute",
                  top: "5px",
                  left: "2px",
                  fontSize: "10px",
                  background: "rgba(0, 0, 0, 0.8)",
                  width: "12px",
                  paddingLeft: "3px",
                  color: "slategray",
                }}
              >
                {selectedImageIndex + 1}
              </span>
              {/* <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs rounded">
                Main Image #{selectedImageIndex + 1}
              </span> */}{" "}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    console.log(index);
                  }}
                  className={`aspect-square p-3 bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-lg font-medium text-gray-600">
                {product.brand}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <RatingStars rating={product.rating} />
                <span className="text-sm font-medium ml-2">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm font-medium">
                    {Math.floor(product.discount)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Color:
                  <span className="font-normal text-gray-600 ml-2">
                    {selectedColor}
                  </span>
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-gray-900 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes &&
              product.sizes.length > 0 &&
              product.sizes[0] !== "One Size" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Size:
                    <span className="font-normal text-gray-600 ml-2">
                      {selectedSize}
                    </span>
                  </h3>
                  <div className="grid grid-cols-6 gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-2 border rounded-md text-center transition-colors ${
                          selectedSize === size
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            {product.sizes[0] === "One Size" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Size:
                  <span className="font-normal text-gray-600 ml-2">
                    {selectedSize}
                  </span>
                </h3>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center space-x-6">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-3">
                <span className="text-lg font-medium text-gray-900">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 transition-colors"
                    disabled={quantity <= 1 || !product?.inStock}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 transition-colors"
                    disabled={quantity >= 5 || !product?.inStock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <div className="relative w-full">
                <AddToCartButton
                  product={{
                    ...product,
                    quantity,
                    selectedColor,
                    selectedSize,
                  }}
                  alwaysVisible
                  className="py-3"
                />
              </div>

              <div className="flex items-center justify-center px-1 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors">
                <WishlistButton size={24} product={product} alwaysVisible />
              </div>

              <button className="p-4 border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="text-green-600" size={20} />
                  <div>
                    <p className="font-medium text-sm">Free Delivery</p>
                    <p className="text-xs text-gray-500">
                      On orders above ₹999
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-500">
                      30-day return policy
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="text-purple-600" size={20} />
                  <div>
                    <p className="font-medium text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-500">
                      100% secure checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.variantId || relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
