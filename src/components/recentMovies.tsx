/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { MovieCommentResponse } from "../services/user.service";
import { useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
 const saveRecentMovie = (movie: { imdbId: string, title: string, poster: string }, maxItems = 4) => {
  try {
    const stored = localStorage.getItem("recentMovies");
    const recentMovies = stored ? JSON.parse(stored) : [];

    const filtered = recentMovies.filter((m: {imdbId:string,title:string,poster:string}) => m.imdbId !== movie.imdbId);

    filtered.unshift(movie);

    const updatedRecent = filtered.slice(0, maxItems);
    localStorage.setItem("recentMovies", JSON.stringify(updatedRecent));
  } catch (error) {
    console.error("Failed to save recent movie:", error);
  }
};


const RecentActivity = () => {
  const [recentMovies, setRecentMovies] = useState<
    { imdbId: string; title: string; poster: string }[]
  >([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { userid } = useParams();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsub();
  }, []);
  useEffect(() => {

    if (!currentUser || currentUser.uid !== userid) return;

    const stored = localStorage.getItem("recentMovies");
    if (stored) {
      setRecentMovies(JSON.parse(stored));
    }
  }, [currentUser, userid]);
  if (!currentUser || currentUser.uid !== userid) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-400 text-sm uppercase tracking-wide">
          Recent Activity
        </h2>
        <button className="text-gray-400 text-sm hover:text-white">ALL</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentMovies.map((movie) => (
          <div key={movie.imdbId} className="relative group cursor-pointer">
            <img
            src={movie.poster.replace(/_V1_.*\..*jpg$/, "_V1_.jpg")}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover rounded"
            />
            <div className="absolute bottom-2 left-2">
              <div className="flex text-orange-500 text-xs">
                {"★★★★☆".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface RecentReviewsProps {
  reviews: MovieCommentResponse[];
}
const RecentReviews = ({ reviews }: RecentReviewsProps) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-400 text-sm">No recent reviews</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.slice(0, 3).map((review) => (
        <div
          key={review.id || review.timestamp}
          className="flex gap-4 p-4 bg-gray-800 bg-opacity-30 rounded"
        >
          <img
            src={
              review.poster ||
              "https://via.placeholder.com/100x150?text=No+Image"
            }
            alt={review.movieTitle}
            className="w-16 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="text-white text-lg font-semibold mb-1">
              {review.movieTitle}
              <span className="text-gray-400 font-normal"> {review.title}</span>
            </h3>

            <div className="flex items-center text-xs mb-2">
              <div className="flex text-green-500">
                {(
                  "★".repeat(review.rating) +
                  "☆".repeat(5 - review.rating)
                )
                  .split("")
                  .map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
              </div>
              <span className="text-gray-400 ml-2">
                Watched{" "}
                {review.timestamp
                  ? new Date(review.timestamp).toLocaleDateString()
                  : ""}
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
            <div className="flex items-center text-gray-400 text-xs">
              <span>♡ No likes yet</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export { RecentActivity, saveRecentMovie,RecentReviews}

