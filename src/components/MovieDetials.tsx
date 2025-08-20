/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

import { MovieLoader } from "./Loader";
import { Link, useNavigate } from "react-router-dom";
import { addToWatchList, RemoveFromWatchlist } from "../services/user.service";
import { toast } from "react-toastify";
import {
  getTrendingMovies,
  type IMDBTrendingResponse,
} from "../services/movie.service";

export const TrendingSectionTemplate = ({
  movie,
}: {
  movie: {
    releaseData: string;
    watchlistId: string;
    title: string;
    poster_path: string;
    vote_average: string;
  };
}) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const likeHandler = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Please log in to save to watchlist", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    
    if (!isLiked) {
      setIsLiked(true);

      try {
        const response = await addToWatchList(token, {
          imdbId: movie.watchlistId,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.releaseData,
          vote_average: movie.vote_average,
        });
        
        if (response.success) {
          toast.success(response.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          setIsLiked(false);
          toast.error("Failed to add to watchlist. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error: any) {
        setIsLiked(false);
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      setIsLiked(false);
      
      try {
        const response = await RemoveFromWatchlist(token, {
          imdbId: movie.watchlistId,
        });
        
        if (response.success) {
          toast.success(response.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          setIsLiked(true);
          toast.error("Failed to remove from watchlist. Please try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        setIsLiked(true);
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  return (
    <div className="relative rounded-xl sm:rounded-2xl group cursor-pointer 
      transform transition-all duration-300 hover:scale-105
      w-full max-w-[180px] sm:max-w-[220px] md:max-w-[250px] lg:max-w-[280px]">
      
      <Link to={`movie/${movie.watchlistId}/${movie.title}`}>
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
          <img
            className="w-full 
              h-[240px] sm:h-[300px] md:h-[350px] lg:h-[400px]
              object-cover rounded-xl sm:rounded-2xl 
              transition-transform duration-300 group-hover:scale-110"
            src={
              movie.poster_path?.includes("http")
                ? movie.poster_path.replace(/_V1_.*\.jpg/, "_V1_UX675_.jpg")
                : `https://image.tmdb.org/t/p/w500/${movie.poster_path || "Image_loading"}`
            }
            alt={movie.title}
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 
            rounded-xl sm:rounded-2xl" />
          
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 
            left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 
            transform translate-y-4 group-hover:translate-y-0 
            opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h4 className="text-white font-semibold 
              text-sm sm:text-base md:text-lg mb-1 line-clamp-2">
              {movie.title}
            </h4>
          </div>
        </div>
        
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 
          bg-black/70 backdrop-blur-sm text-white 
          px-2 sm:px-3 py-1 rounded-full border border-green-400 
          text-xs sm:text-sm font-semibold">
          <span>{movie.vote_average}</span>
        </div>
      </Link>
      
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
        <button
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation(); 
            likeHandler();
          }}
          className="p-1.5 sm:p-2 rounded-full bg-black/50 backdrop-blur-sm 
            hover:bg-black/70 transition-all duration-300 shadow-lg group/heart"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all duration-300 ${
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
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [, setMovie] = useState<IMDBTrendingResponse[]>([]);
  const [movie2025, setMovie2025] = useState<IMDBTrendingResponse[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef(null);
  
  // Responsive item width and visible items
  const [itemWidth, setItemWidth] = useState(300);
  const [visibleItems, setVisibleItems] = useState(4);

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemWidth(200);
        setVisibleItems(1);
      } else if (width < 768) {
        setItemWidth(240);
        setVisibleItems(2);
      } else if (width < 1024) {
        setItemWidth(270);
        setVisibleItems(3);
      } else {
        setItemWidth(300);
        setVisibleItems(4);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const maxIndex = Math.max(0, movie2025.length - visibleItems);
  const navigate = useNavigate();
  
  const handleViewMore = () => {
    navigate('/movies/trending');
  };

  useEffect(() => {
    const getTrendingMovieArray = async () => {
      try {
        setLoading(true);
        const response = await getTrendingMovies();

        if (response.success && Array.isArray(response.data)) {
          setMovie(response.data);

          const filteredMovies = response.data.filter(
            (movie) =>
              +movie.year === 2025 &&
              +movie.imdbRating > 6 &&
              +movie.metascore > 50
          );

          const uniqueMovies = filteredMovies.reduce((acc, movie) => {
            if (
              !acc.find(
                (m: IMDBTrendingResponse) => m.watchlistId === movie.watchlistId
              )
            ) {
              acc.push(movie);
            }
            return acc;
          }, []);

          setMovie2025(uniqueMovies);
        }
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getTrendingMovieArray();
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isHovering && movie2025.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex > maxIndex ? 0 : nextIndex;
        });
      }, 4000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovering, movie2025.length, maxIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  if (loading || movie2025.length === 0) {
    return (
      <section className="py-8 sm:py-10 md:py-11">
        <div className="container mx-auto px-2 sm:px-4 md:px-6">
          <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
            <h3 className="font-bold text-white
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Trending Movies
            </h3>
          </div>
          <div className="justify-center flex">
            <MovieLoader />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-10 md:py-11">
      <div className="container mx-auto px-2 sm:px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-white
              text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Trending Movies
            </h3>
            
            {/* View More Button - Only visible on mobile and tablet (hidden after md) */}
            <button
              onClick={handleViewMore}
              className="md:hidden text-white/80 hover:text-white 
                transition-colors duration-300 font-medium
                text-sm sm:text-base"
            >
              View More +
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="p-2 lg:p-3 rounded-full bg-white/10 backdrop-blur-sm 
                border border-white/20 text-white hover:bg-white/20 
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 lg:p-3 rounded-full bg-white/10 backdrop-blur-sm 
                border border-white/20 text-white hover:bg-white/20 
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>
        
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out 
              gap-3 sm:gap-4 md:gap-5"
            style={{
              transform: `translateX(-${currentIndex * itemWidth}px)`,
            }}
          >
            {movie2025.map((movie, index) => (
              <div
                key={movie.watchlistId || `movie-${index}`}
                className="flex-shrink-0"
                style={{ width: `${itemWidth - 20}px` }}
              >
                <TrendingSectionTemplate
                  movie={{
                    releaseData: movie.year,
                    watchlistId: movie.watchlistId,
                    title: movie.title,
                    poster_path: movie.posterUrl,
                    vote_average: movie.metascore,
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Mobile navigation buttons */}
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 
              p-2 rounded-full bg-black/70 backdrop-blur-sm text-white 
              hover:bg-black/90 transition-all duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 
              p-2 rounded-full bg-black/70 backdrop-blur-sm text-white 
              hover:bg-black/90 transition-all duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {/* Pagination dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-6 sm:w-8"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
