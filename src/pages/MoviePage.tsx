/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { NavBar } from "../components/NavBar";
import { Menu } from "../components/Menu";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieData,
  type ApiMovieResponse,
  type MovieResponse,
  type MovieVideo,
} from "../services/movie.service";

import { useState } from "react";

export const VideoPlayer = ({ Videos }: { Videos: MovieVideo[] }) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const currentVideo =
    Videos && Videos.length > 0 ? Videos[selectedVideoIndex] : null;

  const handleVideoError = (e: any) => {
    console.error("Video loading error:", e);
    setIsLoading(false);
    setHasError(true);
  };

  const handleVideoSelect = (index: number) => {
    setSelectedVideoIndex(index);
    setIsLoading(true);
    setHasError(false);
  };

  if (!Videos || Videos.length === 0) {
    return (
      <section className="flex flex-col justify-center items-center px-4 space-y-4">
        <div className="w-full h-[550px] aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center bg-gray-800">
          <p className="text-gray-400">No videos available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center px-4 space-y-4">
      <div className="w-full h-[550px] aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-700 relative bg-black">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-20">
            <div className="text-center">
              <p className="text-red-400 mb-2">Failed to load video</p>
              <p className="text-gray-400 text-sm mb-4">
                The video source may be expired or unavailable
              </p>
              <button
                onClick={() => handleVideoSelect(selectedVideoIndex)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {currentVideo && (
          <video
            key={`${currentVideo.src}-${selectedVideoIndex}`} // Better key for re-rendering
            className="w-full h-full object-contain"
            src={currentVideo.src} // Use src directly instead of source element
            poster={currentVideo.poster || undefined}
            controls={true} // Force controls to always show
            autoPlay={false} // Set to false to avoid autoplay issues
            muted={currentVideo.muted || false}
            loop={currentVideo.loop || false}
            preload="metadata"
            playsInline={true} // Important for mobile
            crossOrigin="anonymous" // May help with CORS
            onLoadStart={() => {
              console.log("Video load started");
              setIsLoading(true);
            }}
            onLoadedMetadata={() => {
              console.log("Video metadata loaded");
              setIsLoading(false);
            }}
            onLoadedData={() => {
              console.log("Video data loaded");
              setIsLoading(false);
            }}
            onCanPlay={() => {
              console.log("Video can play");
              setIsLoading(false);
            }}
            onError={handleVideoError}
            onPlay={() => console.log("Video started playing")}
            onPause={() => console.log("Video paused")}
          >
            {/* Fallback source element */}
            <source
              src={currentVideo.src}
              type={currentVideo.type || "video/mp4"}
            />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Always show video info for debugging */}
      {currentVideo && (
        <div className="text-center text-sm text-gray-400 mt-2 bg-gray-800 p-3 rounded-lg">
          <p className="mb-1">
            Video {selectedVideoIndex + 1} of {Videos.length}
          </p>
          {currentVideo.type && (
            <p className="mb-1">Format: {currentVideo.type}</p>
          )}
          {currentVideo.width && currentVideo.height && (
            <p className="mb-1">
              Resolution: {currentVideo.width}x{currentVideo.height}
            </p>
          )}
          <p className="text-xs text-gray-500 break-all">
            Source: {currentVideo.src.substring(0, 100)}...
          </p>
          <div className="flex gap-2 justify-center mt-2 text-xs">
            <span
              className={`px-2 py-1 rounded ${
                currentVideo.controls ? "bg-green-600" : "bg-red-600"
              }`}
            >
              Controls: {currentVideo.controls ? "On" : "Off"}
            </span>
            <span
              className={`px-2 py-1 rounded ${
                currentVideo.autoplay ? "bg-green-600" : "bg-red-600"
              }`}
            >
              Autoplay: {currentVideo.autoplay ? "On" : "Off"}
            </span>
          </div>
        </div>
      )}

      {/* Video Selection Buttons - Always show if multiple videos */}
      {Videos.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {Videos.map((video, index) => (
            <button
              key={video.id || index}
              onClick={() => handleVideoSelect(index)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedVideoIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Video {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Manual Play Button as backup */}
      <button
        onClick={() => {
          const videoElement = document.querySelector("video");
          if (videoElement) {
            videoElement.play().catch(console.error);
          }
        }}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
        Force Play Video
      </button>
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

  // const languages = ["தமிழ்", "English", "తెలుగు", "हिन्दी"];

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

  return (
    <div className="bg-gradient-to-b from-[#110c25]/90 via-[#0b0818]/95 to-[#0b0818] text-white p-6">
      <div className="w-full mx-auto">
        <div className="flex flex-col w-full">
          <VideoPlayer Videos={movieData.videoSources || []} />

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
                          <div className=" flex gap-3 items-center">
                            {" "}
                            <h1 className="text-4xl font-bold mb-2">
                              {movieData.title}
                            </h1>
                            <p
                              className="bg-yellow-500 font-bold
                             text-black px-2   py-1 rounded
                             text-lg"
                            >
                              {movieData.Rated}
                            </p>
                          </div>

                          <p className="text-gray-400">
                            {movieData.Released} • {movieData.genre} •{" "}
                            {movieData.Runtime}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">
                            Available Languages:
                          </h4>
                          <div className="flex space-x-3">
                            <span className="bg-gray-700 px-3 py-1 rounded text-sm">
                              {movieData.Language}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-8">
                          {movieData.rating.map(
                            (
                              rating: { Source: string; Value: string },
                              index: number
                            ) => {
                              let logoSrc = "";

                              if (rating.Source === "Internet Movie Database") {
                                logoSrc = "/images/logo/imdb.png";
                              } else if (rating.Source === "Rotten Tomatoes") {
                                logoSrc = "/images/logo/rotten.png";
                              } else if (rating.Source === "Metacritic") {
                                logoSrc = "/images/logo/metacritic.png";
                              }

                              return (
                                <div
                                  key={index}
                                  className="flex items-center space-x-3"
                                >
                                  <img
                                    src={logoSrc}
                                    alt={rating.Source}
                                    className="w-8 h-7"
                                  />
                                  <span>{rating.Value}</span>
                                </div>
                              );
                            }
                          )}
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

        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
          <p className="text-gray-400 leading-relaxed max-w-4xl">
            {movieData.storyLine}
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
    Awards: "",
    Director: "",
    Country: "",
    Rated: "",
    Runtime: "",
    Released: "",
    genre: "",
    title: "",
    Language: "",
    rating: [{ Source: "", Value: "" }],
    storyLine: "",
    BoxOffice: "",
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
    videoSources: [
      {
        src: "",
        type: "",
        poster: "",
        className: "",
        id: "",
        preload: "",
        controls: false,
        autoplay: false,
        muted: false,
        loop: false,
        width: 0,
        height: 0,
      },
    ],
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
            console.log("Fetched movieData:", response.data.Rated);
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

  const currentBackgroundImage =
    movieData.images && movieData.images.length > 0
      ? (movieData.images[currentImageIndex]?.src || "").replace(
          /_V1_.*\.jpg$/,
          "_V1_.jpg"
        )
      : "";

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
