import { useState, useEffect } from "react";
import { BsBrowserEdge } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { signOut } from 'firebase/auth';
import { getUserFollowing } from "../services/user.service";
import { auth } from "../firebase/firebase";
import { useLocation, useNavigate } from "react-router-dom";

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
}

const UserFollowingSection: React.FC = () => {
  const [followingData, setFollowingData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await getUserFollowing(token);
        setFollowingData(data.data.following);
      } catch (error) {
        console.error("Error fetching following data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  const token = localStorage.getItem("authToken");
  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mx-auto" />
        <span className="text-gray-400 text-xs mt-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-center text-gray-300 
        text-sm sm:text-base font-medium mb-4 sm:mb-6 md:mb-7">
        Following
      </h2>
      
      <ul className="space-y-3 sm:space-y-4 md:space-y-7 
        max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto 
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {followingData.map((user) => (
          <li key={user.uid} className="flex items-center gap-2 sm:gap-3 
            p-1 sm:p-2 rounded-lg hover:bg-gray-800/30 transition-colors">
            {user.photoURL && (
              <img
                loading="lazy"
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                  rounded-full object-cover border border-gray-600"
                src={user.photoURL}
                alt={user.displayName || "User Avatar"}
              />
            )}
            <span className="text-gray-400 
              text-xs sm:text-sm truncate flex-1">
              {user.displayName}
            </span>
          </li>
        ))}
      </ul>

      {followingData.length > 5 && (
        <div className="flex items-center mt-4 sm:mt-6 md:mt-9 
          cursor-pointer gap-2 sm:gap-3 
          hover:bg-gray-800/20 p-2 rounded-lg transition-colors">
          <div className="bg-red-500 w-fit p-1.5 sm:p-2 rounded-full 
            text-black transition-colors duration-200 
            hover:bg-red-600">
            <FaChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
          <span className="text-gray-400 
            text-xs sm:text-sm">
            Load More
          </span>
        </div>
      )}
    </div>
  );
};

export const Menu: React.FC<{ menu: boolean }> = ({ menu }) => {
  const [feed, setFeed] = useState("Browser");
  const location = useLocation();
  const navigate = useNavigate();

  // Map current path to feed name
  useEffect(() => {
    if (location.pathname === "/WatchlistPage") {
      setFeed("Watchlist");
    } else if (location.pathname === "/ComingSoon") {
      setFeed("Coming Soon");
    } else {
      setFeed("Browser");
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      window.location.href = '/'; 
      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuItemClick = (item: string) => {
    setFeed(item);
    
    if (item === "Watchlist") {
      navigate("/WatchlistPage");
    } else if (item === "Coming Soon") {
      navigate("/ComingSoon");
    } else {
      navigate("/");
    }
  };

  const menuVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.section
      variants={menuVariants}
      initial="hidden"
      animate={menu ? "visible" : "hidden"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed bg-primary top-0 left-0 h-screen z-50
        w-[240px] sm:w-[260px] md:w-[280px]
        shadow-2xl border-r border-gray-700"
    >
      {/* Right border line */}
      <div className="w-[1px] bg-slate-700 right-0 absolute h-screen" />

      <div className="w-full relative h-full overflow-y-auto
        p-3 sm:p-4 md:p-6 pt-4 sm:pt-6 md:pt-8">
        
        {/* Logo */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center font-semibold mb-8 sm:mb-10 md:mb-12
            text-xl sm:text-2xl md:text-[28px]"
        >
          <a href="/">
            <span className="text-white">Cine</span>
            <span className="text-red-600">phile</span>
          </a>
        </motion.h2>

        {/* Menu Content */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 
          text-gray-500 w-full">
          
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-center 
              text-base sm:text-lg md:text-[21px]"
          >
            News Feed
          </motion.span>

          {/* Menu Items */}
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate={menu ? "visible" : "hidden"}
            className="flex flex-col gap-4 sm:gap-6 md:gap-9 w-full"
          >
            {["Browser", "Watchlist", "Coming Soon"].map((item) => (
              <motion.li
                key={item}
                variants={itemVariants}
                onClick={() => item !== "Coming Soon" ? handleMenuItemClick(item) : null}
                whileHover={item !== "Coming Soon" ? { scale: 1.05, x: 5 } : {}}
                whileTap={item !== "Coming Soon" ? { scale: 0.95 } : {}}
                className={`${
                  feed === item ? "text-white" : ""
                } flex items-center gap-2 sm:gap-3 md:gap-4 relative ${
                  item === "Coming Soon" 
                    ? "cursor-not-allowed opacity-50" 
                    : "cursor-pointer text-gray-600 hover:text-gray-300"
                } p-2 rounded-lg transition-all duration-200`}
              >
                <motion.span
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: feed === item ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-8 sm:h-10 md:h-[46px] 
                    left-[-12px] sm:left-[-16px] md:left-[-24px] 
                    absolute w-1 bg-red-700 origin-center rounded-full"
                />
                
                <motion.div
                  whileHover={item !== "Coming Soon" ? { rotate: 5 } : {}}
                  className={`${
                    feed === item ? "bg-red-500" : "bg-gray-700"
                  } p-1.5 sm:p-2 rounded-full text-white 
                    transition-colors duration-200 ${
                    item === "Coming Soon" ? "opacity-50" : "hover:bg-red-400"
                  }`}
                >
                  {item === "Browser" && <BsBrowserEdge className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {item === "Watchlist" && <CiHeart className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {item === "Coming Soon" && <SlCalender className="w-3 h-3 sm:w-4 sm:h-4" />}
                </motion.div>
                
                <span className={`font-semibold 
                  text-sm sm:text-base md:text-lg ${
                  item === "Coming Soon" ? "opacity-50" : ""
                }`}>
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Divider */}
          <div className="w-full max-w-[180px] sm:max-w-[190px] md:max-w-[196px] 
            bg-slate-700 h-[1px]" />
          
          {/* Following Section */}
          <div className="w-full max-w-[180px] sm:max-w-[190px] md:max-w-[196px]">
            <UserFollowingSection />
          </div>
        </div>

        {/* Logout Button */}
        <div 
          onClick={handleLogout}
          className="flex items-center cursor-pointer gap-2 sm:gap-3 
            mt-6 sm:mt-8 p-2 rounded-lg
            hover:bg-gray-800/30 transition-colors duration-200
            text-gray-400 hover:text-white"
        >
          <div className="w-fit p-1.5 sm:p-2 rounded-full 
            text-white transition-colors duration-200
            hover:bg-red-500">
            <IoIosLogOut className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </div>
          <span className="text-sm sm:text-base">Logout</span>
        </div>
      </div>
    </motion.section>
  );
};

export default Menu;

