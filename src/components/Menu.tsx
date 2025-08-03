import { useState } from "react";
import { BsBrowserEdge } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { SlCalender } from "react-icons/sl";
import { motion } from "framer-motion";

export const Menu = ({ menu }: { menu: boolean }) => {
  const [feed, setFeed] = useState<string>("Browser");

  const feedHandler = (feed: string) => {
    setFeed(feed);
  };

  const menuVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      x: -20,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.section
      variants={menuVariants}
      initial="hidden"
      animate={menu ? "visible" : "hidden"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-screen z-50"
    >
      <div className="w-[1px] bg-slate-700 right-0 absolute h-screen"></div>

      <div className="w-[280px] relative p-6 pt-8">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-[28px] text-center font-semibold mb-[48px]"
        >
          <span className="text-white">Cine</span>
          <span className="text-red-600">phile</span>
        </motion.h2>

        <div className="flex flex-col items-center gap-8 text-slate-500 text-[21px]">
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
            <motion.li
              variants={itemVariants}
              onClick={() => feedHandler("Browser")}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`${
                feed === "Browser" ? "text-white" : ""
              } flex cursor-pointer text-gray-600 items-center gap-4 relative`}
            >
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: feed === "Browser" ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="h-[46px] left-[-24px] absolute w-1 bg-red-700 origin-center"
              />
              <motion.div
                whileHover={{ rotate: 5 }}
                className={`${
                  feed === "Browser" ? "bg-red-500" : ""
                } p-2 rounded-full text-white transition-colors duration-200`}
              >
                <BsBrowserEdge />
              </motion.div>
              <span className="font-semibold">Browser</span>
            </motion.li>

            <motion.li
              variants={itemVariants}
              onClick={() => feedHandler("Watchlist")}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`${
                feed === "Watchlist" ? "text-white" : ""
              } flex cursor-pointer text-gray-600 items-center gap-4 relative`}
            >
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: feed === "Watchlist" ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="h-[46px] left-[-24px] absolute w-1 bg-red-700 origin-center"
              />
              <motion.div
                whileHover={{ rotate: 5 }}
                className={`${
                  feed === "Watchlist" ? "bg-red-500" : ""
                } p-2 rounded-full text-white transition-colors duration-200`}
              >
                <CiHeart />
              </motion.div>
              <span className="font-semibold">Watchlist</span>
            </motion.li>

            <motion.li
              variants={itemVariants}
              onClick={() => feedHandler("Coming Soon")}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`${
                feed === "Coming Soon" ? "text-white" : ""
              } flex cursor-pointer text-gray-600 items-center gap-4 relative`}
            >
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: feed === "Coming Soon" ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="h-[46px] left-[-24px] absolute w-1 bg-red-700 origin-center"
              />
              <motion.div
                whileHover={{ rotate: 5 }}
                className={`${
                  feed === "Coming Soon" ? "bg-red-500" : ""
                } p-2 rounded-full text-white transition-colors duration-200`}
              >
                <SlCalender />
              </motion.div>
              <span className="font-semibold">Coming Soon</span>
            </motion.li>
          </motion.ul>
        </div>
      </div>
    </motion.section>
  );
};
