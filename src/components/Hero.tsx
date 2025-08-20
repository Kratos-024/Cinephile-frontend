import { Play, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const movies = [
  {
    id: "tt0382932",
    title: "Ratatouille",
    slug: "ratatouille",
    image: "ratatouline.jpg",
    description:
      "A rat who can cook makes an unusual alliance with a young kitchen worker at a famous Paris restaurant.",
    year: "2007",
    duration: "1h 51m",
  },
  {
    id: "tt6718170",
    title: "The Super Mario Bros. Movie",
    slug: "mario",
    image: "mario.jpg",
    description:
      "Brooklyn plumbers Mario and Luigi are warped to the magical Mushroom Kingdom on an adventure to save Luigi from Bowser.",
    year: "2023",
    duration: "1h 32m",
  },
  {
    id: "tt0198781",
    title: "Monsters, Inc.",
    slug: "monster",
    image: "monsters.jpg",
    description:
      "Animated film that explores the world of Monstropolis, where monsters generate their city's power by scaring children at night.",
    year: "2001",
    duration: "1h 32m",
  },
];

export default function Hero() {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const currentMovie = movies[currentMovieIndex];

  const handleViewDetails = () => {
    navigate(`/movie/${currentMovie.id}/${currentMovie.slug}`);
  };

  return (
    <div className="relative w-full 
      h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[810px]
      rounded-2xl sm:rounded-3xl overflow-hidden 
      mb-6 sm:mb-8 md:mb-12">
      
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat 
          transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('images/heroImages/${currentMovie.image}')`,
        }}
      />
      
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-slate-900/40" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-2xl">
              
              {/* Title section */}
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <h1 className="font-bold text-white leading-tight transition-all duration-500
                  text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  {currentMovie.title}
                </h1>
                <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r 
                  from-blue-400 to-purple-500 rounded-full" />
              </div>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed transition-all duration-500
                text-sm sm:text-base md:text-lg lg:text-xl 
                max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                {currentMovie.description}
              </p>

              {/* Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={handleViewDetails}
                  className="group flex items-center justify-center gap-2 sm:gap-3 
                    bg-white/10 backdrop-blur-sm text-white 
                    px-6 sm:px-8 py-3 sm:py-4 
                    rounded-full font-semibold 
                    text-base sm:text-lg
                    cursor-pointer hover:bg-white/20 
                    transition-all duration-300 
                    border border-white/20 hover:border-white/40
                    min-h-[44px] w-full sm:w-auto"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  Details
                </button>
              </div>

              {/* Movie info */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 
                text-xs sm:text-sm text-gray-400 flex-wrap">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Circle className="w-2 h-2 fill-current text-red-500" />
                  <span>HD</span>
                </div>
                <span>{currentMovie.year}</span>
                <span className="hidden sm:inline">Animation</span>
                <span>{currentMovie.duration}</span>
              </div>

              {/* Movie indicators */}
              <div className="flex items-center gap-2 sm:gap-3">
                {movies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMovieIndex(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentMovieIndex
                        ? "bg-white"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 
        bg-gradient-to-t from-black/60 to-transparent" />
      
      {/* Live indicator */}
      <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 
        flex items-center gap-1 sm:gap-2">
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse" />
        <span className="text-white/60 text-xs sm:text-sm">LIVE</span>
      </div>
    </div>
  );
}
