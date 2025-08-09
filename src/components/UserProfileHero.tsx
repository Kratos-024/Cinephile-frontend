import { Heart } from "lucide-react";
import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
}
export const MovieSectionTemplate = ({
  movie,
  section,
}: {
  section: string;
  movie: Movie;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatRating = (rating: number) => {
    return (rating / 10).toFixed(1);
  };

  const getYear = (date?: string) => {
    return date ? new Date(date).getFullYear() : "";
  };

  return (
    <div
      className="group relative rounded-2xl cursor-pointer
     transform transition-all duration-300 
      hover:z-10"
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        {!imageLoaded && (
          <div className="w-full aspect-[2/3] bg-gray-800 animate-pulse rounded-2xl flex items-center justify-center">
            <div className="text-gray-600 text-sm">Loading...</div>
          </div>
        )}

        <img
          className={`w-full aspect-[2/3] object-cover 
            rounded-2xl transition-transform duration-300 
            group-hover:scale-110 ${!imageLoaded ? "hidden" : "block"}`}
          src={
            movie.poster_path?.includes("http")
              ? movie.poster_path
              : `https://image.tmdb.org/t/p/w500/${
                  movie.poster_path || "placeholder"
                }`
          }
          alt={`${movie.title} poster`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <h4 className="text-white font-bold text-lg mb-1 line-clamp-2 leading-tight">
            {movie.title}
          </h4>
          {movie.release_date && (
            <p className="text-gray-300 text-sm font-medium">
              {getYear(movie.release_date)}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <button className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-white/30 transition-colors">
              View Details
            </button>
            {section != "watchlist" && (
              <button className="bg-orange-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-500 transition-colors">
                Add to List
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute top-3 left-3 bg-black/80 
      backdrop-blur-sm text-white px-2 py-1 rounded-lg
      border border-yellow-400/50 text-sm font-bold flex
       items-center gap-1 shadow-lg"
      >
        <span className="text-yellow-400">★</span>
        <span>{formatRating(movie.vote_average)}</span>
      </div>

      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all duration-300 transform hover:scale-110 shadow-lg"
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isLiked
                ? "fill-red-500 text-red-500 scale-110"
                : "text-white hover:text-red-400"
            }`}
          />
        </button>
      </div>

      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
    </div>
  );
};

const WatchlistSection = () => {
  const sampleMovies: Movie[] = [
    {
      id: 1,
      title: "I Saw the TV Glow",
      poster_path:
        "https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg",
      vote_average: 77,
      release_date: "2024-05-03",
    },
    {
      id: 2,
      title: "Dune: Part Two",
      poster_path:
        "https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg",
      vote_average: 83,
      release_date: "2024-03-01",
    },
    {
      id: 3,
      title: "The Substance",
      poster_path:
        "https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg",
      vote_average: 75,
      release_date: "2024-09-20",
    },
    {
      id: 4,
      title: "Furiosa: A Mad Max Saga",
      poster_path:
        "https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg",
      vote_average: 79,
      release_date: "2024-05-24",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Recent Activity
          </h2>
          <p className="text-gray-400 text-sm">Your latest watched films</p>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 
          md:grid-cols-3 
      lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
      >
        {sampleMovies.map((movie) => (
          <MovieSectionTemplate
            section={"watchlist"}
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>

      {sampleMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-600 text-2xl">🎬</span>
          </div>
          <h3 className="text-gray-400 text-lg font-medium mb-2">
            No films yet
          </h3>
          <p className="text-gray-500 text-sm">
            Start watching and rating movies to see them here
          </p>
        </div>
      )}
    </div>
  );
};

const FilmSection = () => {
  const sampleMovies: Movie[] = [
    {
      id: 1,
      title: "I Saw the TV Glow",
      poster_path:
        "https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg",
      vote_average: 77,
      release_date: "2024-05-03",
    },
    {
      id: 2,
      title: "Dune: Part Two",
      poster_path:
        "https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg",
      vote_average: 83,
      release_date: "2024-03-01",
    },
    {
      id: 3,
      title: "The Substance",
      poster_path:
        "https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg",
      vote_average: 75,
      release_date: "2024-09-20",
    },
    {
      id: 4,
      title: "Furiosa: A Mad Max Saga",
      poster_path:
        "https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg",
      vote_average: 79,
      release_date: "2024-05-24",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Recent Activity
          </h2>
          <p className="text-gray-400 text-sm">Your latest watched films</p>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 
          md:grid-cols-3 
      lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
      >
        {sampleMovies.map((movie) => (
          <MovieSectionTemplate
            section={"films"}
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>

      {sampleMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-600 text-2xl">🎬</span>
          </div>
          <h3 className="text-gray-400 text-lg font-medium mb-2">
            No films yet
          </h3>
          <p className="text-gray-500 text-sm">
            Start watching and rating movies to see them here
          </p>
        </div>
      )}
    </div>
  );
};

const ReviewsSection = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-400 text-sm uppercase tracking-wide">
          Recent Reviews
        </h2>
        <button className="text-gray-400 text-sm hover:text-white">MORE</button>
      </div>

      <div className="flex gap-4 p-4 bg-gray-800 bg-opacity-30 rounded">
        <img
          src="https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg"
          alt="I Saw the TV Glow"
          className="w-16 h-24 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="text-white text-lg font-semibold mb-1">
            I Saw the TV Glow
            <span className="text-gray-400 font-normal">2024</span>
          </h3>
          <div className="flex text-green-500 text-xs mb-2">
            {"★★★☆☆".split("").map((star, i) => (
              <span key={i}>{star}</span>
            ))}
            <span className="text-gray-400 ml-2">Watched 12 Jul 2024</span>
          </div>
          <p className="text-gray-300 text-sm mb-2">
            very weird movie with a good plot that explore escapism from reality
            However, the ending is strange and difficult to understand
          </p>
          <div className="flex items-center text-gray-400 text-xs">
            <span>♡ No likes yet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 py-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Favorite Films Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 text-sm uppercase tracking-wide">
              Favorite Films
            </h2>
          </div>
          <p className="text-gray-400 text-sm">
            Don't forget to select your
            <span className="text-orange-500">favorite films</span>!
          </p>
        </div>

        {/* Recent Activity Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-400 text-sm uppercase tracking-wide">
              Recent Activity
            </h2>
            <button className="text-gray-400 text-sm hover:text-white">
              ALL
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative group cursor-pointer">
              <img
                src="https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg"
                alt="I Saw the TV Glow"
                className="w-full aspect-[2/3] object-cover rounded"
              />
              <div className="absolute bottom-2 left-2">
                <div className="flex text-orange-500 text-xs">
                  {"★★★☆☆".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-full aspect-[2/3] bg-gray-800 rounded"
              ></div>
            ))}
          </div>
        </div>

        {/* Recent Reviews Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-400 text-sm uppercase tracking-wide">
              Recent Reviews
            </h2>
            <button className="text-gray-400 text-sm hover:text-white">
              MORE
            </button>
          </div>

          <div className="flex gap-4 p-4 bg-gray-800 bg-opacity-30 rounded">
            <img
              src="https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/02/i-saw-the-tv-glow-film-poster.jpg"
              alt="I Saw the TV Glow"
              className="w-16 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-white text-lg font-semibold mb-1">
                I Saw the TV Glow
                <span className="text-gray-400 font-normal">2024</span>
              </h3>
              <div className="flex text-green-500 text-xs mb-2">
                {"★★★☆☆".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
                <span className="text-gray-400 ml-2">Watched 12 Jul 2024</span>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                very weird movie with a good plot that explore escapism from
                reality However, the ending is strange and difficult to
                understand
              </p>
              <div className="flex items-center text-gray-400 text-xs">
                <span>♡ No likes yet</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-8">
        {/* Diary Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 text-sm uppercase tracking-wide">
              Diary
            </h2>
            <button className="text-gray-400 text-sm hover:text-white">
              1
            </button>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-800 bg-opacity-30 rounded">
            <div className="text-center">
              <div className="text-gray-400 text-xs">12</div>
              <div className="text-gray-400 text-xs">JUL</div>
            </div>
            <span className="text-gray-300 text-sm">I Saw the TV Glow</span>
          </div>
        </div>

        {/* Ratings Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 text-sm uppercase tracking-wide">
              Ratings
            </h2>
            <button className="text-gray-400 text-sm hover:text-white">
              1
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-green-500 text-sm">★</span>
              <div className="flex-1 mx-3 bg-gray-700 h-2 rounded">
                <div
                  className="bg-gray-600 h-2 rounded"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <span className="text-green-500 text-sm">★★★★★</span>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div>
          <h2 className="text-gray-400 text-sm uppercase tracking-wide mb-4">
            Activity
          </h2>
          <p className="text-gray-400 text-sm">No recent activity</p>
        </div>

        {/* Pro Upgrade Banner */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-white text-xl font-bold mb-2">
              NEED AN UPGRADE?
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Profile stats, filtering by favorite streaming services, watchlist
              alerts and no ads!
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2">
              GET
              <span className="bg-green-700 px-2 py-1 rounded text-xs">
                PRO
              </span>
            </button>
          </div>
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-orange-500 to-transparent opacity-20"></div>
        </div>
      </div>
    </div>
  );
};
export const UserProfileHero = () => {
  const [navigation, setNavigation] = useState("Profile");
  const navigationHandler = (nav: string) => {
    setNavigation(nav);
  };
  return (
    <section className="bg-primary w-full min-h-screen  pb-[96px]">
      <div className="relative">
        <img
          className="w-full h-[340px] relative"
          src="images/heroImages/cinemaCover.png"
          alt="user-profile-hero"
        />
        <div className="flex items-start gap-6 px-8 -mt-20 relative z-10">
          <img
            className="rounded-full w-[246px] h-[246px] object-cover border-4 border-white"
            src="images/heroImages/userProfile.jpg"
            alt="profile"
          />
          <div className="flex-1 flex justify-between mt-[86px]">
            <div className="flex flex-col gap-4 mb-4">
              <h1 className="text-white text-4xl font-bold">
                Priyanshu Tiwari
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                It makes you forget the wonderful yesterday
              </p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-white text-2xl font-bold">1</div>
                <div className="text-gray-400 text-sm">FANS</div>
              </div>
              <div className="text-center">
                <div className="text-white text-2xl font-bold">1</div>
                <div className="text-gray-400 text-sm">IN 2023</div>
              </div>
              <div className="text-center">
                <div className="text-white text-2xl font-bold">0</div>
                <div className="text-gray-400 text-sm">FOLLOWING</div>
              </div>
              <div className="text-center">
                <div className="text-white text-2xl font-bold">0</div>
                <div className="text-gray-400 text-sm">FOLLOWERS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-700 mt-8">
        <nav className="flex space-x-8 px-8">
          {["Profile", "Films", "Watchlist", "Reviews", "Likes", "Network"].map(
            (tab) => (
              <button
                onClick={() => {
                  navigationHandler(tab);
                }}
                key={tab}
                className={`py-3 px-1 border-b-2 text-sm font-medium ${
                  tab === navigation
                    ? "border-orange-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </nav>
      </div>

      {navigation == "Profile" && <ProfileSection />}
      {navigation === "Reviews" && <ReviewsSection />}
      {navigation === "Films" && <FilmSection />}
      {navigation === "Watchlist" && <WatchlistSection />}
    </section>
  );
};
