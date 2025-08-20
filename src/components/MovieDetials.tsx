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
import { Heart, Share, Bookmark, Eye, } from "lucide-react";
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
      toast.error("You need to log in to add movies to your watchlist.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
    <div className="relative rounded-xl sm:rounded-2xl group cursor-pointer 
      transform transition-all duration-300 hover:scale-105
      w-full max-w-sm mx-auto">
      
      <Link to={`/movie/${movie?.imdbID}/${movie.Title}`}>
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
          <img
            className="w-full object-cover transition-transform duration-300 
              group-hover:scale-110 rounded-xl sm:rounded-2xl
              h-[240px] xs:h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px]"
            src={movie.Poster}
            alt={movie.Title}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t 
            from-black/70 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-300 
            rounded-xl sm:rounded-2xl" />
          
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 
            left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 
            transform translate-y-4 group-hover:translate-y-0 
            opacity-0 group-hover:opacity-100 
            transition-all duration-300">
            <h4 className="text-white font-semibold mb-1 line-clamp-2
              text-sm sm:text-base md:text-lg">
              {movie.Title}
            </h4>
          </div>
        </div>
        
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 
          bg-black/70 backdrop-blur-sm text-white 
          px-2 sm:px-3 py-1 rounded-full border border-green-400 
          text-xs sm:text-sm font-semibold">
          <span>{movie.imdbRating}</span>
        </div>
      </Link>
      
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
        <button
          onClick={likeHandler}
          className="p-1.5 sm:p-2 rounded-full bg-black/50 backdrop-blur-sm 
            hover:bg-black/70 transition-all duration-300"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all duration-300 ${
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
  const [isLiked, setIsLiked] = useState(false);

  const getSimilarMoviesHandler = async () => {
    try {
      const response = await getSimilarMovies(movieData.data.title);
      
      if (response.success) {
        const validMovies = response.similarMovies.filter(movie => 
          movie.success && movie.data && movie.data.imdbID && movie.data.Title
        );
        
        setSimilarMovies(validMovies);
      }
      setSimilarLoading(false);
    } catch (e) {
      setSimilarLoading(false);
      throw e
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
      throw error
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

  const likeHandler = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("You need to log in to add movies to your watchlist.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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



  const actions = [
    { id: "share", icon: Share, label: "Share", color: "bg-gray-700" },
    {
      id: "watchlist",
      icon: Bookmark,
      label: "Watchlist",
      color: "bg-gray-700",
    },
    { id: "seen", icon: Eye, label: "Seen?", color: "bg-gray-700" },
  ];

  return (
    <div className="bg-gradient-to-b from-[#110c25]/90 via-[#0b0818]/95 to-[#0b0818] 
      text-white min-h-screen">
      
      <div className="w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 
        py-4 sm:py-6">
        
        {/* Video Player */}
        <div className="mb-6 sm:mb-8">
          <VideoPlayer Videos={movieData["data"].videoSources || []} />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Main Content */}
            <div className="xl:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
              
              {/* Tabs */}
              <div className="flex space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 
                border-b border-gray-700 pb-2 sm:pb-4 
                overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-1 sm:pb-2 transition-colors whitespace-nowrap 
                      text-sm sm:text-base lg:text-lg font-medium ${
                      activeTab === tab.id
                        ? "text-white border-b-2 border-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-4 sm:space-y-6">
                {activeTab === "Info" && (
                  <div className="space-y-6 sm:space-y-8">
                    
                    {/* Movie Title and Basic Info */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 
                        items-start sm:items-center">
                        <h1 className="font-bold leading-tight
                          text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                          {movieData["data"].title}
                        </h1>
                        <p className="bg-yellow-500 font-bold text-black 
                          px-2 py-1 rounded flex-shrink-0
                          text-xs sm:text-sm md:text-base">
                          {movieData["data"].Rated}
                        </p>
                      </div>

                      <p className="text-gray-400 
                        text-xs sm:text-sm md:text-base">
                        {movieData["data"].Released} • {movieData["data"].genre} • {movieData["data"].Runtime}
                      </p>
                    </div>

                    {/* Languages */}
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="font-semibold 
                        text-sm sm:text-base md:text-lg">
                        Available Languages:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gray-700 px-2 sm:px-3 py-1 rounded 
                          text-xs sm:text-sm">
                          {movieData["data"].Language}
                        </span>
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 lg:gap-8">
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
                              className="w-5 h-4 sm:w-6 sm:h-5 md:w-8 md:h-7"
                            />
                            <span className="text-xs sm:text-sm md:text-base">
                              {rating.Value}
                            </span>
                          </div>
                        );
                      })}
                    </div>


                    <div className="xl:hidden space-y-3 sm:space-y-4">
                      <h3 className="font-semibold
                        text-sm sm:text-base md:text-lg">
                        Actions
                      </h3>
                      <div className="flex gap-3 sm:gap-4">
                        {actions.map((action) => {
                          const IconComponent = action.icon;
                          return (
                            <button
                              onClick={action.label === 'Watchlist' ? likeHandler : () => {}}
                              key={action.id}
                              className="flex flex-col items-center space-y-1 sm:space-y-2 
                                text-gray-400 hover:text-white transition-colors 
                                p-2 sm:p-3 rounded-lg hover:bg-gray-800/50"
                            >
                              <div className={`w-8 h-8 sm:w-10 sm:h-10 ${action.color} 
                                rounded-full flex items-center justify-center`}>
                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <span className="text-xs sm:text-sm">
                                {action.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cast & Crew - Mobile/Tablet */}
                    <div className="xl:hidden space-y-3 sm:space-y-4">
                      <h3 className="font-semibold
                        text-sm sm:text-base md:text-lg">
                        Cast & Crew
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        {movieData["data"].cast && movieData["data"].cast.length > 0 ? (
                          movieData["data"].cast.slice(0, 4).map((member, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <img
                                src={member.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"}
                                alt={member.actorName}
                                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                                  rounded-full object-cover flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-gray-400 text-xs sm:text-sm truncate">
                                  {member.characterName || "Character"}
                                </p>
                                <p className="text-white font-medium truncate
                                  text-sm sm:text-base">
                                  {member.actorName || "Actor"}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-xs sm:text-sm">
                            Cast information not available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Images" && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="font-semibold
                      text-base sm:text-lg md:text-xl">
                      Movie Images
                    </h3>
                    <div className="grid gap-3 sm:gap-4 md:gap-6
                      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {movieData["data"].images && movieData["data"].images.length > 0 ? (
                        movieData["data"].images.map((image, index) => (
                          <img
                            key={index}
                            src={image.src.replace(/_V1_.*\..*.jpg$/, "_V1_.jpg")}
                            alt={image.alt || `Movie image ${index + 1}`}
                            className="w-full object-cover rounded-lg 
                              hover:scale-105 transition-transform duration-300
                              h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1489599511985-c1b6c27e3e1b?w=400&h=300&fit=crop";
                            }}
                          />
                        ))
                      ) : (
                        <p className="text-gray-400 col-span-full text-center py-8 sm:py-12
                          text-sm sm:text-base">
                          No images available
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "Reviews" && (
                  <div className="space-y-4 sm:space-y-6">
                    {loading ? (
                      <div className="flex items-center justify-center py-8 sm:py-12">
                        <div className="animate-spin rounded-full 
                          h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 
                          border-b-2 border-white" />
                        <span className="ml-3 text-gray-400 
                          text-sm sm:text-base">
                          Loading reviews...
                        </span>
                      </div>
                    ) : (
                      <>
                        <CommentSection
                          onHandler={onSaveReviewhandler}
                          imdb_id={imdbId}
                          userReview={reviews.find((review) => review.imdb_id === imdbId)}
                        />
                        
                        <div className="space-y-3 sm:space-y-4 md:space-y-6">
                          {reviews.map((review: MovieCommentResponse, idx) => (
                            <Link key={idx} to={`/profile/${review.userId}/${review.userDisplayName}`}>
                              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 
                                backdrop-blur-sm border border-gray-700/50 
                                p-3 sm:p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl 
                                transition-all duration-300 hover:border-gray-600/50 
                                group relative">
                                
                                <div
                                  onClick={() => onDeleteReviewHandler(movieData["imdb_id"])}
                                  className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 
                                    cursor-pointer p-1.5 sm:p-2 rounded-full 
                                    bg-red-500/10 hover:bg-red-500/20 
                                    text-red-400 hover:text-red-300 
                                    transition-all duration-200 
                                    opacity-0 group-hover:opacity-100 
                                    hover:scale-110 active:scale-95"
                                  title="Delete Review"
                                >
                                  <MdDeleteForever className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                </div>

                                <div className="flex items-start gap-2 sm:gap-3 md:gap-4 
                                  mb-2 sm:mb-3 md:mb-4">
                                  <div className="relative flex-shrink-0">
                                    <img
                                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                                        rounded-full object-cover border-2 border-gray-600/50 
                                        group-hover:border-gray-500/70 transition-colors duration-300"
                                      src={review.userPhotoURL || "/default-avatar.png"}
                                      alt={`${review.userDisplayName}'s avatar`}
                                    />
                                    <div className="absolute -bottom-1 -right-1 
                                      w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 
                                      bg-green-500 rounded-full border-2 border-gray-800" />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0 pr-4 sm:pr-6 md:pr-8">
                                    <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3">
                                        <h4 className="font-semibold text-white 
                                          text-sm sm:text-base md:text-lg">
                                          {review.userDisplayName}
                                        </h4>
                                        <span className="text-gray-400 
                                          text-xs sm:text-sm">
                                          @{review.userDisplayName.toLowerCase().replace(/\s+/g, "")}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                      <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <span
                                            key={i}
                                            className={`transition-colors duration-200
                                              text-sm sm:text-base md:text-lg ${
                                              i < review.rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-600"
                                            }`}
                                          >
                                            ★
                                          </span>
                                        ))}
                                      </div>
                                      <span className="font-medium text-gray-300
                                        text-xs sm:text-sm">
                                        {review.rating}/5
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="ml-6 sm:ml-10 md:ml-16">
                                  {review.title && (
                                    <h5 className="font-medium text-gray-200 mb-2 sm:mb-3 leading-relaxed
                                      text-sm sm:text-base md:text-lg">
                                      "{review.title}"
                                    </h5>
                                  )}
                                  <p className="text-gray-300 leading-relaxed
                                    text-xs sm:text-sm md:text-base">
                                    {review.comment}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}

                          {!loading && reviews.length === 0 && (
                            <div className="text-center py-8 sm:py-12">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 
                                mx-auto mb-3 sm:mb-4 bg-gray-800 rounded-full 
                                flex items-center justify-center">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-500" 
                                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <h3 className="font-medium text-gray-300 mb-1 sm:mb-2
                                text-sm sm:text-base md:text-lg">
                                No reviews yet
                              </h3>
                              <p className="text-gray-500 
                                text-xs sm:text-sm md:text-base">
                                Be the first to share your thoughts!
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="hidden xl:block xl:col-span-4 space-y-6">
              
           

        
              <div>
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="space-y-3">
                  {actions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        onClick={action.label === 'Watchlist' ? likeHandler : () => {}}
                        key={action.id}
                        className="flex items-center space-x-3 w-full text-gray-400 
                          hover:text-white transition-colors p-3 rounded-lg hover:bg-gray-800/50"
                      >
                        <div className={`w-10 h-10 ${action.color} rounded-full 
                          flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-sm">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cast & Crew */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Cast & Crew</h3>
                <div className="space-y-4">
                  {movieData["data"].cast && movieData["data"].cast.length > 0 ? (
                    movieData["data"].cast.slice(0, 4).map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={member.imageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"}
                          alt={member.actorName}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-gray-400 text-xs truncate">
                            {member.characterName || "Character"}
                          </p>
                          <p className="text-white text-sm font-medium truncate">
                            {member.actorName || "Actor"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">Cast information not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="max-w-7xl mx-auto mt-6 sm:mt-8 md:mt-12 
          pt-4 sm:pt-6 md:pt-8 border-t border-gray-700 pb-4 sm:pb-6">
          <h3 className="font-semibold mb-3 sm:mb-4
            text-base sm:text-lg md:text-xl">
            Synopsis
          </h3>
          <p className="text-gray-400 leading-relaxed max-w-none lg:max-w-4xl
            text-sm sm:text-base">
            {movieData["data"].storyLine}
          </p>
        </div>

        {/* Similar Movies */}
        <div className="max-w-7xl mx-auto mt-6 sm:mt-8 md:mt-12">
          <h3 className="font-semibold mb-4 sm:mb-6
            text-base sm:text-lg md:text-xl">
            Similar Movies
          </h3>
          
          {similarLoading ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="animate-spin rounded-full 
                h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-500" />
              <span className="text-white ml-3 
                text-sm sm:text-base">
                Loading similar movies...
              </span>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 md:gap-6
              grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {SimilarMovies.length > 0 ? (
                SimilarMovies.map((movie, index) => (
                  <SimilarMoviesComponent key={index} movie={movie.data} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  {localStorage.getItem("authToken") ? (
                    <p className="text-gray-400 text-sm sm:text-base">
                      No similar movies found
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm sm:text-base">
                      Please log in to view similar movies.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
