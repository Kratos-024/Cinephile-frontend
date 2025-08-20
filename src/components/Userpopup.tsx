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
    <div className="absolute right-0 top-12 z-50
     bg-[#1b1919] border border-gray-700 rounded-lg
      shadow-2xl  min-w-[280px]">
      <div className="flex items-center justify-between p-4
       border-b border-gray-700">
        <h3 className="text-white font-semibold">Account</h3>
        <IoClose
          className="text-gray-400 hover:text-white cursor-pointer w-5 h-5 transition-colors"
          onClick={onClose}
        />
      </div>

      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FaUser className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {userProfile?.displayName || "User"}
              </p>
              <p className="text-gray-400 text-sm truncate">
                {userProfile?.email}
              </p>
            </div>
          </div>

     

          <div className="space-y-2">
            <button
              onClick={handleMyProfile}
              className="w-full flex items-center gap-3 px-4
               py-3 text-whitepx-8
               bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-xl transition-all 
               duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaUser className="w-4 h-4" />
              My Profile
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className={`w-full flex items-center gap-3 px-4 py-3 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300" />
              ) : (
                <FaSignOutAlt className="w-4 h-4" />
              )}
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
