import { useCallback, useEffect, useState } from "react";
import { slides } from "../../data/heroSlides";
import { ChevronLeft, ChevronRight } from "lucide-react";

function TestCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  //   }, 3000); // change every 5 seconds

  //   return () => clearInterval(interval); // cleanup on unmount
  // }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToSlide = useCallback((id) => {
    setCurrentSlide(id);
  }, []);

  return (
    <div className="relative w-full  overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 bg-slate-500 bg-opacity-20 text-white"
      >
        <ChevronLeft size={30} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2  bg-slate-500 bg-opacity-20 text-white"
      >
        <ChevronRight size={30} />
      </button>
      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === i
                ? "bg-white bg-opacity-80"
                : "bg-white bg-opacity-30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default TestCarousel;
