import { motion } from "framer-motion";
import { NavBar } from "../components/NavBar";
import { SearchComponent } from "../components/SearchComponent";

export const SearchPage = ({
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
      className="px-3 bg-primary   "
    >
      <NavBar menuHandler={menuHandler} menu={menu} />;
      <SearchComponent />
    </motion.section>
  );
};
