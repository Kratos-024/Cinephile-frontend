import { motion } from "framer-motion";
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

  if (!userid) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-gray-400">Invalid user profile.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ marginLeft: 0 }}
      animate={{
        marginLeft: menu ? "280px" : "0px",
        width: menu ? "calc(100% - 280px)" : "100%",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-primary relative z-10"
      style={{
        paddingLeft: '0',
        paddingRight: '0',
      }}
    >
      <NavBar menuHandler={menuHandler} menu={menu} />
      <div className="px-6">
        <UserProfileHero user_userid={userid} />
      </div>
    </motion.section>
  );
};
