// src/components/ui/HeroCarousel.jsx
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slides } from "../../data/heroSlides";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  // Go to specific slide
  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume autoplay after 10s
  }, []);

  // Previous slide
  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [slides.length]);

  // Next slide
  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[500px] md:h-[575px] overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`relative min-w-full h-full bg-gradient-to-r ${slide.backgroundColor} flex items-center`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.brand}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Text Content */}
                <div className={`${slide.textColor} space-y-6`}>
                  {/* Brand Badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                    <span className="text-sm font-medium">{slide.brand}</span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl md:text-2xl opacity-90">
                    {slide.subtitle}
                  </p>

                  {/* Discount Badge */}
                  <div className="inline-block">
                    <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold">
                      {slide.discount}
                    </span>
                  </div>

                  {/* Special Offer */}
                  <p className="text-lg opacity-80">{slide.offer}</p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${slide.buttonStyle} transform hover:scale-105`}
                    >
                      Shop Now
                    </button>
                    <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300">
                      View Collection
                    </button>
                  </div>
                </div>

                {/* Right side can be used for product showcase or kept empty for clean look */}
                <div className="hidden lg:block">
                  {/* Optional: Add featured product image or keep minimal */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
