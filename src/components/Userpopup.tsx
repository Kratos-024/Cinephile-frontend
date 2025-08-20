import { useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import type { UserProfile } from "../services/user.service";
import { useNavigate } from "react-router-dom";

interface UserPopupProps {
  isLoggedIn: boolean;
  userProfile: UserProfile;
  onClose: () => void;
  onAuthChange: (authenticated: boolean, profile?: UserProfile) => void;
}

export const UserPopup = ({
  isLoggedIn,
  userProfile,
  onClose,
  onAuthChange,
}: UserPopupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      onAuthChange(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMyProfile = () => {
    onClose();
    navigate(`/profile/${userProfile?.uid}/${userProfile?.displayName}`);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Popup container */}
      <div className="absolute z-50
        /* Mobile: Full width modal at bottom */
        fixed bottom-0 left-0 right-0 md:absolute md:right-0 md:top-12 md:bottom-auto md:left-auto
        /* Width responsive */
        w-full md:min-w-[280px] md:max-w-[320px] lg:min-w-[300px]
        /* Background and styling */
        bg-[#1b1919] border-0 md:border border-gray-700 
        rounded-t-2xl md:rounded-lg shadow-2xl
        /* Animation */
        transform transition-all duration-300 ease-in-out
        translate-y-0 md:translate-y-0">
        
        {/* Header */}
        <div className="flex items-center justify-between 
          p-4 sm:p-5 md:p-4
          border-b border-gray-700">
          <h3 className="text-white font-semibold 
            text-lg sm:text-xl md:text-base lg:text-lg">
            Account
          </h3>
          <IoClose
            className="text-gray-400 hover:text-white cursor-pointer 
              w-6 h-6 sm:w-7 sm:h-7 md:w-5 md:h-5 lg:w-6 lg:h-6
              transition-colors duration-200 
              hover:scale-110 active:scale-95"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-4 
          max-h-[60vh] md:max-h-none overflow-y-auto">
          <div className="space-y-4 sm:space-y-5 md:space-y-4">
            
            {/* User info card */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-3 
              p-3 sm:p-4 md:p-3 
              bg-gray-800/50 rounded-lg sm:rounded-xl md:rounded-lg
              hover:bg-gray-800/70 transition-colors duration-200">
              
              {/* Avatar */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 lg:w-12 lg:h-12
                bg-green-500 rounded-full flex items-center justify-center
                ring-2 ring-green-400/30 overflow-hidden">
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 
                    text-white" />
                )}
              </div>
              
              {/* User details */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate
                  text-base sm:text-lg md:text-sm lg:text-base">
                  {userProfile?.displayName || "User"}
                </p>
                <p className="text-gray-400 truncate
                  text-sm sm:text-base md:text-xs lg:text-sm">
                  {userProfile?.email}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 sm:space-y-3 md:space-y-2">
              
              {/* My Profile button */}
              <button
                onClick={handleMyProfile}
                className="w-full flex items-center justify-center gap-3 
                  px-4 sm:px-6 md:px-4 lg:px-6
                  py-3 sm:py-4 md:py-3 lg:py-4
                  bg-gradient-to-r from-red-600 to-red-700 
                  text-white font-bold 
                  text-base sm:text-lg md:text-sm lg:text-base
                  rounded-xl transition-all duration-300 
                  transform hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                  min-h-[44px] sm:min-h-[48px] md:min-h-[44px]"
              >
                <FaUser className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4" />
                My Profile
              </button>

              {/* Sign Out button */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-3 
                  px-4 sm:px-6 md:px-4 lg:px-6
                  py-3 sm:py-4 md:py-3 lg:py-4
                  text-gray-300 bg-gray-700 hover:bg-gray-600 
                  rounded-lg sm:rounded-xl md:rounded-lg 
                  transition-all duration-200
                  min-h-[44px] sm:min-h-[48px] md:min-h-[44px]
                  text-base sm:text-lg md:text-sm lg:text-base
                  font-medium
                  ${isLoading 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:scale-105 active:scale-95"
                  }`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full 
                    h-4 w-4 sm:h-5 sm:w-5 md:h-4 md:w-4 
                    border-b-2 border-gray-300" />
                ) : (
                  <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4" />
                )}
                Sign Out
              </button>
            </div>

            {/* Mobile close area */}
            <div className="md:hidden pt-2 pb-1">
              <div 
                className="w-12 h-1 bg-gray-600 rounded-full mx-auto cursor-pointer"
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
