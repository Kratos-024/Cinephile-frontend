import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { NavBar } from "../components/NavBar";
import { UserProfileHero } from "../components/UserProfileHero";
import { useParams } from "react-router-dom";

export const UserProfile = ({
  menuHandler,
  menu,
}: {
  menu: boolean;
  menuHandler: () => void;
}) => {
  const { userid } = useParams();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!userid) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-gray-400">Invalid user profile.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ marginLeft: 0 }}
      animate={{
        // Only apply sidebar margin on desktop, not mobile
        marginLeft: !isMobile && menu ? "280px" : "0px",
        width: !isMobile && menu ? "calc(100% - 280px)" : "100%",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-primary 
        px-2 sm:px-3 md:px-4 lg:px-6 
        w-full overflow-x-hidden"
    >
      <NavBar menuHandler={menuHandler} menu={menu} />
      <UserProfileHero user_userid={userid} />
    </motion.section>
  );
};
