 import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { getTrendingMovies, type IMDBTrendingResponse } from "../services/movie.service";

export const MovieSection = ({ movie }: { movie: IMDBTrendingResponse }) => {
  return (
    <div className="relative group cursor-pointer 
      transform transition-all duration-500 hover:scale-105
      w-full max-w-sm mx-auto">
      
      <Link to={`/movie/${movie.watchlistId}/${movie.title}`}>
        <div className="relative overflow-hidden 
          rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl 
          transition-all duration-500
          bg-gray-800/20 backdrop-blur-sm">
          
          <img
            className="w-full object-cover transition-transform duration-700 
              group-hover:scale-110
              h-[300px] xs:h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]
              aspect-[3/4]"
            src={movie.posterUrl.replace(/_V1_.*\..*jpg$/, "_V1_.jpg")}
            alt={movie.title}
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t 
            from-black/80 via-black/20 to-transparent 
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-500 
            rounded-2xl sm:rounded-3xl" />

          {/* Movie info overlay */}
          <div className="absolute bottom-0 left-0 right-0 
            p-3 sm:p-4 md:p-5 lg:p-6 
            transform translate-y-6 sm:translate-y-8 
            group-hover:translate-y-0 
            opacity-0 group-hover:opacity-100 
            transition-all duration-500">
            
            <h4 className="text-white font-bold mb-1 sm:mb-2 line-clamp-2
              text-base sm:text-lg md:text-xl">
              {movie.title}
            </h4>
            <p className="text-gray-300 
              text-xs sm:text-sm">
              Released: {movie.year}
            </p>
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 sm:top-3 md:top-4 
          left-2 sm:left-3 md:left-4 
          bg-black/80 backdrop-blur-md text-white 
          px-2 sm:px-3 py-1 sm:py-2 
          rounded-lg sm:rounded-xl 
          border border-green-400/50 
          text-xs sm:text-sm font-bold shadow-lg">
          <span className="text-green-400">★</span> {movie.imdbRating}
        </div>
      </Link>
    </div>
  );
};

export const FullTrending = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [movies, setMovies] = useState<IMDBTrendingResponse[]>([]);
  const [itemsToShow, setItemsToShow] = useState<number>(12);

  // Responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(6);  // 6 items for mobile
      } else if (width < 1024) {
        setItemsPerPage(9);  // 9 items for tablet
      } else {
        setItemsPerPage(12); // 12 items for desktop
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  useEffect(() => {
    const getTrendingMovieArray = async () => {
      try {
        setLoading(true);
        const response = await getTrendingMovies();

        if (response.success && Array.isArray(response.data)) {
          setMovies(response.data);
          setItemsToShow(itemsPerPage); // Set initial items based on screen size
        }
      } catch (error) {
        // console.error("Error fetching trending movies:", error);
return    
      } finally {
        setLoading(false);
      }
    };

    getTrendingMovieArray();
  }, [itemsPerPage]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    
    setTimeout(() => {
      setItemsToShow(prev => Math.min(prev + itemsPerPage, movies.length));
      setLoadingMore(false);
    }, 500);
  };

  const moviesToDisplay = movies.slice(0, itemsToShow);
  const hasMoreMovies = itemsToShow < movies.length;

  return (
    <section className="min-h-screen bg-primary 
      py-6 sm:py-8 md:py-10 lg:py-12 
      px-2 sm:px-4 md:px-6">
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="font-bold text-white mb-2 sm:mb-3 md:mb-4
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Trending Movies
          </h1>
          <p className="text-gray-400 
            text-sm sm:text-base md:text-lg">
            Discover the most popular movies right now
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center mb-6 sm:mb-8 
            h-48 sm:h-56 md:h-64">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full 
                h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-500" />
              <span className="text-white 
                text-sm sm:text-base">
                Loading movies...
              </span>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && movies.length > 0 && (
          <>
            <div className="grid gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12
              grid-cols-1 xs:grid-cols-2 
              sm:grid-cols-2 md:grid-cols-3 
              lg:grid-cols-3 xl:grid-cols-4 
              2xl:grid-cols-5">
              {moviesToDisplay.map((movie, index) => (
                <MovieSection key={`${movie.watchlistId}-${index}`} movie={movie} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreMovies && (
              <div className="flex justify-center mb-6 sm:mb-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group flex items-center justify-center gap-2 sm:gap-3 
                    bg-gradient-to-r from-green-500 to-green-600 
                    hover:from-green-600 hover:to-green-700 
                    text-white font-semibold 
                    px-6 sm:px-8 py-3 sm:py-4 
                    rounded-full transition-all duration-300 
                    transform hover:scale-105 shadow-xl 
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    disabled:transform-none
                    text-sm sm:text-base md:text-lg
                    min-h-[44px] w-full sm:w-auto max-w-sm"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full 
                        h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                      <span className="hidden sm:inline">Loading...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 
                        group-hover:animate-bounce" />
                      <span>
                        Load More 
                        <span className="hidden sm:inline">
                          ({Math.min(itemsPerPage, movies.length - itemsToShow)} more)
                        </span>
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Results Counter */}
            <div className="text-center">
              <p className="text-gray-400 
                text-xs sm:text-sm">
                Showing {moviesToDisplay.length} of {movies.length} movies
              </p>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <h3 className="text-gray-400 font-medium mb-2 sm:mb-3
              text-lg sm:text-xl">
              No movies found
            </h3>
            <p className="text-gray-500 
              text-sm sm:text-base">
              Try refreshing the page or check back later
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

