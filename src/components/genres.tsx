import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { RiMenuSearchFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { getMovieByTitle } from "../services/movie.service";

// Updated interface to match the new API response
interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Type: string;
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
          className="rounded-2xl transition-transform duration-300 group-hover:scale-110"
          src={movie.Poster}
          alt={movie.Title}
        />

        {/* Green tick mark for selected movies */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <FaCheck className="text-white w-3 h-3" />
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h4 className="text-white font-semibold text-lg mb-1">
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
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInitialMovies = async () => {
      setLoading(true);
      const allMovies: Movie[] = [];

      for (const title of movieTitles) {
        try {
          const res = await getMovieByTitle(title);
          if (
            res.success &&
            res.data.Response === "True" &&
            res.data.Search.length > 0
          ) {
            // Get the first result for each title
            const firstResult = res.data.Search[0];
            allMovies.push({
              imdbID: firstResult.imdbID,
              Title: firstResult.Title,
              Poster: firstResult.Poster,
              Year: firstResult.Year,
              Type: firstResult.Type,
            });
          }
        } catch (error) {
          console.error(`Error fetching ${title}:`, error);
        }
      }

      setMovies(allMovies);
      setLoading(false);
    };

    loadInitialMovies();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await getMovieByTitle(query.trim());
      if (
        res.success &&
        res.data.Response === "True" &&
        res.data.Search.length > 0
      ) {
        const searchedMovies: Movie[] = res.data.Search.map((movie) => ({
          imdbID: movie.imdbID,
          Title: movie.Title,
          Poster: movie.Poster,
          Year: movie.Year,
          Type: movie.Type,
        }));
        setMovies(searchedMovies);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Error searching movies:", error);
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
    setSelectedMovies((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  return (
    <div className="min-h-screen bg-primary relative">
      <div className="text-center py-8">
        <h1 className="text-white text-2xl font-bold tracking-wider">
          AN AI MOVIES APP CREATED WITH REACT
        </h1>
      </div>

      <div className="w-[920px] mx-auto px-6">
        <div className="bg-[#1b1919] rounded-lg p-8 shadow-2xl">
          {/* 🔍 Search Bar */}
          <div className="relative flex items-center justify-end mb-[48px]">
            <div className="flex items-center px-2 pl-5 py-3 w-[320px] gap-3 border border-gray-700 rounded-3xl text-white min-w-0 relative bg-[#111]">
              <IoIosSearch className="text-gray-400 w-6 h-6" />
              <input
                className="text-white bg-transparent outline-none flex-1 min-w-0"
                placeholder="Search Anything"
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

              {/* 🔽 Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute top-[110%] left-0 right-0 bg-[#222] text-white z-10 rounded-md overflow-hidden shadow-lg">
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-white ml-3">Loading movies...</span>
            </div>
          )}

          <div className="grid grid-cols-4 gap-6">
            {!loading && movies.length > 0 ? (
              movies.map((movie) => (
                <TrendingSectionTemplate
                  key={movie.imdbID}
                  movie={movie}
                  isSelected={selectedMovies.includes(movie.imdbID)}
                  onSelect={toggleMovieSelection}
                />
              ))
            ) : !loading ? (
              <p className="text-white col-span-4 text-center">
                No movies found
              </p>
            ) : null}
          </div>

          {selectedMovies.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-green-400 font-semibold">
                {selectedMovies.length} movie
                {selectedMovies.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesApp;
