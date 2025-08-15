import { Play,  Circle } from "lucide-react";
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
  const [currentMovieIndex, setCurrentMovieIndex] = useState(2); // Start with Monsters Inc
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
    <div className="relative w-full h-[810px] rounded-3xl overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('images/heroImages/${currentMovie.image}')`,
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/30"></div>

      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight transition-all duration-500">
                  {currentMovie.title}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
              </div>

              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg transition-all duration-500">
                {currentMovie.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
               
                <button onClick={handleViewDetails}
                  className="group flex items-center gap-3 bg-white/10 
 backdrop-blur-sm text-white px-8 py-4 rounded-full
  font-semibold text-lg cursor-pointer hover:bg-white/20 transition-all
  duration-300 border border-white/20 hover:border-white/40">
                  <Play className="w-6 h-6 fill-current" />
                  Details
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-current text-red-500" />
                  <span>HD</span>
                </div>
                <span>{currentMovie.year}</span>
                <span>Animation</span>
                <span>{currentMovie.duration}</span>
              </div>

              {/* Movie indicators */}
              <div className="flex items-center gap-3">
                {movies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMovieIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
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

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-white/60 text-sm">LIVE</span>
      </div>
    </div>
  );
}
