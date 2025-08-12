/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { NavBar } from "../components/NavBar";
import { Menu } from "../components/Menu";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieData,
  type ApiMovieResponse,
  type MovieResponse,
} from "../services/movie.service";
import { useState } from "react";
import { MovieDetails } from "../components/MovieDetials";

export const MoviePage = () => {
  const [menu, setMenu] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [movieData, setMovieData] = useState<ApiMovieResponse["data"]>({
    Awards: "",
    Director: "",
    Country: "",
    Rated: "",
    Runtime: "",
    Released: "",
    genre: "",
    title: "",
    Language: "",
    rating: [{ Source: "", Value: "" }],
    storyLine: "",
    BoxOffice: "",
    cast: [],
    images: [],
    ratings: {
      imdbScore: {
        rating: "",
        totalVotes: "",
        fullRating: "",
      },
      metascore: {
        score: "",
        backgroundColor: "",
      },
    },
    storyline: { tagline: "", story: "", genres: [""], keywords: [""] },
    videoSources: [
      {
        src: "",
        type: "",
        poster: "",
        className: "",
        id: "",
        preload: "",
        controls: false,
        autoplay: false,
        muted: false,
        loop: false,
        width: 0,
        height: 0,
      },
    ],
    scrapedAt: "",
    url: "",
  });

  const menuHandler = () => {
    setMenu(!menu);
  };

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const response: MovieResponse = await getMovieData(id);
          if (response.success) {
            console.log("Fetched movieData:", response.data);
            console.log("Fetched movieData:", response.data.Rated);
            setMovieData(response.data);
          }
        } catch (error) {
          console.error("Error fetching movie data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (movieData.images && movieData.images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % movieData.images.length
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [movieData.images]);

  const currentBackgroundImage =
    movieData.images && movieData.images.length > 0
      ? (movieData.images[currentImageIndex]?.src || "").replace(
          /_V1_.*\.jpg$/,
          "_V1_.jpg"
        )
      : "";

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading movie details...</div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 h-full w-full bg-cover bg-center bg-no-repeat transition-all duration-200 ease-in-out"
        style={{
          backgroundImage: `url("${currentBackgroundImage}")`,
        }}
      />

      <motion.section
        initial={{ marginLeft: 0 }}
        animate={{
          marginLeft: menu ? "280px" : "0px",
          width: menu ? "calc(100% - 280px)" : "100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0b0818] via-[#0b0818]/50 to-transparent z-20"></div>

        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0b0818] via-[#0b0818]/50 to-transparent z-20"></div>

        <div className="min-h-screen relative z-10">
          <NavBar menuHandler={menuHandler} menu={menu} />
          <Menu menu={menu} />
          <div className="w-[1280px] mt-9 mx-auto">
            <MovieDetails movieData={movieData} />
          </div>
        </div>
      </motion.section>
    </>
  );
};
