import { useState } from "react";
import { Search, Play } from "lucide-react";
const TrendingSectionTemplate = ({
  movie,
}: {
  movie: {
    id: number;
    title: string;
    poster: string;
    genre: string;
  };
}) => {
  return (
    <div
      className="relative rounded-2xl group w-[160px] 
    cursor-pointer transform transition-all
     duration-300 hover:scale-105"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          className=" rounded-2xl transition-transform 
          duration-300 group-hover:scale-110"
          src={movie.poster}
          alt={movie.title}
        />

        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h4 className="text-white font-semibold text-lg mb-1">
            {movie.title}
          </h4>
          <p className="text-gray-300 text-sm">{movie.genre}</p>
        </div>
      </div>
    </div>
  );
};
const MoviesApp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGenre, setActiveGenre] = useState("POST-APOCALYPTIC");

  const genres = ["POST-APOCALYPTIC", "HEIST", "SUPERHERO"];

  const movies = [
    {
      id: 1,
      title: "Ant-Man",
      poster:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop&crop=faces",
      genre: "SUPERHERO",
    },
    {
      id: 2,
      title: "The Hangover Part III",
      poster:
        "https://images.unsplash.com/photo-1489599396154-c2f0c7e5e397?w=300&h=450&fit=crop",
      genre: "HEIST",
    },
    {
      id: 3,
      title: "Crazy Stupid Love",
      poster:
        "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
      genre: "POST-APOCALYPTIC",
    },
    {
      id: 4,
      title: "The Silence of the Lambs",
      poster:
        "https://images.unsplash.com/photo-1551792843-4146d55ae2ce?w=300&h=450&fit=crop",
      genre: "POST-APOCALYPTIC",
    },
    {
      id: 5,
      title: "Moonlight",
      poster:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
      genre: "POST-APOCALYPTIC",
    },
    {
      id: 6,
      title: "Saving Private Ryan",
      poster:
        "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop",
      genre: "POST-APOCALYPTIC",
    },
    {
      id: 7,
      title: "Rise of the Planet of the Apes",
      poster:
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
      genre: "POST-APOCALYPTIC",
    },
    {
      id: 8,
      title: "Predestination",
      poster:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
      genre: "POST-APOCALYPTIC",
    },
    {
      id: 9,
      title: "Star Wars: The Last Jedi",
      poster:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=450&fit=crop",
      genre: "POST-APOCALYPTIC",
    },
    {
      id: 10,
      title: "Children of Men",
      poster:
        "https://images.unsplash.com/photo-1518062031-7bac7df10386?w=300&h=450&fit=crop",
      genre: "POST-APOCALYPTIC",
    },
  ];

  return (
    <div className="min-h-screen bg-primary">
      <div className="text-center py-8">
        <h1
          className="text-white text-2xl font-bold 
        tracking-wider"
        >
          AN AI MOVIES APP CREATED WITH REACT
        </h1>
      </div>

      <div className="w-[920px] mx-auto px-6">
        <div className="bg-[#1b1919] rounded-lg p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-8">
              <h2 className="text-white text-3xl font-bold flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                Movies
              </h2>

              <div className="flex space-x-6">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setActiveGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeGenre === genre
                        ? "bg-blue-600 text-white"
                        : "text-blue-400 hover:text-blue-300"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none w-80"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div>{TrendingSectionTemplate({ movie })}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pb-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{`{}`}</span>
          </div>
          <span className="text-white font-medium">Coding Torque</span>
          <span className="text-gray-300 text-sm">
            Source code on codingtorque.com
          </span>
        </div>
      </div>
    </div>
  );
};

export default MoviesApp;
