/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  followUser,
  getUserProfile,
  getUserWatchlist,
  isFollowingServiceHandler,

  type MovieCommentResponse,
  type UserData,
} from "../services/user.service";
import { Link, useNavigate, useParams } from "react-router-dom";
import NetworkSection from "./NetworkSection";
import { RecentActivity, RecentReviews } from "./recentMovies";
import { toast } from "react-toastify";

type WatchlistMovie = {
  imdbId: string;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: string;
  addedAt?: string;
};

type WatchlistData = {
  currentPage: number;
  totalPages: number;
  totalWatchlist: number;
  userId: string;
  watchlistMovies: WatchlistMovie[];
};

export type WatchlistResponse = {
  success: boolean;
  message: string;
  data: WatchlistData;
};

export const MovieSectionTemplate = ({
  movie,
  section,
}: {
  section: string;
  movie: WatchlistData["watchlistMovies"][0];
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
    <div className="group relative rounded-xl sm:rounded-2xl cursor-pointer
      transform transition-all duration-300 hover:z-10
      w-full max-w-sm mx-auto">
      
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl 
        shadow-lg hover:shadow-2xl transition-shadow duration-300">
        
        {!imageLoaded && (
          <div className="w-full bg-gray-800 animate-pulse 
            rounded-xl sm:rounded-2xl flex items-center justify-center
            h-[240px] xs:h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px]
            aspect-[2/3]">
            <div className="text-gray-600 text-xs sm:text-sm">Loading...</div>
          </div>
        )}

        <img
          className={`w-full object-cover transition-transform duration-300 
            group-hover:scale-110 rounded-xl sm:rounded-2xl
            h-[240px] xs:h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px]
            aspect-[2/3] ${!imageLoaded ? "hidden" : "block"}`}
          src={movie.poster_path.replace(/_V1_.*\..*jpg$/, "_V1_.jpg")}
          alt={`${movie.title} poster`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t 
          from-black/80 via-black/20 to-transparent 
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 
          rounded-xl sm:rounded-2xl" />

        <div className="absolute bottom-0 left-0 right-0 
          p-2 sm:p-3 md:p-4 
          transform translate-y-4 group-hover:translate-y-0 
          opacity-0 group-hover:opacity-100 
          transition-all duration-300">
          
          <h4 className="text-white font-bold mb-1 line-clamp-2 leading-tight
            text-sm sm:text-base md:text-lg">
            {movie.title}
          </h4>
          
          {movie.release_date && (
            <p className="text-gray-300 font-medium
              text-xs sm:text-sm">
              {getYear(movie.release_date)}
            </p>
          )}

          <Link to={`/movie/${movie.imdbId}/${movie.title}`}>
            <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 delay-100">
              
              <button className="bg-white/20 backdrop-blur-sm text-white 
                px-2 sm:px-3 py-1 rounded-full font-medium 
                hover:bg-white/30 transition-colors
                text-xs sm:text-sm">
                View Details
              </button>
              
              {section !== "watchlist" && (
                <button className="bg-orange-500/80 backdrop-blur-sm text-white 
                  px-2 sm:px-3 py-1 rounded-full font-medium 
                  hover:bg-orange-500 transition-colors
                  text-xs sm:text-sm">
                  Add to List
                </button>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Rating badge */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 
        bg-black/80 backdrop-blur-sm text-white 
        px-2 py-1 rounded-lg border border-yellow-400/50 
        text-xs sm:text-sm font-bold flex items-center gap-1 shadow-lg">
        <span className="text-yellow-400">★</span>
        <span>{formatRating(+movie.vote_average)}</span>
      </div>

      {/* Heart button */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-sm 
            hover:bg-black/80 transition-all duration-300 
            transform hover:scale-110 shadow-lg"
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
              isLiked
                ? "fill-red-500 text-red-500 scale-110"
                : "text-white hover:text-red-400"
            }`}
          />
        </button>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r 
        from-orange-500/20 to-yellow-500/20 rounded-xl sm:rounded-2xl 
        opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 blur-sm -z-10" />
    </div>
  );
};


const WatchlistSection = ({ userId }: { userId: string }) => {
  const [watchlist, setWatchlist] = useState<WatchlistResponse["data"]>({
    currentPage: 0,
    totalPages: 0,
    totalWatchlist: 0,
    userId: "",
    watchlistMovies: [],
  });

  useEffect(() => {
    const getUserWatchList = async () => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage?.getItem("authToken") || ""
          : "";
      if (!token) return;

      const response = await getUserWatchlist(token, userId);
      if (response.success) {
        setWatchlist(response.data);
      }
    };
    getUserWatchList();
  }, [userId]);

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="font-bold text-white mb-1
            text-lg sm:text-xl md:text-2xl">
            Watchlist
          </h2>
          <p className="text-gray-400 
            text-xs sm:text-sm">
            Your latest watchlist
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6
        grid-cols-2 xs:grid-cols-2 
        sm:grid-cols-3 md:grid-cols-4 
        lg:grid-cols-5 xl:grid-cols-6">
        {watchlist.watchlistMovies.map(
          (movie: WatchlistData["watchlistMovies"][0], idx: number) => {
            return (
              <MovieSectionTemplate
                section={"watchlist"}
                key={idx}
                movie={movie}
              />
            );
          }
        )}
      </div>

      {watchlist.watchlistMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center 
          py-8 sm:py-12 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full 
            flex items-center justify-center mb-3 sm:mb-4">
            <span className="text-gray-600 
              text-lg sm:text-xl md:text-2xl">🎬</span>
          </div>
          <h3 className="text-gray-400 font-medium mb-2
            text-base sm:text-lg">
            No films yet
          </h3>
          <p className="text-gray-500 
            text-sm sm:text-base">
            Start watching and rating movies to see them here
          </p>
        </div>
      )}
    </div>
  );
};

const ReviewsSection = ({
  userReviewData,
}: {
  userReviewData: UserData["data"]["reviews"];
}) => {
  const [review, setReview] = useState<UserData["data"]["reviews"]>([]);

  useEffect(() => {
    setReview(userReviewData);
  }, [userReviewData]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-400 text-sm uppercase tracking-wide">
          Recent Reviews
        </h2>
        <button className="text-gray-400 text-sm hover:text-white">MORE</button>
      </div>

      <div className="space-y-4">
        {review.map((reviewItem: MovieCommentResponse, idx: number) => {
          return (
            <div
              key={idx}
              className="flex gap-4 p-4 bg-gray-800 bg-opacity-30 rounded"
            >
              <img
                src={reviewItem.poster}
                alt={reviewItem.movieTitle}
                className="w-16 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-white text-lg font-semibold mb-1">
                  {reviewItem.movieTitle}
                </h3>
                <div className="flex text-green-500 text-xs mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < reviewItem.rating ? "★" : "☆"}</span>
                  ))}

                  <span className="text-gray-400 ml-2">
                    Watched 12 Jul 2024
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-gray-300 text-sm mb-2">
                    {reviewItem.title}
                  </p>
                  <p className="text-gray-300 text-sm mb-2">
                    {reviewItem.comment}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const ProfileSection = ({ recentReviews }: { recentReviews: MovieCommentResponse[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 
      px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
        
        {/* Favorite Films */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-gray-400 uppercase tracking-wide
              text-xs sm:text-sm">
              Favorite Films
            </h2>
          </div>
          <p className="text-gray-400 
            text-sm sm:text-base">
            Don't forget to select your{" "}
            <span className="text-orange-500">favorite films</span>!
          </p>
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>

        {/* Recent Reviews */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-gray-400 uppercase tracking-wide
              text-xs sm:text-sm">
              Recent Reviews
            </h2>
            <button className="text-gray-400 hover:text-white
              text-xs sm:text-sm">
              MORE
            </button>
          </div>
          <RecentReviews reviews={recentReviews} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        
        {/* Diary */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-gray-400 uppercase tracking-wide
              text-xs sm:text-sm">
              Diary
            </h2>
            <button className="text-gray-400 hover:text-white
              text-xs sm:text-sm">
              1
            </button>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 
            p-2 sm:p-3 bg-gray-800 bg-opacity-30 rounded">
            {recentReviews.map((review) => {
              return (
                <div key={review.imdb_id} className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="text-gray-400 
                      text-xs sm:text-sm">
                      {review.timestamp?.split(',')[1]}
                    </div>
                    <div className="text-gray-400 
                      text-xs sm:text-sm">
                      JUL
                    </div>
                  </div>
                  <span className="text-gray-300 
                    text-xs sm:text-sm">
                    {review.movieTitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ratings */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-gray-400 uppercase tracking-wide
              text-xs sm:text-sm">
              Ratings
            </h2>
            <button className="text-gray-400 hover:text-white
              text-xs sm:text-sm">
              1
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-green-500 
                text-sm sm:text-base">★</span>
              <div className="flex-1 mx-2 sm:mx-3 bg-gray-700 h-2 rounded">
                <div className="bg-gray-600 h-2 rounded w-full" />
              </div>
              <span className="text-green-500 
                text-sm sm:text-base">★★★★★</span>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div>
          <h2 className="text-gray-400 uppercase tracking-wide mb-3 sm:mb-4
            text-xs sm:text-sm">
            Activity
          </h2>
          <p className="text-gray-400 
            text-xs sm:text-sm">
            No recent activity
          </p>
        </div>

        {/* Upgrade Card */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 
          rounded-lg p-3 sm:p-4 md:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-white font-bold mb-1 sm:mb-2
              text-base sm:text-lg md:text-xl">
              NEED AN UPGRADE?
            </h3>
            <p className="text-gray-300 mb-2 sm:mb-3 md:mb-4
              text-xs sm:text-sm">
              Profile stats, filtering by favorite streaming services, 
              watchlist alerts and no ads!
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white 
              px-3 sm:px-4 py-1.5 sm:py-2 rounded font-medium 
              flex items-center gap-1 sm:gap-2
              text-xs sm:text-sm
              transition-colors duration-200">
              GET
              <span className="bg-green-700 px-1 sm:px-2 py-0.5 sm:py-1 
                rounded text-xs">
                PRO
              </span>
            </button>
          </div>
          <div className="absolute right-0 top-0 w-16 sm:w-20 md:w-24 h-full 
            bg-gradient-to-l from-orange-500 to-transparent opacity-20" />
        </div>
      </div>
    </div>
  );
};


const FollowButton = ({ targetId }: { targetId: string }) => {
  const [isFollow, setIsFollowed] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const token = localStorage.getItem("authToken") || "";
  const [self, setSelf] = useState<boolean>(false);

  const followHandler = async () => {
    try {
      const response = await followUser(targetId, token);
      if (response.success) {
        setIsFollowed(true);
        setLoader(false);
        window.location.reload();
      }
    } catch (error) {
      setIsFollowed(false);
      setLoader(true);
      throw error 
    }
  };

  useEffect(() => {
    const isFollowingHandler = async () => {
      setIsFollowed(false);
      try {
        const response = await isFollowingServiceHandler(token, targetId);
        if (response.success) {
          if (response.data.isSelf) {
            setLoader(false);
            setSelf(true);
          } else {
            setIsFollowed(response.data.isFollowing);
            setLoader(false);
          }
        }
      } catch (error) {
        setLoader(true);
        setIsFollowed(false);
        throw error
      }
    };
    isFollowingHandler();
  }, []);

  if (loader) {
    return (
      <div className="animate-pulse bg-gray-600 
        px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl
        text-xs sm:text-sm">
        Loading...
      </div>
    );
  }

  return (
    <>
      {!self && (
        <div className="relative">
          {!isFollow && (
            <button 
              onClick={followHandler}
              className="bg-emerald-400 hover:bg-emerald-500 
                rounded-xl cursor-pointer transition-colors
                text-white px-3 sm:px-4 py-1.5 sm:py-2
                text-xs sm:text-sm md:text-base
                font-medium shadow-lg hover:shadow-xl
                transform hover:scale-105 duration-200">
              Follow
            </button>
          )}
        </div>
      )}
    </>
  );
};

export const UserProfileHero = ({ user_userid }: { user_userid: string }) => {
  const [navigation, setNavigation] = useState("Profile");
  const navigate = useNavigate();
  
  const navigationHandler = (nav: string) => {
    setNavigation(nav);
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage?.getItem("authToken")
        : null;
    if (!token) {
      toast.error("You need to log in to view profiles", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const [user, setUser] = useState<UserData["data"]>({
    followers: {
      count: 0,
      profiles: [],
    },
    following: {
      count: 0,
      profiles: [{ displayName: '', email: '', photoURL: '', uid: '' }],
    },
    profile: {
      displayName: "",
      email: "",
      photoURL: "",
      uid: "",
    },
    reviews: [],
    stats: {
      followersCount: 0,
      followingCount: 0,
      totalReviews: 0,
      totalWatchlistItems: 0,
    },
    watchlist: [],
  });

  useEffect(() => {
    const getUser = async () => {
      const token =
        typeof window !== "undefined"
          ? window.localStorage?.getItem("authToken")
          : null;
      if (!token) return;

      const response = await getUserProfile(user_userid, token);

      if (response.success && response.data) {
        //@ts-ignore
        setUser(response.data);
      }
    };
    getUser();
  }, [user_userid]);

  const { userid } = useParams() || "";
  if (!userid) return null;

  return (
    <section className="bg-primary w-full min-h-screen 
      pb-12 sm:pb-16 md:pb-24">
      
      {/* Hero Section */}
      <div className="relative">
        <img
          className="w-full object-cover
            h-[200px] sm:h-[250px] md:h-[300px] lg:h-[340px]"
          src='https://media.gettyimages.com/id/1798302631/video/no-tv-signal-vhs-noise-glitch-screen-overlay-grunge-old-tv-background.jpg?s=640x640&k=20&c=yrNzn6bNDtn7XWeLiVMkfNg9RhFUWHfwtyDiaXS5eaI='
          alt="user-profile-hero"
        />
        
        {/* Profile Content */}
        <div className="flex flex-col lg:flex-row items-start gap-3 sm:gap-4 md:gap-6 
          px-2 sm:px-4 md:px-6 lg:px-8 
          -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20 
          relative z-10">
          
          {/* Profile Picture */}
          <img
            loading="lazy"
            className="rounded-full object-cover border-4 border-white shadow-lg
              w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 
              md:w-32 md:h-32 lg:w-48 lg:h-48 xl:w-[246px] xl:h-[246px]
              mx-auto lg:mx-0"
            src={user?.profile.photoURL || "/default-avatar.jpg"}
            alt="profile"
          />
          
          {/* Profile Info */}
          <div className="flex-1 flex flex-col lg:flex-row justify-between 
            items-center lg:items-start text-center lg:text-left
            mt-2 sm:mt-4 md:mt-6 lg:mt-20 xl:mt-[86px]
            w-full">
            
            <div className="flex flex-col gap-1 sm:gap-2 mb-3 sm:mb-4 lg:mb-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <h1 className="text-white font-bold whitespace-nowrap
                  text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                  {user?.profile.displayName}
                </h1>
                <FollowButton targetId={userid} />
              </div>
              
              <p className="text-gray-300 mb-2 sm:mb-4 md:mb-6
                text-sm sm:text-base lg:text-lg">
                It makes you forget the wonderful yesterday
              </p>
            </div>
            
            {/* Stats - Desktop */}
            <div className="hidden lg:flex gap-6 xl:gap-8">
              <div className="text-center">
                <div className="text-white font-bold
                  text-xl lg:text-2xl">
                  {user?.stats.followingCount || 0}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">
                  Following
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold
                  text-xl lg:text-2xl">
                  {user?.stats.followersCount || 0}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">
                  Followers
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats - Mobile/Tablet */}
        <div className="flex lg:hidden justify-center gap-6 sm:gap-8 
          mt-3 sm:mt-4 px-4">
          <div className="text-center">
            <div className="text-white font-bold
              text-lg sm:text-xl">
              {user?.stats.followingCount || 0}
            </div>
            <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">
              Following
            </div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold
              text-lg sm:text-xl">
              {user?.stats.followersCount || 0}
            </div>
            <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">
              Followers
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 mt-4 sm:mt-6 md:mt-8">
        <nav className="flex justify-center lg:justify-start 
          space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-8 
          px-2 sm:px-4 md:px-6 lg:px-8 
          overflow-x-auto scrollbar-hide">
          {["Profile", "Watchlist", "Reviews", "Network"].map((tab) => (
            <button
              onClick={() => navigationHandler(tab)}
              key={tab}
              className={`py-2 sm:py-3 px-1 sm:px-2 border-b-2 font-medium 
                whitespace-nowrap transition-colors duration-200
                text-xs sm:text-sm md:text-base ${
                tab === navigation
                  ? "border-orange-500 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-4 sm:mt-6 md:mt-8">
        {navigation === "Profile" && <ProfileSection recentReviews={user.reviews} />}
        {navigation === "Reviews" && <ReviewsSection userReviewData={user.reviews} />}
        {navigation === "Watchlist" && <WatchlistSection userId={userid} />}
        {navigation === "Network" && (
          <NetworkSection following={user.following} followers={user.followers} />
        )}
      </div>
    </section>
  );
};

