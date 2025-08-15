import { useState, useEffect } from "react";
import { MoreHorizontal, User } from "lucide-react";
import {
  type UserFollowData,

  unfollowUser,
} from "../services/user.service";

interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string;
  bio?: string;
}

const UserCard = ({ users }: { users: UserProfile }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const unFollowHandler = async () => {
    try {
      const token = localStorage.getItem("authToken") || "";
      const response = await unfollowUser(users.uid, token);
      if (response.success) {
        window.location.reload();
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  return (
    <div className="group relative rounded-2xl cursor-pointer transform transition-all duration-300 hover:z-10">
      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-800/50 p-4">
        <div className="flex flex-col items-center text-center">
          {!imageLoaded && (
            <div className="w-20 h-20 bg-gray-700 animate-pulse rounded-full flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 top-0 right-0 absolute bg-gray-700/80 backdrop-blur-sm text-white rounded-full hover:bg-gray-700 
                  transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <img
            className={`w-20 h-20 object- rounded-full mb-3 transition-transform duration-300 group-hover:scale-110
                 border-2 border-gray-600 ${!imageLoaded ? "hidden" : "block"}`}
            src={users.photoURL || ""}
            alt={`${users.displayName} profile`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />

          <div className="w-full">
            <h4 className="text-white font-bold text-lg mb-1 truncate">
              {users.displayName}
            </h4>

            {users.bio && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {users.bio}
              </p>
            )}

            <p className="text-gray-500 text-xs mb-4 truncate">{users.email}</p>

            <div className="relative">
              {showMenu && (
                <div
                  className=" mt-1 bg-gray-800 border border-gray-700 rounded-lg
                   shadow-lg z-50 min-w-[120px]"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      unFollowHandler();
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors text-sm"
                  >
                    Unfollow
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      window.location.href = `/profile/${users.uid}/${users.displayName}`;
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors text-sm"
                  >
                    View Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NetworkSection = ({ followers, following }: {
  followers:{count:number,profiles:{displayName:string,email:string,photoURL:string,uid:string}[]}
  following:{count:number,profiles:{displayName:string,email:string,photoURL:string,uid:string}[]}

}) => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const [loading, setLoading] = useState(true);

  const [networkData, setNetworkData] = useState<UserFollowData>({
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
  });
  // const currentUserId = useParams();
  useEffect(() => {
    // const fetchNetworkData = async () => {
    //   if (!currentUserId.userid) {
    //     setError("User ID not found");
    //     setLoading(false);
    //     return;
    //   }

    //   try {
    //     setLoading(true);
    //     setError(null);

    //     const token = localStorage.getItem("authToken");
    //     if (!token) {
    //       setError("Authentication token not found");
    //       setLoading(false);
    //       return;
    //     }

    //     const [followersResponse, followingResponse] = await Promise.all([
    //       getUserFollowers(currentUserId.userid, token),
    //       getUserFollowing(currentUserId.userid, token),
    //     ]);

    //     const followersData = (followersResponse.data?.followers || []).map(
    //       (user) => ({
    //         uid: user.uid,
    //         displayName: user.displayName || "Unknown User",
    //         photoURL: user.photoURL || "",
    //         email: user.email || "",
    //         bio: user.bio || undefined,
    //       })
    //     );

    //     const followingData = (followingResponse.data?.following || []).map(
    //       (user) => ({
    //         uid: user.uid,
    //         displayName: user.displayName || "Unknown User",
    //         photoURL: user.photoURL || "",
    //         email: user.email || "",
    //         bio: user.bio || undefined,
    //       })
    //     );

    //     setNetworkData({
    //       followers: followersData,
    //       following: followingData,
    //       followersCount: followersResponse.data?.followersCount || 0,
    //       followingCount: followingResponse.data?.followingCount || 0,
    //     });

    //     console.log("Network data fetched:", {
    //       followers: followersData,
    //       following: followingData,
    //       followersCount: followersResponse.data?.followersCount || 0,
    //       followingCount: followingResponse.data?.followingCount || 0,
    //     });
    //   } catch (error) {
    //     console.error("Error fetching network data:", error);
    //     setError("Failed to load network data");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    console.log(followers)
    setNetworkData({ followersCount: followers.count, followingCount: following.count, followers: followers.profiles, following: following.profiles })
    setLoading(false)
    // fetchNetworkData();
  }, []);

  const currentUsers =
    activeTab === "followers"
      ? networkData.followers || []
      : networkData.following || [];

  if (loading) {
    return (
      <div className="w-full px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-400">Loading network...</span>
        </div>
      </div>
    );
  }



  return (
    <div className="w-full px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("followers")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "followers"
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Followers ({networkData.followersCount || 0})
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "following"
                ? "bg-orange-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Following ({networkData.followingCount || 0})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {currentUsers.map((user) => (
          <UserCard key={user.uid} users={user} />
        ))}
      </div>

      {currentUsers.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-gray-400 text-lg font-medium mb-2">
            No {activeTab} yet
          </h3>
          <p className="text-gray-500 text-sm">
            {activeTab === "followers"
              ? "When people follow you, they'll appear here"
              : "Start following people to see them here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default NetworkSection;
