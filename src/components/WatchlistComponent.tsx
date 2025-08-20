import { useEffect, useState } from "react";
import { getUserWatchlist, RemoveFromWatchlist } from "../services/user.service";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const MovieSection = ({
  movie,
}: {
  movie: {
    vote_average: string;
    title: string;
    release_date: string;
    imdbId: string;
    poster_path: string;
  };
}) => {
  const [isLiked, setIsLiked] = useState(true); 

  const removeHandler = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return;
    }
    setIsLiked(false);
    try {
      const response = await RemoveFromWatchlist(token, {
        imdbId: movie.imdbId,
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setIsLiked(true);
      }
    } catch (error) {
      setIsLiked(true);
      throw error
    }
  };

  return (
    <div className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105">
      <Link to={`/movie/${movie.imdbId}/${movie.title}`}>
        <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
          <img
            className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110"
            src={movie.poster_path.replace(/_V1_.*\..*.jpg$/, "_V1_.jpg")}
            alt={movie.title}
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <h4 className="text-white font-bold text-xl mb-2 line-clamp-2">
              {movie.title}
            </h4>
            <p className="text-gray-300 text-sm">
              Released: {movie.release_date}
            </p>
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-green-400/50 text-sm font-bold shadow-lg">
          <span className="text-green-400">★</span> {movie.vote_average}
        </div>
      </Link>

      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation(); 
            removeHandler();
          }}
          className="p-3 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 hover:scale-110 transition-all duration-300 shadow-lg group/heart"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${
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

export const Watchlist = () => {
  const [movies, setMovies] = useState<
    {
      vote_average: string;
      title: string;
      release_date: string;
      imdbId: string;
      poster_path: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check authentication and redirect if not logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to view your watchlist", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/", { replace: true });
        return false;
      }
      return true;
    };

    if (!checkAuth()) return;

    // Only proceed with data fetching if user is authenticated
    const getUserWatchlistHandler = async (isLoadMore: boolean = false) => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/", { replace: true });
        return;
      }

      try {
        setLoading(true);
        const response = await getUserWatchlist(token, userId);
        if (response.success) {
          setMovies(response.data.watchlistMovies);
        } else {
          toast.error("Failed to load watchlist", {
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
        toast.error("An error occurred while loading your watchlist", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        if (!isLoadMore) {
          setMovies([]);
        }
        setHasMore(false);
        throw error
      } finally {
        setLoading(false);
      }
    };

    getUserWatchlistHandler();
  }, [navigate]);

  return (
    <section className="min-h-screen bg-primary py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            My Watchlist
          </h1>
          <p className="text-gray-400 text-lg">
            Movies you've saved to watch later
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="text-white ml-3">Loading movies...</span>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <MovieSection key={movie.imdbId} movie={movie} />
            ))}
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center mt-16">
            <div className="text-gray-400 text-xl mb-4">Your watchlist is empty</div>
            <p className="text-gray-500 mb-6">Start adding movies to your watchlist to see them here!</p>
            <Link 
              to="/"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        )}

        {!loading && movies.length > 0 && !hasMore && (
          <div className="text-center mt-16">
            <p className="text-gray-400 text-lg">That's all your saved movies!</p>
          </div>
        )}
      </div>
    </section>
  );
};
