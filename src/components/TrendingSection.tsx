/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import {
  getTrendingMovies,
  type MovieTrendingResult,
} from "../services/movie.service";
import { MovieLoader } from "./Loader";

export const TrendingSectionTemplate = ({
  movie,
}: {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    vote_average: number;
  };
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="relative rounded-2xl group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          className="w-[280px] h-[400px] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
          src={
            movie.poster_path?.includes("http")
              ? movie.poster_path
              : `https://image.tmdb.org/t/p/w500/${
                  movie.poster_path || "Image_loading"
                }`
          }
          alt={movie.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h4 className="text-white font-semibold text-lg mb-1">
            {movie.title}
          </h4>
          {/* <p className="text-gray-300 text-sm">{movie.genre}</p> */}
        </div>
      </div>

      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-green-400 text-sm font-semibold">
        <span>{movie.vote_average}</span>
      </div>

      <div className="absolute top-3 right-3">
        <button
          onClick={() => setIsLiked(!isLiked)}
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

export const TrendingSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isHovering, setIsHovering] = useState(false);
  const [movies, setMovie] = useState<MovieTrendingResult[]>([
    {
      adult: false,
      backdrop_path: "",
      id: 0,
      title: "",
      original_title: "",
      overview: "",
      poster_path: "",
      media_type: "",
      original_language: "",
      genre_ids: [0],
      popularity: 0,
      release_date: "",
      video: false,
      vote_average: 0,
      vote_count: 0,
    },
  ]);

  const sliderRef = useRef(null);
  const itemWidth = 300;
  const visibleItems = 4;

  useEffect(() => {
    const getTrendingMovieArray = async () => {
      const reponse = await getTrendingMovies();
      if (reponse.success) {
        setMovie(reponse.data.results);
        setLoading(false);
      }
    };
    getTrendingMovieArray();
  }, []);
  const maxIndex = Math.max(0, movies.length - visibleItems);

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (!isHovering) {
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
  }, [isHovering, maxIndex]);

  useEffect(() => {
    const handleKeyDown = (e: { key: string }) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="py-11">
      <div className="container mx-auto px-2">
        <div
          className="flex items-center justify-between
         mb-12"
        >
          <h3 className="text-4xl lg:text-5xl font-bold text-white">
            Trending Movies
          </h3>

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
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {loading && (
            <div className=" justify-center flex  ">
              <MovieLoader />
            </div>
          )}
          {!loading && (
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out gap-5"
              style={{
                transform: `translateX(-${currentIndex * itemWidth}px)`,
              }}
            >
              {movies.map((movie) => (
                <div key={movie.id} className="flex-shrink-0">
                  <TrendingSectionTemplate movie={movie} />
                </div>
              ))}
            </div>
          )}

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
      </div>
    </section>
  );
};
