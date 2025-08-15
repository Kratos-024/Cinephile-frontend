/* eslint-disable @typescript-eslint/no-explicit-any */
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
    <div className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105">
      <Link to={`/movie/${movie.imdbID}/${movie.Title}`}>
        <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
          <img
            className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110"
            src={movie.Poster}
            alt={movie.Title}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <h4 className="text-white font-bold text-xl mb-2 line-clamp-2">
              {movie.Title}
            </h4>
            <p className="text-gray-300 text-sm">Released: {movie.Year}</p>
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-green-400/50 text-sm font-bold shadow-lg">
          <span className="text-green-400">★</span> 5
        </div>
      </Link>

      <div className="absolute top-4 right-4 z-10">
        <button className="p-3 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 hover:scale-110 transition-all duration-300 shadow-lg group/heart">
          <Heart className="w-5 h-5 text-white group-hover/heart:text-red-400 group-hover/heart:fill-red-400 transition-all duration-300" />
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
    <section className="min-h-screen bg-primary py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Search Results for <span className="text-white">{title}</span>
          </h2>
          <p className="text-gray-400 text-lg">
            {totalResults > 0
              ? `Showing ${movies.length} of ${totalResults} movies`
              : `Found ${movies.length} movies`}
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="text-white ml-3">Loading movies...</span>
          </div>
        )}

        {error && !loading && (
          <div className="text-center mb-8">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <MovieSection key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}

        {!loading && movies.length > 0 && hasMore && (
          <div className="text-center mt-16">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loadingMore ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading More...
                </div>
              ) : (
                "Load More Movies"
              )}
            </button>
          </div>
        )}

        {!loading && movies.length > 0 && !hasMore && (
          <div className="text-center mt-16">
            <p className="text-gray-400 text-lg">No more movies to load</p>
          </div>
        )}
      </div>
    </section>
  );
};
