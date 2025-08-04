import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

const TrendingSectionTemplate = ({ movie }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="relative rounded-2xl group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          className="w-[280px] h-[400px] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
          src={movie.image}
          alt={movie.title}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

        {/* Movie title on hover */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h4 className="text-white font-semibold text-lg mb-1">
            {movie.title}
          </h4>
          <p className="text-gray-300 text-sm">{movie.genre}</p>
        </div>
      </div>

      {/* Rating badge */}
      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-green-400 text-sm font-semibold">
        <span>{movie.rating}</span>
      </div>

      {/* Heart icon */}
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-300"
        >
          <Heart
            className={`w-6 h-6 transition-all duration-300 ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-white hover:text-red-400"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export const TrendingSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef(null);
  const itemWidth = 300; // 280px + 20px gap
  const visibleItems = 4; // Number of items visible at once

  // Sample movie data - replace with your actual data
  const movies = [
    {
      id: 1,
      title: "Aladdin",
      genre: "Adventure",
      rating: "7.8",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 2,
      title: "The Lion King",
      genre: "Animation",
      rating: "8.5",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 3,
      title: "Frozen",
      genre: "Musical",
      rating: "7.4",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 4,
      title: "Moana",
      genre: "Adventure",
      rating: "7.6",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 5,
      title: "Toy Story",
      genre: "Animation",
      rating: "8.3",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 6,
      title: "Finding Nemo",
      genre: "Adventure",
      rating: "8.2",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 7,
      title: "Incredibles",
      genre: "Action",
      rating: "8.0",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 8,
      title: "Coco",
      genre: "Musical",
      rating: "8.4",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 9,
      title: "Up",
      genre: "Adventure",
      rating: "8.3",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 10,
      title: "WALL-E",
      genre: "Sci-Fi",
      rating: "8.4",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 11,
      title: "Ratatouille",
      genre: "Comedy",
      rating: "8.1",
      image: "images/heroImages/aladin.jpg",
    },
    {
      id: 12,
      title: "Inside Out",
      genre: "Comedy",
      rating: "8.2",
      image: "images/heroImages/aladin.jpg",
    },
  ];

  const maxIndex = Math.max(0, movies.length - visibleItems);

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Auto-scroll functionality (pauses on hover)
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= maxIndex) {
            return 0; // Reset to beginning
          }
          return prev + 1;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isHovering, maxIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-4xl lg:text-5xl font-bold text-white">
            Trending Movies
          </h3>

          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Slider container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out gap-5"
            style={{
              transform: `translateX(-${currentIndex * itemWidth}px)`,
            }}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-shrink-0">
                <TrendingSectionTemplate movie={movie} />
              </div>
            ))}
          </div>

          {/* Mobile navigation arrows */}
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
