/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCachedMoviesHandler } from "../services/movie.service";
import { addToWatchList, RemoveFromWatchlist } from "../services/user.service";
import { toast } from "react-toastify";
import { googleLogin } from "../firebase/login";

type Timestamp = {
  _seconds: number;
  _nanoseconds: number;
};

type Rating = {
  Source: string;
  Value: string;
};

export type MovieResponseCached = {
  Actors: string;
  Awards: string;
  BoxOffice: string;
  Country: string;
  DVD: string;
  Director: string;
  Genre: string;
  Language: string;
  Metascore: string;
  Plot: string;
  Poster: string;
  Production: string;
  Rated: string;
  Ratings: Rating[];
  Released: string;
  Response: string;
  Runtime: string;
  Title: string;
  Type: string;
  Website: string;
  Writer: string;
  Year: string;
  added_at: Timestamp;
  id: string;
  imdbID: string;
  imdbRating: string;
  imdbVotes: string;
  movie_id: string;
  user_id: string;
};

const ReccomendedByOurModelTemplate = ({
  movie,
}: {
  movie: MovieResponseCached;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const likeHandler = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return;
    }
    
    if (!isLiked) {
      setIsLiked(true);

      const response = await addToWatchList(token, {
        imdbId: movie.imdbID,
        title: movie.Title,
        poster_path: movie.Poster,
        release_date: movie.Year,
        vote_average: movie.imdbVotes,
      });
      
      if (response.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      setIsLiked(false);
      const response = await RemoveFromWatchlist(token, {
        imdbId: movie.imdbID,
      });
      
      if (response.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
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
      
      <Link to={`/movie/${movie.imdbID}/${movie.Title}`}>
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
          <img
            className="w-full
              h-[240px] sm:h-[300px] md:h-[350px] lg:h-[400px]
              object-cover rounded-xl sm:rounded-2xl 
              transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            src={movie.Poster}
            alt={movie.Title}
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
              {movie.Title}
            </h4>
            <p className="text-gray-300 
              text-xs sm:text-sm line-clamp-1">
              {movie.Genre}
            </p>
          </div>
        </div>
      </Link>

      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 
        bg-black/70 backdrop-blur-sm text-white 
        px-2 sm:px-3 py-1 rounded-full border border-green-400 
        text-xs sm:text-sm font-semibold">
        <span>{movie.imdbRating}</span>
      </div>
      
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
        <button
          onClick={(e) => {
            e.preventDefault(); 
            likeHandler();
          }}
          className="p-1.5 sm:p-2 rounded-full bg-black/50 backdrop-blur-sm 
            hover:bg-black/70 transition-all duration-300"
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

export const ReccomendedByOurModel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [movies, setMovies] = useState<MovieResponseCached[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
    
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleGetRecommended = async () => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      try {
        const loginResult = await googleLogin();
        
        if (loginResult.success) {
          toast.success("Login successful! Redirecting to recommendations...", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          
          setIsLoggedIn(true);
          navigate("/genres");
        } else {
          toast.error(loginResult.message || "Login failed. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An unexpected error occurred during login.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      navigate("/genres");
    }
  };

  useEffect(() => {
    const loadCachedMovies = async () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setMovies([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const result = await getCachedMoviesHandler({
          limit: 12,
          page: 1,
          token,
        });
        
        if (result.success && result.data && result.data.length > 0) {
          setMovies(result.data);
        } else {
          setMovies([]);
          setError("No cached movies found");
        }
      } catch (err) {
        console.error("Error loading cached movies:", err);
        setError("Failed to load movies");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadCachedMovies();
  }, [isLoggedIn]);

  const maxIndex = Math.max(0, movies.length - visibleItems);

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (!isHovering && movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= maxIndex) {
            return 0;
          }
          return prev + 1;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovering, maxIndex, movies.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center 
            h-48 sm:h-56 md:h-64">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full 
                h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white" />
              <div className="text-white 
                text-lg sm:text-xl">
                Loading movies...
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        
        {!isLoggedIn && (
          <div className="mb-8 sm:mb-10 md:mb-12 text-center">
            <button
              onClick={handleGetRecommended}
              className="px-6 sm:px-8 py-3 sm:py-4 
                bg-gradient-to-r from-red-600 to-red-700 
                text-white font-bold 
                text-base sm:text-lg 
                rounded-xl transition-all duration-300 
                transform hover:scale-105 shadow-lg hover:shadow-xl
                min-h-[44px] w-full sm:w-auto"
            >
              Get Recommended
            </button>
            <p className="text-gray-400 
              text-sm sm:text-base mt-2">
              Sign in to get personalized movie recommendations
            </p>
          </div>
        )}

        {isLoggedIn && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center 
              justify-between mb-8 sm:mb-10 md:mb-12 gap-4">
              <div>
                <h3 className="font-bold text-white
                  text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  Recommended By our model
                </h3>
                {error && (
                  <p className="text-yellow-400 
                    text-sm sm:text-base mt-2">
                    {error}
                  </p>
                )}
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

            {movies.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center 
                h-48 sm:h-56 md:h-64">
                <div className="text-gray-400 
                  text-lg sm:text-xl mb-4">
                  No movies available
                </div>
                <button
                  onClick={() => navigate("/genres")}
                  className="px-4 sm:px-6 py-2 sm:py-3 
                    bg-red-600 hover:bg-red-700 text-white font-semibold 
                    text-sm sm:text-base
                    rounded-lg transition-colors
                    min-h-[44px]"
                >
                  Select Your Preferences
                </button>
              </div>
            ) : (
              <>
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
                    {movies.map((movie) => (
                      <div 
                        key={movie.id || movie.imdbID} 
                        className="flex-shrink-0"
                        style={{ width: `${itemWidth - 20}px` }}
                      >
                        <ReccomendedByOurModelTemplate movie={movie} />
                      </div>
                    ))}
                  </div>

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

                {movies.length > visibleItems && (
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
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};



export default ReccomendedByOurModel;
