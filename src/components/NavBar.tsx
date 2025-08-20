import { useState, useEffect, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { IoIosSearch, IoIosNotifications } from "react-icons/io";
import { RiMenuSearchFill } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { googleLogin } from "../firebase/login";
import { UserPopup } from "./Userpopup";
import { auth } from "../firebase/firebase";
import type { UserProfile } from "../services/user.service";
import { useNavigate } from "react-router-dom";

export const NavBar = ({
  menuHandler,
  menu,
}: {
  menuHandler: () => void;
  menu: boolean;
}) => {
  const navigate = useNavigate();
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfileData, setUserProfile] = useState<UserProfile>({
    uid: "",
    email: "",
    displayName: "",
    photoURL: "",
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserProfile({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || null,
          photoURL: user.photoURL,
          followers: [],
          following: [],
          followersCount: 0,
          followingCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowUserPopup(false);
      }
    };

    if (showUserPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showUserPopup]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const result = await googleLogin();

      if (result.success && result.data) {
        console.log("");
      } else {
        if (result.code === "auth/popup-closed-by-user") {
          console.log("");
          return;
        } else {
          console.error("Login failed:", result.message);
          alert(result.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      alert("An unexpected error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = async () => {
    if (isLoggedIn) {
      setShowUserPopup(!showUserPopup);
    } else {
      await handleGoogleLogin();
    }
  };

  const handleClosePopup = () => {
    setShowUserPopup(false);
  };

  const handleAuthChange = (authenticated: boolean) => {
    if (!authenticated) {
      setShowUserPopup(false);
    }
  };

  const [search, setSearch] = useState<string>("");
  const searchHandler = () => {
    if (search.trim().length >= 1) {
      navigate(`/search/${search}`);
      setSearch("");
    } else {
      alert("Please enter a search query");
    }
  };

  return (
    <div className="w-full py-2 sm:py-3 md:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side - Menu buttons and search */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
          {/* Menu buttons - hide on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <div
              onClick={menu ? undefined : () => menuHandler()}
              className={`transition-all duration-200 ease-in-out ${
                menu ? "pointer-events-none text-slate-500" : "text-white"
              }`}
            >
              <FaAngleLeft className="cursor-pointer w-5 h-5 lg:w-6 lg:h-6" />
            </div>

            <div
              onClick={menu ? menuHandler : undefined}
              className={`transition-all duration-200 ease-in-out ${
                menu ? "text-white" : "pointer-events-none text-slate-500"
              }`}
            >
              <FaAngleRight className="cursor-pointer w-5 h-5 lg:w-6 lg:h-6" />
            </div>
          </div>

          {/* Search bar - responsive width */}
          <div className="flex items-center px-3 py-2 sm:py-3 
            w-full max-w-[200px] sm:max-w-[260px] md:max-w-[300px] lg:max-w-[320px] 
            gap-2 sm:gap-3 border border-gray-700 rounded-2xl sm:rounded-3xl 
            text-white bg-gray-800/50 backdrop-blur-sm">
            
            <div className="cursor-pointer" onClick={searchHandler}>
              <IoIosSearch className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 
                hover:text-white transition-colors" />
            </div>
            
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  searchHandler();
                }
              }}
              className="text-white bg-transparent outline-none flex-1 min-w-0 
                text-sm sm:text-base placeholder-gray-500"
              placeholder="Search..."
            />
            
            <RiMenuSearchFill 
              className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 
                hover:text-white transition-colors cursor-pointer" 
              onClick={searchHandler}
            />
          </div>
        </div>

        {/* Right side - Notifications and user */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-white">
          <IoIosNotifications className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer 
            hover:text-gray-300 transition-colors" />
          
          <div className="relative" ref={popupRef}>
            <CiUser
              className={`w-6 h-6 sm:w-7 sm:h-7 cursor-pointer transition-colors ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-gray-300"
              }`}
              onClick={handleUserClick}
            />

            {isLoading && (
              <div className="absolute -top-1 -right-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
              </div>
            )}

            {showUserPopup && (
              <UserPopup
                isLoggedIn={isLoggedIn}
                userProfile={userProfileData}
                onClose={handleClosePopup}
                onAuthChange={handleAuthChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
