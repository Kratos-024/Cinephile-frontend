/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { RiMenuSearchFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { getMovieByTitle } from "../services/movie.service";
import { saveUserPreferences } from "../services/user.service";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Type: string;
}

interface SelectedMovie {
  imdbID: string;
  title: string;
}

const TrendingSectionTemplate = ({
  movie,
  isSelected,
  onSelect,
}: {
  movie: Movie;
  isSelected: boolean;
  onSelect: (movieId: string) => void;
}) => {
  return (
    <div
      key={movie.imdbID}
      className={`relative rounded-2xl group w-[160px] cursor-pointer transform transition-all duration-300 hover:scale-105 ${
        isSelected ? "ring-4 ring-green-500" : ""
      }`}
      onClick={() => onSelect(movie.imdbID)}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          className="rounded-2xl transition-transform duration-300 group-hover:scale-110 w-full h-[240px] object-cover"
          src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder-movie.jpg"}
          alt={movie.Title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-movie.jpg";
          }}
        />

        {isSelected && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <FaCheck className="text-white w-3 h-3" />
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h4 className="text-white font-semibold text-lg mb-1 truncate">
            {movie.Title}
          </h4>
          <p className="text-gray-300 text-sm">
            {movie.Year} • {movie.Type}
          </p>
        </div>
      </div>
    </div>
  );
};

const movieTitles = [
  "Inception",
  "The Godfather",
  "The Dark Knight",
  "Pulp Fiction",
  "Forrest Gump",
  "Interstellar",
  "Fight Club",
  "The Shawshank Redemption",
  "La La Land",
  "Parasite",
  "Spirited Away",
  "The Social Network",
  "Gladiator",
  "Whiplash",
  "The Matrix",
  "Avengers: Endgame",
];

const MoviesApp = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<SelectedMovie[]>([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialMovies = async () => {
      setLoading(true);
      setError(null);
      const allMovies: Movie[] = [];

      for (const title of movieTitles) {
        try {
          const res = await getMovieByTitle(title);
          if (
            res.success &&
            res.data.Response === "True" &&
            res.data.Search?.length > 0
          ) {
            const firstResult = res.data.Search[0];
            if (firstResult.imdbID && firstResult.Title) {
              allMovies.push({
                imdbID: firstResult.imdbID,
                Title: firstResult.Title,
                Poster: firstResult.Poster || "N/A",
                Year: firstResult.Year || "Unknown",
                Type: firstResult.Type || "movie",
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching ${title}:`, error);
        }
      }

      if (allMovies.length === 0) {
        setError("Failed to load movies. Please refresh the page.");
      }

      setMovies(allMovies);
      setLoading(false);
    };

    loadInitialMovies();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      const initialMovies = movies.filter((movie) =>
        movieTitles.includes(movie.Title)
      );
      if (initialMovies.length === 0) {
        window.location.reload();
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await getMovieByTitle(query.trim());
      if (
        res.success &&
        res.data.Response === "True" &&
        res.data.Search?.length > 0
      ) {
        const searchedMovies: Movie[] = res.data.Search.filter(
          (movie: any) => movie.imdbID && movie.Title
        ).map((movie: any) => ({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Poster: movie.Poster || "N/A",
          Year: movie.Year || "Unknown",
          Type: movie.Type || "movie",
        }));
        setMovies(searchedMovies);
      } else {
        setMovies([]);
        setError("No movies found for your search.");
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      setError("Failed to search movies. Please try again.");
      setMovies([]);
    }
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setSuggestions([]);
    handleSearch(suggestion);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      const filtered = movieTitles.filter((title) =>
        title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const toggleMovieSelection = (movieId: string) => {
    const movie = movies.find((m) => m.imdbID === movieId);
    if (!movie) return;

    setSelectedMovies((prev) => {
      const isSelected = prev.some((m) => m.imdbID === movieId);

      if (isSelected) {
        return prev.filter((m) => m.imdbID !== movieId);
      } else if (prev.length < 5) {
        return [...prev, { imdbID: movie.imdbID, title: movie.Title }];
      } else {
        return [...prev.slice(1), { imdbID: movie.imdbID, title: movie.Title }];
      }
    });
  };

  const userPreferenceHandler = async () => {
    if (selectedMovies.length < 3) {
      alert("Please select at least 3 movies");
      return;
    }
    console.log(selectedMovies);
    setIsProcessing(true);
    try {
      const token = localStorage.getItem("authToken") || "";

      const preferences = selectedMovies.map((movie) => ({
        title: movie.title,
        imdbID: movie.imdbID,
      }));

      console.log("Saving preferences:", preferences);

      const response = await saveUserPreferences(preferences, token);

      if (response.success) {
        console.log("Preferences saved successfully!");
        window.location.href = "/";
      } else {
        //@ts-ignore
        throw new Error(response.error || "Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save your preferences. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSelections = () => {
    setSelectedMovies([]);
  };

  return (
    <div className="min-h-screen bg-primary relative">
      <div className="text-center py-8">
        <h1 className="text-white text-2xl font-bold tracking-wider">
          AI MOVIE RECOMMENDATION APP
        </h1>
        <p className="text-gray-300 mt-2">
          Select 3-5 movies to get personalized recommendations
        </p>
      </div>

      <div className="w-[920px] mx-auto px-6">
        <div className="bg-[#1b1919] rounded-lg p-8 shadow-2xl">
          {/* Search Bar */}
          <div className="relative flex items-center justify-end mb-[48px]">
            <div className="flex items-center px-2 pl-5 py-3 w-[320px] gap-3 border border-gray-700 rounded-3xl text-white min-w-0 relative bg-[#111]">
              <IoIosSearch className="text-gray-400 w-6 h-6" />
              <input
                className="text-white bg-transparent outline-none flex-1 min-w-0"
                placeholder="Search movies..."
                value={search}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(search);
                    setSuggestions([]);
                  }
                }}
              />
              <RiMenuSearchFill
                className="text-gray-400 w-6 h-6 cursor-pointer hover:text-white transition-colors"
                onClick={() => {
                  handleSearch(search);
                  setSuggestions([]);
                }}
              />
              {suggestions.length > 0 && (
                <ul className="absolute top-[110%] left-0 right-0 bg-[#222] text-white z-10 rounded-md overflow-hidden shadow-lg border border-gray-600">
                  {suggestions.map((sug, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-[#333] cursor-pointer text-sm transition-colors"
                      onClick={() => handleSuggestionClick(sug)}
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {loading && (
            <div className="flex justify-center items-center mb-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="text-white ml-3">Loading movies...</span>
            </div>
          )}
          {error && (
            <div className="text-center mb-8">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-6 mb-8">
            {!loading && movies.length > 0 ? (
              movies.map((movie) => (
                <TrendingSectionTemplate
                  key={movie.imdbID}
                  movie={movie}
                  isSelected={selectedMovies.some(
                    (m) => m.imdbID === movie.imdbID
                  )}
                  onSelect={toggleMovieSelection}
                />
              ))
            ) : !loading && !error ? (
              <p className="text-white col-span-4 text-center py-8">
                No movies found
              </p>
            ) : null}
          </div>
          {selectedMovies.length > 0 && (
            <div className="text-center border-t border-gray-700 pt-6">
              <div className="mb-4">
                <p className="text-green-400 font-semibold text-lg mb-2">
                  {selectedMovies.length} movie
                  {selectedMovies.length !== 1 ? "s" : ""} selected
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {selectedMovies.map((movie) => (
                    <span
                      key={movie.imdbID}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {movie.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                {selectedMovies.length >= 3 && (
                  <button
                    onClick={userPreferenceHandler}
                    disabled={isProcessing}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </span>
                    ) : (
                      "Get Recommendations →"
                    )}
                  </button>
                )}

                {selectedMovies.length > 0 && (
                  <button
                    onClick={clearSelections}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {selectedMovies.length < 3 && (
                <p className="text-gray-400 text-sm mt-4">
                  Select {3 - selectedMovies.length} more movie
                  {3 - selectedMovies.length !== 1 ? "s" : ""} to continue
                </p>
              )}

              {selectedMovies.length >= 5 && (
                <p className="text-yellow-400 text-sm mt-4">
                  Maximum 5 movies can be selected
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesApp;
