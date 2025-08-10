/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { NavBar } from "../components/NavBar";
import { Menu } from "../components/Menu";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieData,
  type ApiMovieResponse,
  type MovieResponse,
  type MovieVideo,
} from "../services/movie.service";

export const VideoPlayer = ({ Videos }: { Videos: MovieVideo[] }) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  console.log("Videos in VideoPlayer:", Videos);

  const getVideoUrl = (videoUrl: string) => {
    if (!videoUrl) return "https://www.youtube.com/embed/xOsLIiBStEs";

    // Check if it's an IMDb video path
    if (videoUrl.startsWith("/video/")) {
      const videoId = videoUrl.match(/\/video\/(\w+)\//)?.[1];
      if (videoId) {
        return `https://www.imdb.com/video/imdb/${videoId}/player`;
      }
    }

    // Handle YouTube URLs
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      return getYouTubeEmbedUrl(videoUrl);
    }

    return videoUrl;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return url;
  };

  const currentVideo =
    Videos && Videos.length > 0 ? Videos[selectedVideoIndex] : null;

  const embedUrl = currentVideo
    ? getVideoUrl(currentVideo.videoUrl)
    : "https://www.youtube.com/embed/xOsLIiBStEs";

  return (
    <section className="flex flex-col justify-center items-center px-4 space-y-4">
      {/* Video Player */}
      <div className="w-full h-[550px] aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-700">
        <iframe
          className="w-full h-full"
          src={embedUrl}
          title={currentVideo?.title || "Movie trailer"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Video Selection Tabs */}
      {Videos && Videos.length > 1 && (
        <div className="flex space-x-4 mt-4">
          {Videos.map((video, index) => (
            <button
              key={index}
              onClick={() => setSelectedVideoIndex(index)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedVideoIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {video.title?.replace("Trailer", "").trim() ||
                `Video ${index + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Video Thumbnails */}
      {Videos && Videos.length > 1 && (
        <div className="flex space-x-4 mt-4">
          {Videos.map((video, index) => (
            <div
              key={index}
              onClick={() => setSelectedVideoIndex(index)}
              className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                selectedVideoIndex === index
                  ? "ring-2 ring-blue-500"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={video.imageUrl}
                alt={video.imageAlt || `Video ${index + 1}`}
                className="w-24 h-14 object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1489599511985-c1b6c27e3e1b?w=96&h=56&fit=crop";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const MovieDetails = ({
  movieData,
}: {
  movieData: ApiMovieResponse["data"];
}) => {
  const [activeTab, setActiveTab] = useState("Info");
  const [selectedLanguage, setSelectedLanguage] = useState("Tamil");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  console.log(currentImageIndex);
  const tabs = [
    { id: "Info", label: "Info" },
    { id: "Reviews", label: "Reviews" },
    { id: "Images", label: "Images" },
  ];

  const streamingServices = [
    { name: "Netflix", icon: "N", color: "bg-red-600" },
    { name: "Prime", icon: "P", color: "bg-blue-500", badge: "HD" },
    { name: "Hotstar", icon: "H", color: "bg-orange-500", badge: "UHD" },
    {
      name: "Youtube",
      icon: "fab fa-youtube",
      color: "bg-red-500",
      isIcon: true,
    },
  ];

  const languages = ["தமிழ்", "English", "తెలుగు", "हिन्दी"];

  const actions = [
    {
      id: "like",
      icon: "fas fa-thumbs-up",
      label: "Like",
      color: "bg-blue-600",
    },
    { id: "share", icon: "fas fa-share", label: "Share", color: "bg-gray-700" },
    {
      id: "watchlist",
      icon: "fas fa-bookmark",
      label: "Watchlist",
      color: "bg-gray-700",
    },
    { id: "seen", icon: "fas fa-eye", label: "Seen?", color: "bg-gray-700" },
  ];

  // Background image rotation effect
  useEffect(() => {
    if (movieData.images && movieData.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % movieData.images.length
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [movieData.images]);

  // ✅ FIXED: Function to get synopsis with multiple fallbacks
  const getSynopsis = () => {
    // Log the storyline structure for debugging
    console.log("Storyline data:", movieData.storyline);

    if (!movieData.storyline) {
      return "No synopsis available.";
    }

    // Try multiple possible property names
    const storyline = movieData.storyline as any;

    return (
      storyline.story ||
      storyline.description ||
      storyline.plot ||
      storyline.summary ||
      storyline.synopsis ||
      storyline.overview ||
      (typeof storyline === "string" ? storyline : null) ||
      "Synopsis not available for this movie."
    );
  };

  // ✅ FIXED: Function to get movie title with fallbacks
  const getMovieTitle = () => {
    if (!movieData.storyline) return "Loading...";

    const storyline = movieData.storyline as any;

    return (
      storyline.title ||
      storyline.name ||
      storyline.originalTitle ||
      "Movie Title"
    );
  };

  // ✅ FIXED: Function to get genres safely
  const getGenres = () => {
    if (!movieData.storyline) return "Family/Comedy";

    const storyline = movieData.storyline as any;

    if (Array.isArray(storyline.genres) && storyline.genres.length > 0) {
      return storyline.genres.join(" / ");
    }

    return storyline.genre || "Family/Comedy";
  };

  return (
    <div className="bg-gradient-to-b from-[#110c25]/90 via-[#0b0818]/95 to-[#0b0818] text-white p-6">
      <div className="w-full mx-auto">
        <div className="flex flex-col w-full">
          {/* Pass movieData.videos directly */}
          <VideoPlayer Videos={movieData.videos || []} />

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
              <div className="flex space-x-8 border-b border-gray-700 pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 transition-colors ${
                      activeTab === tab.id
                        ? "text-white border-b-2 border-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex space-x-8">
                <div className="flex-1 space-y-6">
                  {activeTab === "Info" && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Streaming Services
                        </h3>
                        <div className="flex space-x-4">
                          {streamingServices.map((service, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center"
                            >
                              <div
                                className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mb-2 relative`}
                              >
                                {service.isIcon ? (
                                  <i
                                    className={`${service.icon} text-white`}
                                  ></i>
                                ) : (
                                  <span className="text-white font-bold text-xs">
                                    {service.icon}
                                  </span>
                                )}
                                {service.badge && (
                                  <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-1 rounded">
                                    {service.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">
                                {service.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h1 className="text-4xl font-bold mb-2">
                            {getMovieTitle()}{" "}
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-lg">
                              13+
                            </span>
                          </h1>
                          <p className="text-gray-400">
                            2020 • {getGenres()} • 1h 47m
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">
                            Available Languages:
                          </h4>
                          <div className="flex space-x-3">
                            {languages.map((lang, index) => (
                              <span
                                key={index}
                                className="bg-gray-700 px-3 py-1 rounded text-sm"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-8">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                                IMDb
                              </span>
                              <span className="text-3xl font-bold">
                                {movieData.ratings?.imdbScore?.rating || "N/A"}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              {movieData.ratings?.imdbScore?.totalVotes
                                ? `${movieData.ratings.imdbScore.totalVotes} votes`
                                : "IMDb Rating"}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <i className="fas fa-play text-red-500"></i>
                              <span className="text-3xl font-bold">
                                {movieData.ratings?.metascore?.score || "96%"}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              Way2watch Rating
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "Images" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Movie Images
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {movieData.images && movieData.images.length > 0 ? (
                          movieData.images.map((image, index) => (
                            <img
                              key={index}
                              src={image.src}
                              alt={image.alt || `Movie image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1489599511985-c1b6c27e3e1b?w=400&h=300&fit=crop";
                              }}
                            />
                          ))
                        ) : (
                          <p className="text-gray-400 col-span-2">
                            No images available
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "Reviews" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Reviews</h3>
                      <div className="space-y-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-yellow-400">★★★★☆</span>
                            <span className="text-gray-300 font-medium">
                              Great Movie!
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            This movie exceeded my expectations. The storyline
                            was engaging and the performances were outstanding.
                          </p>
                        </div>
                        <p className="text-gray-500 text-sm">
                          More reviews coming soon...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-4 space-y-8">
              <div className="text-right">
                <p className="text-gray-400">
                  Language:
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="text-white bg-transparent ml-2 border-none outline-none"
                  >
                    <option value="Tamil" className="bg-gray-800">
                      Tamil
                    </option>
                    <option value="English" className="bg-gray-800">
                      English
                    </option>
                    <option value="Hindi" className="bg-gray-800">
                      Hindi
                    </option>
                    <option value="Telugu" className="bg-gray-800">
                      Telugu
                    </option>
                  </select>
                  <i className="fas fa-chevron-down ml-1"></i>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="flex space-x-4">
                  {actions.map((action) => (
                    <button
                      key={action.id}
                      className="flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <div
                        className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center transition-colors`}
                      >
                        <i className={action.icon}></i>
                      </div>
                      <span className="text-xs">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Cast & Crew</h3>
                  {movieData.cast && movieData.cast.length > 4 && (
                    <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                      View {movieData.cast.length - 4}+ more
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {movieData.cast && movieData.cast.length > 0 ? (
                    movieData.cast.slice(0, 4).map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={
                            member.imageUrl ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                          }
                          alt={member.actorName}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face";
                          }}
                        />
                        <div>
                          <p className="text-gray-400 text-xs">
                            {member.characterName || "Character"}
                          </p>
                          <p className="text-white text-sm font-medium">
                            {member.actorName || "Actor"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Cast information not available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ FIXED: Synopsis section with proper data handling */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
          <p className="text-gray-400 leading-relaxed max-w-4xl">
            {getSynopsis()}
          </p>
        </div>
      </div>
    </div>
  );
};

export const MoviePage = () => {
  const [menu, setMenu] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState<ApiMovieResponse["data"]>({
    cast: [],
    images: [],
    ratings: {
      imdbScore: {
        rating: "",
        totalVotes: "",
        fullRating: "",
      },
      metascore: {
        score: "",
        backgroundColor: "",
      },
    },
    storyline: { tagline: "", story: "", genres: [""], keywords: [""] },
    videos: [],
    scrapedAt: "",
    url: "",
  });

  const menuHandler = () => {
    setMenu(!menu);
  };

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const response: MovieResponse = await getMovieData(id);
          if (response.success) {
            console.log("Fetched movieData:", response.data);
            setMovieData(response.data);
          }
        } catch (error) {
          console.error("Error fetching movie data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  // Background image rotation effect
  useEffect(() => {
    if (movieData.images && movieData.images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % movieData.images.length
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [movieData.images]);

  // Get current background image safely
  const currentBackgroundImage =
    movieData.images && movieData.images.length > 0
      ? movieData.images[currentImageIndex]?.src || ""
      : "";

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading movie details...</div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 h-full w-full bg-cover bg-center bg-no-repeat transition-all duration-200 ease-in-out"
        style={{
          backgroundImage: `url("${currentBackgroundImage}")`,
        }}
      />

      <motion.section
        initial={{ marginLeft: 0 }}
        animate={{
          marginLeft: menu ? "280px" : "0px",
          width: menu ? "calc(100% - 280px)" : "100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0b0818] via-[#0b0818]/50 to-transparent z-20"></div>

        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0b0818] via-[#0b0818]/50 to-transparent z-20"></div>

        <div className="min-h-screen relative z-10">
          <NavBar menuHandler={menuHandler} menu={menu} />
          <Menu menu={menu} />
          <div className="w-[1280px] mt-9 mx-auto">
            <MovieDetails movieData={movieData} />
          </div>
        </div>
      </motion.section>
    </>
  );
};
