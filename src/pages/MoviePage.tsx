/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import { NavBar } from "../components/NavBar";
import { Menu } from "../components/Menu";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMovieData,
  type ApiMovieResponse,
  type MovieResponse,
} from "../services/movie.service";
import { MovieDetails } from "../components/MovieDetials";
import { saveRecentMovie } from "../components/recentMovies";

export const MoviePage = () => {
  const [menu, setMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [movieData, setMovieData] = useState<ApiMovieResponse>({
    imdb_id: "",
    success: false,
    source: "",
    data: {
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
      storyline: null,
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
      imdbId: "",
      videos: [],
      poster: "",
    },
  });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
            setMovieData(response);
            saveRecentMovie({
              imdbId: response.data.imdbId,
              poster: response.data.poster,
              title: response.data.title
            }, 4);
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
    if (movieData["data"].images && movieData["data"].images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % movieData["data"].images.length
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [movieData["data"].images]);

  const currentBackgroundImage =
    movieData["data"].images && movieData["data"].images.length > 0
      ? (movieData["data"].images[currentImageIndex]?.src || "").replace(
          /_V1_.*\.jpg$/,
          "_V1_.jpg"
        )
      : "";

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full 
            h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 
            border-b-2 border-white" />
          <div className="text-white 
            text-base sm:text-lg md:text-xl">
            Loading movie details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Background Image */}
      <div
        className="fixed inset-0 h-full w-full bg-cover bg-center bg-no-repeat 
          transition-all duration-200 ease-in-out"
        style={{
          backgroundImage: `url("${currentBackgroundImage}")`,
        }}
      />

      {/* Mobile backdrop for menu */}
      {menu && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenu(false)}
        />
      )}

      <motion.section
        initial={{ marginLeft: 0 }}
        animate={{
          // Only apply sidebar margin on desktop, not mobile
          marginLeft: !isMobile && menu ? "280px" : "0px",
          width: !isMobile && menu ? "calc(100% - 280px)" : "100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10 min-h-screen"
      >
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r 
          from-black/80 via-black/60 to-black/40 
          md:from-black/70 md:via-black/50 md:to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br 
          from-blue-900/30 via-purple-900/25 to-slate-900/40 
          md:from-blue-900/20 md:via-purple-900/20 md:to-slate-900/30" />

        <div className="min-h-screen relative z-10">
          <NavBar menuHandler={menuHandler} menu={menu} />
          <Menu menu={menu} />
          
          {/* Movie Details Container */}
          <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 
            mt-4 sm:mt-6 md:mt-8 lg:mt-9">
            <div className="max-w-7xl mx-auto">
              <MovieDetails movieData={movieData} />
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};
