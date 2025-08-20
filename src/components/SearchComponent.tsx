/* eslint-disable react-hooks/exhaustive-deps */
 
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMoviesByTitle } from "../services/movie.service";

export const MovieSection = ({
  movie,
}: {
  movie: { Title: string; Year: string; imdbID: string; Poster: string };
}) => {
  return (
    <div className="relative group cursor-pointer 
      transform transition-all duration-500 hover:scale-105
      w-full max-w-sm mx-auto">
      
      <Link to={`/movie/${movie.imdbID}/${movie.Title}`}>
        <div className="relative overflow-hidden 
          rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl 
          transition-all duration-500
          bg-gray-800/20 backdrop-blur-sm">
          
          <img
            className="w-full object-cover transition-transform duration-700 
              group-hover:scale-110
              h-[280px] xs:h-[320px] sm:h-[360px] md:h-[400px] lg:h-[450px]
              aspect-[3/4]"
            src={movie.Poster}
            alt={movie.Title}
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
              text-sm sm:text-base md:text-lg lg:text-xl">
              {movie.Title}
            </h4>
            <p className="text-gray-300 
              text-xs sm:text-sm md:text-base">
              Released: {movie.Year}
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
          <span className="text-green-400">★</span> 5
        </div>
      </Link>

      {/* Heart button */}
      <div className="absolute top-2 sm:top-3 md:top-4 
        right-2 sm:right-3 md:right-4 z-10">
        <button className="p-2 sm:p-2.5 md:p-3 
          rounded-lg sm:rounded-xl 
          bg-black/60 backdrop-blur-md 
          hover:bg-black/80 hover:scale-110 
          transition-all duration-300 shadow-lg group/heart">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white 
            group-hover/heart:text-red-400 
            group-hover/heart:fill-red-400 
            transition-all duration-300" />
        </button>
      </div>
    </div>
  );
};

export const SearchComponent = () => {
  const { title } = useParams();
  const [movies, setMovies] = useState<
    { Title: string; Year: string; imdbID: string; Poster: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalResults, setTotalResults] = useState<number>(0);

  const getSearchMovies = async (
    pageNum: number,
    isLoadMore: boolean = false
  ) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await getMoviesByTitle(title, pageNum);

      if (response.success && response.data.Search) {
        const newMovies = response.data.Search;
        const total = parseInt(response.data.totalResults) || 0;

        setTotalResults(total);

        if (isLoadMore) {
          setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        } else {
          setMovies(newMovies);
        }

        const totalPages = Math.ceil(total / 8);
        setHasMore(pageNum < totalPages);
      } else {
        if (!isLoadMore) {
          setMovies([]);
        }
        setError(`${response["success"]}` || "No movies found");
        setHasMore(false);
      }
    } catch (error: any) {
      console.error("Error in getSearchMovies:", error);

      if (error.message.includes("too broad")) {
        setError("Be more specific.");
      } else {
        setError(error.message || "An error occurred fetching movies");
      }

      if (!isLoadMore) {
        setMovies([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (title) {
      setPage(1);
      setMovies([]);
      setHasMore(true);
      getSearchMovies(1, false);
    }
  }, [title]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getSearchMovies(nextPage, true);
  };

  return (
    <section className="min-h-screen bg-primary 
      py-6 sm:py-8 md:py-10 lg:py-12 
      px-2 sm:px-4 md:px-6">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="font-bold text-white mb-2 sm:mb-3 md:mb-4
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Search Results for{" "}
            <span className="text-white bg-gradient-to-r from-blue-400 to-purple-400 
              bg-clip-text text-transparent">
              "{title}"
            </span>
          </h2>
          <p className="text-gray-400 
            text-sm sm:text-base md:text-lg">
            {totalResults > 0
              ? `Showing ${movies.length} of ${totalResults} movies`
              : `Found ${movies.length} movies`}
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

        {/* Error State */}
        {error && !loading && (
          <div className="text-center mb-6 sm:mb-8 
            p-4 sm:p-6 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 
              bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium
              text-sm sm:text-base md:text-lg">
              {error}
            </p>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && movies.length > 0 && (
          <div className="grid gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16
            grid-cols-1 xs:grid-cols-2 
            sm:grid-cols-2 md:grid-cols-3 
            lg:grid-cols-3 xl:grid-cols-4 
            2xl:grid-cols-5">
            {movies.map((movie) => (
              <MovieSection key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && movies.length > 0 && hasMore && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 sm:px-8 py-3 sm:py-4 
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-700 hover:to-purple-700 
                text-white font-semibold 
                rounded-xl sm:rounded-2xl 
                transform hover:scale-105 
                transition-all duration-300 
                shadow-lg hover:shadow-xl 
                disabled:opacity-50 disabled:cursor-not-allowed 
                disabled:transform-none
                text-sm sm:text-base md:text-lg
                min-h-[44px] w-full sm:w-auto max-w-sm"
            >
              {loadingMore ? (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="animate-spin rounded-full 
                    h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                  <span>Loading More...</span>
                </div>
              ) : (
                "Load More Movies"
              )}
            </button>
          </div>
        )}

        {/* End of Results */}
        {!loading && movies.length > 0 && !hasMore && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 
              bg-gray-700/50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium
              text-sm sm:text-base md:text-lg">
              That's all the movies we found!
            </p>
          </div>
        )}

        {/* No Results State */}
        {!loading && movies.length === 0 && !error && title && (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
              mx-auto mb-4 sm:mb-6 bg-gray-700/30 rounded-full 
              flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-500" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-300 mb-2 sm:mb-4
              text-lg sm:text-xl md:text-2xl">
              No movies found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto
              text-sm sm:text-base">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

