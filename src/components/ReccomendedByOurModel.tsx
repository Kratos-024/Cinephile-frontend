/* eslint-disable @typescript-eslint/no-explicit-any */
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
    <div className="relative rounded-2xl group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <Link to={`/movie/${movie.imdbID}/${movie.Title}`}>
        <div className="relative overflow-hidden rounded-2xl">
          <img
            className="w-[280px] h-[400px] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            src={movie.Poster}
            alt={movie.Title}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

          <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h4 className="text-white font-semibold text-lg mb-1 line-clamp-2">
              {movie.Title}
            </h4>
            <p className="text-gray-300 text-sm line-clamp-1">{movie.Genre}</p>
          </div>
        </div>
      </Link>

      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-green-400 text-sm font-semibold">
        <span>{movie.imdbRating}</span>
      </div>
      
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.preventDefault(); 
            likeHandler();
          }}
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

export const ReccomendedByOurModel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [movies, setMovies] = useState<MovieResponseCached[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const itemWidth = 300;
  const visibleItems = 4;

  // Check auth status
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
    
    // Listen for storage changes (when user logs out in another tab)
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
      
      // Only fetch movies if user is logged in
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
        
        if (result.success && result.data) {
          setMovies(result.data);
        } else {
          //@ts-ignore
          setError(result.message || "Failed to load movies");
          setMovies([]); 
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
  }, [isLoggedIn]); // Re-run when auth status changes

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
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <div className="text-white text-xl">Loading movies...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        
        {/* Show button only when user is NOT logged in */}
        {!isLoggedIn && (
          <div className="mb-12 text-center">
            <button
              onClick={handleGetRecommended}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Recommended
            </button>
            <p className="text-gray-400 text-sm mt-2">
              Sign in to get personalized movie recommendations
            </p>
          </div>
        )}

        {/* Show content only when user is logged in */}
        {isLoggedIn && (
          <>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-4xl lg:text-5xl font-bold text-white">
                  Recommended By our model
                </h3>
                {error && (
                  <p className="text-yellow-400 text-sm mt-2">
                    Showing fallback data due to: {error}
                  </p>
                )}
              </div>
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

            {error && movies.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-red-400 text-xl">Error: {error}</div>
              </div>
            ) : movies.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-400 text-xl">No movies available</div>
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
                    className="flex transition-transform duration-500 ease-in-out gap-5"
                    style={{
                      transform: `translateX(-${currentIndex * itemWidth}px)`,
                    }}
                  >
                    {movies.map((movie) => (
                      <div key={movie.id || movie.imdbID} className="flex-shrink-0">
                        <ReccomendedByOurModelTemplate movie={movie} />
                      </div>
                    ))}
                  </div>

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

                {movies.length > visibleItems && (
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
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};
