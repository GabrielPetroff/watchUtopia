import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dataService from '../services/data/dataService.js';

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [watchImages, setWatchImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllImages();
  }, []);

  async function loadAllImages() {
    setIsLoading(true);

    const result = await dataService.getCarouselImages();

    if (result.success) {
      setWatchImages(result.data);
    } else {
      console.error('Error loading images:', result.error);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (!isAutoPlaying || watchImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % watchImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, watchImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % watchImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + watchImages.length) % watchImages.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl h-96 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-600 text-lg">Loading watches...</p>
        </div>
      </div>
    );
  }

  if (watchImages.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl h-96 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-600 text-lg">
            No images found in the carousel
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {/* Slides Container */}
        <div className="relative h-96 bg-black">
          {watchImages.map((imageUrl, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              <img
                src={imageUrl}
                alt={`Watch ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
          {currentSlide + 1} / {watchImages.length}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {watchImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-purple-600 w-8 h-3'
                : 'bg-gray-300 w-3 h-3 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
