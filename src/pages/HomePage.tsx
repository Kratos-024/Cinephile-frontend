import { motion } from "framer-motion";
import { NavBar } from "../components/NavBar";
import Hero from "../components/Hero";
import { TrendingSection } from "../components/TrendingSection";
import { ReccomendedByOurModel } from "../components/ReccomendedByOurModel";
import { getUserInfo } from "../services/user..service";
import { useEffect } from "react";

export const HomePage = ({
  menuHandler,
  menu,
}: {
  menu: boolean;
  menuHandler: () => void;
}) => {
  useEffect(() => {
    const token = localStorage.getItem("authToken") || "";
    getUserInfo(token);
  }, []);
  return (
    <motion.section
      initial={{ marginLeft: 0 }}
      animate={{
        marginLeft: menu ? "280px" : "0px",
        width: menu ? "calc(100% - 280px)" : "100%",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="px-3 bg-primary   "
    >
      <NavBar menuHandler={menuHandler} menu={menu} />;
      <Hero />
      <TrendingSection />
      <ReccomendedByOurModel />
    </motion.section>
  );
};
