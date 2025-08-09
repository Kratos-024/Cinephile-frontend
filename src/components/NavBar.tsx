/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { IoIosSearch, IoIosNotifications } from "react-icons/io";
import { RiMenuSearchFill } from "react-icons/ri";
import { LuMessageCircleMore } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
import { googleLogin } from "../firebase/login";
import { UserPopup } from "./Userpopup";
import { auth } from "../firebase/firebase";
import type { UserProfile } from "../services/user..service";

export const NavBar = ({
  menuHandler,
  menu,
}: {
  menuHandler: () => void;
  menu: boolean;
}) => {
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User authenticated:", user);
        setIsLoggedIn(true);
        setUserProfile({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
          followers: [],
          following: [],
          followersCount: 0,
          followingCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        console.log("User not authenticated");
        setIsLoggedIn(false);
        setUserProfile(null);
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
      console.log("Starting Google login...");
      const result = await googleLogin();

      console.log("Google login result:", result);

      if (result.success && result.data) {
        console.log("Login successful!");
      } else {
        if (result.code === "auth/popup-closed-by-user") {
          console.log("User cancelled login");
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

  return (
    <div className="w-full">
      <div
        className="flex items-center
       justify-between"
      >
        <div
          className="flex items-center 
        gap-4"
        >
          <div
            onClick={menu ? undefined : () => menuHandler()}
            className={`transition-all duration-200 ease-in-out ${
              menu ? "pointer-events-none text-slate-500" : "text-white"
            }`}
          >
            <FaAngleLeft className="cursor-pointer w-6 h-6" />
          </div>

          <div
            onClick={menu ? menuHandler : undefined}
            className={`transition-all duration-200 ease-in-out ${
              menu ? "text-white" : "pointer-events-none text-slate-500"
            }`}
          >
            <FaAngleRight className="cursor-pointer w-6 h-6" />
          </div>

          <div className="flex items-center px-2 pl-5 py-3 w-[320px] gap-3 border border-gray-700 rounded-3xl text-white min-w-0">
            <IoIosSearch className="text-gray-400 w-6 h-6" />
            <input
              className="text-white bg-transparent outline-none flex-1 min-w-0"
              placeholder="Search Anything"
            />
            <RiMenuSearchFill className="text-gray-400 w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center gap-4 text-white">
          <LuMessageCircleMore className="w-7 h-7 cursor-pointer" />
          <IoIosNotifications className="w-7 h-7 cursor-pointer" />
          <div className="relative" ref={popupRef}>
            <CiUser
              className={`w-7 h-7 cursor-pointer transition-colors ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-gray-300"
              }`}
              onClick={handleUserClick}
            />

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute -top-1 -right-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
              </div>
            )}

            {/* User Popup - only show for logged in users or error states */}
            {showUserPopup && (
              <UserPopup
                isLoggedIn={isLoggedIn}
                userProfile={userProfile}
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
