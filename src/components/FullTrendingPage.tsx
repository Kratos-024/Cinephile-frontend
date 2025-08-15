/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { getTrendingMovies, type IMDBTrendingResponse } from "../services/movie.service";

export const MovieSection = ({ movie }: { movie: IMDBTrendingResponse }) => {
  return (
    <div className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105">
      <Link to={`/movie/${movie.watchlistId}/${movie.title}`}>
        <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
          <img
            className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110"
            src={movie.posterUrl.replace(/_V1_.*\..*jpg$/, "_V1_.jpg")}
            alt={movie.title}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <h4 className="text-white font-bold text-xl mb-2 line-clamp-2">
              {movie.title}
            </h4>
            <p className="text-gray-300 text-sm">
              Released: {movie.year}
            </p>
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-green-400/50 text-sm font-bold shadow-lg">
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

  const ITEMS_PER_PAGE = 12; 

  useEffect(() => {
    const getTrendingMovieArray = async () => {
      try {
        setLoading(true);
        const response = await getTrendingMovies();

        if (response.success && Array.isArray(response.data)) {
          setMovies(response.data);
        }
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getTrendingMovieArray();
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    
    setTimeout(() => {
      setItemsToShow(prev => Math.min(prev + ITEMS_PER_PAGE, movies.length));
      setLoadingMore(false);
    }, 500);
  };

  const moviesToDisplay = movies.slice(0, itemsToShow);
  const hasMoreMovies = itemsToShow < movies.length;

  return (
    <section className="min-h-screen bg-primary py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trending Movies
          </h1>
          <p className="text-gray-400 text-lg">
            Discover the most popular movies right now
          </p>
        </div>
        {loading && (
          <div className="flex justify-center items-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="text-white ml-3">Loading movies...</span>
          </div>
        )}
        {!loading && movies.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {moviesToDisplay.map((movie, index) => (
                <MovieSection key={`${movie.watchlistId}-${index}`} movie={movie} />
              ))}
            </div>
            {hasMoreMovies && (
              <div className="flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                      Load More Movies ({Math.min(ITEMS_PER_PAGE, movies.length - itemsToShow)} more)
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm">
                Showing {moviesToDisplay.length} of {movies.length} movies
              </p>
            </div>
          </>
        )}
        {!loading && movies.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-gray-400 text-xl font-medium mb-2">
              No movies found
            </h3>
            <p className="text-gray-500">
              Try refreshing the page or check back later
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
