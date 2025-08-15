/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { VideoPlayer } from "./MovieVideo";
import { CommentSection, type commentType } from "./CommentSection";
import { MdDeleteForever } from "react-icons/md";
import type { MovieCommentResponse } from "../services/user.service";
import { Link } from "react-router-dom";
import {
  type MovieApiResponse,
  getMovieReviewsHandler,
  submitCommentHandler,
  deleteCommentHandler,
  getSimilarMovies,
  type SimilarMoviesResponse,
} from "../services/movie.service";
import { Heart } from "lucide-react";
import { addToWatchList, RemoveFromWatchlist } from "../services/user.service";
import { toast } from "react-toastify";

export const SimilarMoviesComponent = ({
  movie,
}: {
  movie: SimilarMoviesResponse["similarMovies"][0]["data"];
}) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const likeHandler = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return;
    }
    
    if (!isLiked) {
      setIsLiked(true);

      const response = await addToWatchList(token, {
        imdbId: movie.imdbID,
        title: movie.Title,
        poster_path: movie.Poster,
        release_date: movie.Year,
        vote_average: movie.imdbRating,
      });
      
      if (response.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      setIsLiked(false);
      const response = await RemoveFromWatchlist(token, {
        imdbId: movie.imdbID,
      });
      
      if (response.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  return (
    <div className="relative rounded-2xl group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <Link to={`/movie/${movie?.imdbID}/${movie.Title}`}>
        <div className="relative overflow-hidden rounded-2xl">
          <img
            className="w-full h-[300px] sm:h-[350px] lg:h-[400px] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
            src={movie.Poster}
            alt={movie.Title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h4 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-1 line-clamp-2">
              {movie.Title}
            </h4>
          </div>
        </div>
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full border border-green-400 text-xs sm:text-sm font-semibold">
          <span>{movie.imdbRating}</span>
        </div>
      </Link>
      <div className="absolute top-3 right-3">
        <div
          onClick={() => likeHandler()}
          className="p-1.5 sm:p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-300"
        >
          <Heart
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-white hover:text-red-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export const MovieDetails = ({
  movieData,
}: {
  movieData: MovieApiResponse;
}) => {
  const [activeTab, setActiveTab] = useState("Info");
  const [reviews, setReview] = useState<MovieCommentResponse[]>([]);
  const [SimilarMovies, setSimilarMovies] = useState<
    SimilarMoviesResponse["similarMovies"]
  >([]);
  const [loading, setLoading] = useState(false);
  const imdbId = movieData["imdb_id"];
  const [similarLoading, setSimilarLoading] = useState(true);

  const getSimilarMoviesHandler = async () => {
    try {
      const response = await getSimilarMovies(movieData.data.title);
      
      console.log("Response", response);
      if (response.success) {
        const validMovies = response.similarMovies.filter(movie => 
          movie.success && movie.data && movie.data.imdbID && movie.data.Title
        );
        
        setSimilarMovies(validMovies);
      }
      setSimilarLoading(false);
    } catch (error) {
      console.log("Error has been occurred", error);
      setSimilarLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Reviews" && imdbId) {
      fetchMovieComments();
    }
    getSimilarMoviesHandler();
  }, [activeTab, imdbId]);

  const fetchMovieComments = async () => {
    setLoading(true);
    try {
      const response = await getMovieReviewsHandler({ imdb_id: imdbId });
      if (response?.success) {
        setReview(response.data);
      } else {
        setReview([]);
        toast.error("Failed to load movie reviews", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error fetching movie reviews:", error);
      setReview([]);
      toast.error("Something went wrong while loading reviews", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSaveReviewhandler = async ({
    imdb_id,
    title,
    comment,
    rating,
    userPhotoURL,
    userDisplayName,
  }: commentType) => {
    const newReview = {
      movieTitle: movieData["data"]["title"],
      poster: movieData["data"]["poster"],
      imdb_id: imdb_id,
      title: title,
      comment: comment,
      rating: rating,
      userPhotoURL: userPhotoURL,
      userDisplayName,
    };

    setReview([...reviews, newReview]);

    if (!(!comment.trim() || !title.trim() || rating === 0)) {
      const token = localStorage.getItem("authToken") || "";
      const response = await submitCommentHandler({
        data: {
          movieTitle: movieData["data"]["title"],
          poster: movieData["data"]["poster"],
          imdb_id: imdb_id,
          title: title,
          comment: comment,
          rating: rating,
          userPhotoURL: userPhotoURL,
          userDisplayName,
        },
        token,
      });

      if (response?.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setReview(reviews.filter((r) => r !== newReview));
        toast.error("Something went wrong", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };
   const [isLiked, setIsLiked] = useState(false);

 const likeHandler = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return;
    }
    if (!isLiked) {
      setIsLiked(true);

      const response = await addToWatchList(token, {
        imdbId: movieData.imdb_id,
        title: movieData.data.title,
        poster_path: movieData.data.poster,
        release_date: movieData.data.imdbId,
        vote_average: movieData.data.ratings.imdbScore.rating,
      });
      if (response.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      setIsLiked(false);
      const response = await RemoveFromWatchlist(token, {
        imdbId: movieData.imdb_id,
      });
      if (response.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };
  const onDeleteReviewHandler = async (imdb_id: string) => {
    const originalReviews = [...reviews];
    setReview(reviews.filter((review) => review.imdb_id !== imdb_id));

    const token = localStorage.getItem("authToken") || "";
    const response = await deleteCommentHandler({
      imdb_id,
      token,
    });

    if (response?.success) {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setReview(originalReviews);
      toast.error("Failed to delete review", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

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

  const actions = [
    { id: "share", icon: "fas fa-share", label: "Share", color: "bg-gray-700" },
    {
      id: "watchlist",
      icon: "fas fa-bookmark",
      label: "Watchlist",
      color: "bg-gray-700",
    },
    { id: "seen", icon: "fas fa-eye", label: "Seen?", color: "bg-gray-700" },
  ];

  return (
    <div className="bg-gradient-to-b from-[#110c25]/90 via-[#0b0818]/95 to-[#0b0818] text-white min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <VideoPlayer Videos={movieData["data"].videoSources || []} />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
                            <div className="flex space-x-4 sm:space-x-8 border-b border-gray-700 pb-4 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                      activeTab === tab.id
                        ? "text-white border-b-2 border-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {activeTab === "Info" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    
                    <div className="lg:col-span-2 space-y-6">
                      
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                            {movieData["data"].title}
                          </h1>
                          <p className="bg-yellow-500 font-bold text-black px-2 py-1 rounded text-sm sm:text-lg flex-shrink-0">
                            {movieData["data"].Rated}
                          </p>
                        </div>

                        <p className="text-gray-400 text-sm sm:text-base">
                          {movieData["data"].Released} • {movieData["data"].genre} • {movieData["data"].Runtime}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">
                          Available Languages:
                        </h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <span className="bg-gray-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">
                            {movieData["data"].Language}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8">
                        {movieData["data"].rating.map((rating, index) => {
                          let logoSrc = "";
                          if (rating.Source === "Internet Movie Database") {
                            logoSrc = "/images/logo/imdb.png";
                          } else if (rating.Source === "Rotten Tomatoes") {
                            logoSrc = "/images/logo/rotten.png";
                          } else if (rating.Source === "Metacritic") {
                            logoSrc = "/images/logo/metacritic.png";
                          }

                          return (
                            <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                              <img
                                src={logoSrc}
                                alt={rating.Source}
                                className="w-6 h-5 sm:w-8 sm:h-7"
                              />
                              <span className="text-sm sm:text-base">{rating.Value}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="lg:hidden">
                        <h3 className="text-base sm:text-lg font-semibold mb-4">
                          Streaming Services
                        </h3>
                        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2">
                          {streamingServices.map((service, index) => (
                            <div key={index} className="flex flex-col items-center flex-shrink-0">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${service.color} rounded-full flex items-center justify-center mb-2 relative`}>
                                {service.isIcon ? (
                                  <i className={`${service.icon} text-white text-sm sm:text-base`}></i>
                                ) : (
                                  <span className="text-white font-bold text-xs">{service.icon}</span>
                                )}
                                {service.badge && (
                                  <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-1 rounded">
                                    {service.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">{service.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                    <div>
                        <h3 className="text-base font-semibold mb-4">Actions</h3>
                        <div className="flex max-lg:gap-4 gap-3">
                          {actions.map((action) => (
                            <button
                              onClick={action.label==='Watchlist'?likeHandler:()=>{return }}
                              key={action.id}
                              className="flex flex-col lg:flex-row items-center lg:space-x-3 space-y-2 lg:space-y-0 text-gray-400 hover:text-white transition-colors p-2 lg:p-3 rounded-lg hover:bg-gray-800/50"
                            >
                              <div className={`w-8 h-8 lg:w-10 lg:h-10 ${action.color} rounded-full flex items-center justify-center`}>
                                <i className={`${action.icon} text-sm`}></i>
                              </div>
                              <span className="text-xs lg:text-sm">{action.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cast & Crew */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-base font-semibold">Cast & Crew</h3>
                          {movieData["data"].cast && movieData["data"].cast.length > 4 && (
                            <button className="text-blue-400 text-xs hover:text-blue-300 transition-colors">
                              View {movieData["data"].cast.length - 4}+ more
                            </button>
                          )}
                        </div>
                        <div className="space-y-6">
                          {movieData["data"].cast && movieData["data"].cast.length > 0 ? (
                            movieData["data"].cast.slice(0, 4).map((member, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <img
                                  src={member.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"}
                                  alt={member.actorName}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face";
                                  }}
                                />
                                <div className="min-w-0">
                                  <p className="text-gray-400 text-xs truncate">{member.characterName || "Character"}</p>
                                  <p className="text-white text-sm font-medium truncate">{member.actorName || "Actor"}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-xs">Cast information not available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "Images" && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Movie Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {movieData["data"].images && movieData["data"].images.length > 0 ? (
                        movieData["data"].images.map((image, index) => (
                          <img
                            key={index}
            src={image.src.replace(/_V1_.*\..*jpg$/, "_V1_.jpg")}
                            alt={image.alt || `Movie image ${index + 1}`}
                            className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1489599511985-c1b6c27e3e1b?w=400&h=300&fit=crop";
                            }}
                          />
                        ))
                      ) : (
                        <p className="text-gray-400 col-span-full text-sm sm:text-base text-center py-12">
                          No images available
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "Reviews" && (
                  <div>
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white"></div>
                        <span className="ml-3 text-gray-400 text-sm sm:text-base">Loading reviews...</span>
                      </div>
                    ) : (
                      <>
                        <CommentSection
                          onHandler={onSaveReviewhandler}
                          imdb_id={imdbId}
                          userReview={reviews.find((review) => review.imdb_id === imdbId)}
                        />
                        <div className="flex gap-3 justify-center flex-col max-sm:w-[420px] max-md:w-[520px] max-lg:w-[680px] max-xl:w-[960px] sm:space-y-6 mt-6 sm:mt-8">
                          {reviews.map((review: MovieCommentResponse, idx) => (
                            <Link key={idx} to={`/profile/${review.userId}/${review.userDisplayName}`}>
                              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600/50 group relative">
                                <div
                                  onClick={() => onDeleteReviewHandler(movieData["imdb_id"])}
                                  className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                                  title="Delete Review"
                                >
                                  <MdDeleteForever className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>

                                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                  <div className="relative flex-shrink-0">
                                    <img
                                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-600/50 group-hover:border-gray-500/70 transition-colors duration-300"
                                      src={review.userPhotoURL || "/default-avatar.png"}
                                      alt={`${review.userDisplayName}'s avatar`}
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                  </div>
                                  <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                        <h4 className="font-semibold text-white text-base sm:text-lg">
                                          {review.userDisplayName}
                                        </h4>
                                        <span className="text-gray-400 text-xs sm:text-sm">
                                          @{review.userDisplayName.toLowerCase().replace(/\s+/g, "")}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <span
                                            key={i}
                                            className={`text-base sm:text-lg transition-colors duration-200 ${
                                              i < review.rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-600"
                                            }`}
                                          >
                                            ★
                                          </span>
                                        ))}
                                      </div>
                                      <span className="text-xs sm:text-sm font-medium text-gray-300">
                                        {review.rating}/5
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="ml-10 sm:ml-16">
                                  {review.title && (
                                    <h5 className="font-medium text-gray-200 mb-2 sm:mb-3 text-sm sm:text-lg leading-relaxed">
                                      "{review.title}"
                                    </h5>
                                  )}
                                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                                    {review.comment}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}

                          {!loading && reviews.length === 0 && (
                            <div className="text-center py-12">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">No reviews yet</h3>
                              <p className="text-gray-500 text-sm sm:text-base">Be the first to share your thoughts!</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="max-w-7xl mx-auto mt-8 sm:mt-12 pt-6 sm:pt-8 border-y pb-6 border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Synopsis</h3>
          <p className="text-gray-400 leading-relaxed max-w-none lg:max-w-4xl text-sm sm:text-base">
            {movieData["data"].storyLine}
          </p>
        </div>

        {/* Similar Movies */}
        <div className="max-w-7xl mx-auto mt-8 sm:mt-12">
          <h3 className="text-lg sm:text-xl font-semibold mb-6">Similar Movies</h3>
          {similarLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="text-white ml-3">Loading similar movies...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {SimilarMovies.length > 0 ? (
                SimilarMovies.map((movie, index) => (
                  <SimilarMoviesComponent key={index} movie={movie.data} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No similar movies found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
