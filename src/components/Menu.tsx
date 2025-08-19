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

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="">
      <h2 className="text-center">Following</h2>
      <ul className="mt-7 space-y-7">
        {followingData.map((user) => (
          <li key={user.uid} className="flex items-center gap-3">
            {user.photoURL && (
              <img
                loading="lazy"
                className="w-12 h-12 rounded-full"
                src={user.photoURL}
                alt={user.displayName || "User Avatar"}
              />
            )}
            <span className="text-gray-700">{user.displayName}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center mt-9 cursor-pointer gap-3">
        <div className="bg-red-500 w-fit p-2 rounded-full text-black transition-colors duration-200">
          <FaChevronDown />
        </div>
        <span>Load More</span>
      </div>
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
      className="fixed bg-primary top-0 left-0 h-screen z-50"
    >
      <div className="w-[1px] bg-slate-700 right-0 absolute h-screen"></div>

      <div className="w-[280px] relative p-6 pt-8">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-[28px] text-center font-semibold mb-[48px]"
        >
          <a href="/">
            <span className="text-white">Cine</span>
            <span className="text-red-600">phile</span>
          </a>
        </motion.h2>

        <div className="flex flex-col items-center gap-8 text-gray-500 w-full text-[21px]">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="text-center"
          >
            News Feed
          </motion.span>

          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate={menu ? "visible" : "hidden"}
            className="flex flex-col gap-9"
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
    } flex items-center gap-4 relative ${
      item === "Coming Soon" 
        ? "cursor-not-allowed opacity-50" 
        : "cursor-pointer text-gray-600"
    }`}
  >
    <motion.span
      initial={{ scaleY: 0 }}
      animate={{ scaleY: feed === item ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="h-[46px] left-[-24px] absolute w-1 bg-red-700 origin-center"
    />
    <motion.div
      whileHover={item !== "Coming Soon" ? { rotate: 5 } : {}}
      className={`${
        feed === item ? "bg-red-500" : ""
      } p-2 rounded-full text-white transition-colors duration-200 ${
        item === "Coming Soon" ? "opacity-50" : ""
      }`}
    >
      {item === "Browser" && <BsBrowserEdge />}
      {item === "Watchlist" && <CiHeart />}
      {item === "Coming Soon" && <SlCalender />}
    </motion.div>
    <span className={`font-semibold ${
      item === "Coming Soon" ? "opacity-50" : ""
    }`}>
      {item}
    </span>
  </motion.li>
))}

          </motion.ul>

          <div className="w-[196px] bg-slate-700 right-0 h-[1px]"></div>
          <div className="w-[196px]">
            <UserFollowingSection />
          </div>
        </div>

        <div 
          onClick={handleLogout}
          className="flex items-center cursor-pointer gap-3 mt-8"
        >
          <div className="w-fit p-2 rounded-full text-white transition-colors duration-200">
            <IoIosLogOut className="w-7 h-7" />
          </div>
          <span>Logout</span>
        </div>
      </div>
    </motion.section>
  );
};

export default Menu;
