import { useEffect, useState } from "react";
import { getTop10UsersHandler } from "../services/user.service";

interface ApiUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  createdAt: string | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    users: ApiUserProfile[];
    totalUsers: number;
  };
}

const Avatar = ({ user, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isActive ? "scale-100 opacity-100" : "scale-90 opacity-70"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className="group rounded-full w-[278px] h-[268px] object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
        src={user.image}
        alt={user.name}
      />

      {isHovered && (
        <div className="absolute z-50 px-3 py-2 text-white bg-gray-900 rounded-lg shadow-xl border border-gray-700 whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {user.name}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AvatarExamples = () => {
  const [users, setUsers] = useState<
    Array<{ id: string; name: string; image: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const limit = 10;
      const token = localStorage.getItem("authToken") || "";
      const response = await getTop10UsersHandler({ limit, token });

      if (response?.success) {
        const mappedUsers = response.data.users.map((user: ApiUserProfile) => ({
          id: user.uid,
          name: user.displayName,
          image: user.photoURL,
        }));
        setUsers(mappedUsers);
      } else {
        setUsers([]);
        setError("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setError("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= users.length ? 0 : prevIndex + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, users.length - itemsPerPage)
        : Math.max(0, prevIndex - itemsPerPage)
    );
  };

  const visibleUsers = users.slice(currentIndex, currentIndex + itemsPerPage);

  // Loading state
  if (loading) {
    return (
      <div className="p-1">
        <h2 className="text-white text-[48px] font-semibold px-9">Users</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-xl">Loading users...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-1">
        <h2 className="text-white text-[48px] font-semibold px-9">Users</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <div className="p-1">
        <h2 className="text-white text-[48px] font-semibold px-9">Users</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-400 text-xl">No users found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1">
      <div>
        <h2 className="text-white text-[48px] font-semibold px-9">Users</h2>

        <div className="relative mx-auto mt-9 w-[1200px]">
          <button
            onClick={prevSlide}
            className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border border-gray-600"
            disabled={currentIndex === 0}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex justify-center gap-8 transition-all duration-500 ease-in-out">
            {visibleUsers.map((user, index) => (
              <Avatar
                key={user.id}
                user={user}
                isActive={index === 1 || index === 2}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 z-10 bg-gray-800/80 hover:bg-gray-700 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border border-gray-600"
            disabled={currentIndex + itemsPerPage >= users.length}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerPage)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / itemsPerPage) === index
                      ? "bg-blue-500 scale-125"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              )
            )}
          </div>

          <div className="text-center mt-4">
            <span className="text-gray-400 text-sm">
              Showing {currentIndex + 1}-
              {Math.min(currentIndex + itemsPerPage, users.length)} of{" "}
              {users.length} users
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
