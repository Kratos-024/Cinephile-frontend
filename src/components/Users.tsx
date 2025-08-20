import { useEffect, useState } from "react";
import { getTop10UsersHandler } from "../services/user.service";
import { Link } from "react-router-dom";

export interface ApiUserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  createdAt: string ;
}



const Avatar = ({ user }: { user: ApiUserProfile }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/profile/${user.uid}/${user.displayName}`}>
      <div
        className="relative transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          className="group rounded-full object-cover cursor-pointer 
            transition-transform duration-300 hover:scale-105
            w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] 
            md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] 
            xl:w-[278px] xl:h-[268px]"
          src={user.photoURL}
          alt={user.displayName}
        />

        {isHovered && (
          <div className="absolute z-50 px-2 sm:px-3 py-1 sm:py-2 
            text-white bg-gray-900 rounded-lg shadow-xl 
            border border-gray-700 whitespace-nowrap 
            bottom-full left-1/2 transform -translate-x-1/2 mb-2
            text-xs sm:text-sm md:text-base">
            {user.displayName}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export const AvatarExamples = () => {
  const [users, setUsers] = useState<Array<ApiUserProfile>>([{
    uid: '',
    displayName: '',
    email: '',
    photoURL: '',
    bio: '',
    followersCount: 0,
    followingCount: 0,
    createdAt: '',
  }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(1);
      } else if (width < 768) {
        setItemsPerPage(2);
      } else if (width < 1024) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const limit = 10;

      const response = await getTop10UsersHandler({ limit });
      if (response?.success) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
        setError("Login");
      }
    } catch (err) {
      setUsers([]);
      setError("Error loading users");
      throw err
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  if (loading) {
    return (
      <div className="p-2 sm:p-4 md:p-6">
        <h2 className="text-white font-semibold px-4 sm:px-6 md:px-9
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Users
        </h2>
        <div className="flex justify-center items-center 
          h-48 sm:h-56 md:h-64">
          <div className="text-white 
            text-lg sm:text-xl">
            Loading users...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 md:p-6">
        <h2 className="text-white font-semibold px-4 sm:px-6 md:px-9
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Users
        </h2>
        <div className="flex justify-center items-center 
          h-48 sm:h-56 md:h-64">
          <div className="text-red-400 
            text-lg sm:text-xl">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-2 sm:p-4 md:p-6">
        <h2 className="text-white font-semibold px-4 sm:px-6 md:px-9
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Users
        </h2>
        <div className="flex justify-center items-center 
          h-48 sm:h-56 md:h-64">
          <div className="text-gray-400 
            text-lg sm:text-xl">
            No users found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div>
        <h2 className="text-white font-semibold px-4 sm:px-6 md:px-9
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Users
        </h2>

        <div className="relative mx-auto mt-6 sm:mt-8 md:mt-9 
          max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
          
          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-[-30px] sm:left-[-40px] md:left-[-60px] 
              top-1/2 transform -translate-y-1/2 z-10 
              bg-gray-800/80 hover:bg-gray-700 text-white 
              p-2 sm:p-3 rounded-full transition-all duration-300 
              hover:scale-110 shadow-lg border border-gray-600"
            disabled={currentIndex === 0}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
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

          {/* Users grid */}
          <div className="flex justify-center 
            gap-4 sm:gap-6 md:gap-8 
            transition-all duration-500 ease-in-out
            overflow-hidden">
            {visibleUsers.map((user) => (
              <Avatar key={user.uid} user={user} />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-[-30px] sm:right-[-40px] md:right-[-60px] 
              top-1/2 transform -translate-y-1/2 z-10 
              bg-gray-800/80 hover:bg-gray-700 text-white 
              p-2 sm:p-3 rounded-full transition-all duration-300 
              hover:scale-110 shadow-lg border border-gray-600"
            disabled={currentIndex + itemsPerPage >= users.length}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
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

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 sm:mt-8 gap-1 sm:gap-2">
            {Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerPage)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / itemsPerPage) === index
                      ? "bg-blue-500 scale-125"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              )
            )}
          </div>

          {/* User count */}
          <div className="text-center mt-3 sm:mt-4">
            <span className="text-gray-400 
              text-xs sm:text-sm">
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

