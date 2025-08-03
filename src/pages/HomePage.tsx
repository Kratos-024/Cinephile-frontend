import { motion } from "framer-motion";
import { NavBar } from "../components/NavBar";

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
      className="px-6"
    >
      <NavBar menu={menu} menuHandler={menuHandler} />
    </motion.section>
  );
};
