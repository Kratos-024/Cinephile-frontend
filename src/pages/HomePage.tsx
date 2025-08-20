// import { motion } from "framer-motion";
// import { NavBar } from "../components/NavBar";
// import Hero from "../components/Hero";
// import { TrendingSection } from "../components/TrendingSection";
// import { ReccomendedByOurModel } from "../components/ReccomendedByOurModel";
// import { AvatarExamples } from "../components/Users";
// import { Footer } from "../components/Footer";

// export const HomePage = ({
//   menuHandler,
//   menu,
// }: {
//   menu: boolean;
//   menuHandler: () => void;
// }) => {
//   return (
//     <motion.section
//       initial={{ marginLeft: 0 }}
//       animate={{
//         marginLeft: menu ? "280px" : "0px",
//         width: menu ? "calc(100% - 280px)" : "100%",
//       }}
//       transition={{ duration: 0.3, ease: "easeInOut" }}
//       className="px-3 bg-primary   "
//     >
//       <NavBar menuHandler={menuHandler} menu={menu} />;
//       <Hero />
//       <TrendingSection />
//       <ReccomendedByOurModel />
//       <AvatarExamples />
//       <Footer />
//     </motion.section>
//   );
// };
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
      <Hero />
      <TrendingSection />
      <ReccomendedByOurModel />
      <AvatarExamples />
      <Footer />
    </motion.section>
  );
};
