import { motion } from "framer-motion";
import { NavBar } from "../components/NavBar";
import Hero from "../components/Hero";
import { TrendingSection } from "../components/TrendingSection";
import { ReccomendedByOurModel } from "../components/ReccomendedByOurModel";
import { AvatarExamples } from "../components/Users";
import { Footer } from "../components/Footer";

export const HomePage = ({
  menuHandler,
  menu,
}: {
  menu: boolean;
  menuHandler: () => void;
}) => {
  return (
    <motion.section
      initial={{ marginLeft: 0 }}
      animate={{
        marginLeft: menu ? "280px" : "0px",
        width: menu ? "calc(100% - 280px)" : "100%",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-screen bg-primary relative z-10"
      // Remove overflow-x-hidden and add proper z-index
      style={{
        paddingLeft: '0',
        paddingRight: '0',
      }}
    >
      <NavBar menuHandler={menuHandler} menu={menu} />
      <div className="px-3">
        <Hero />
        <TrendingSection />
        <ReccomendedByOurModel />
        <AvatarExamples />
        <Footer />
      </div>
    </motion.section>
  );
};
