import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";

export interface commentType {
  movieTitle?: string;
  poster?: string;
  imdb_id: string;
  title: string;
  comment: string;
  userDisplayName: string;
  userPhotoURL: string;
  rating: number;
}

export type CommentSectionProps = {
  onHandler: (data: commentType) => void;
  imdb_id: string;
  userReview?: commentType;
};

export const CommentSection = ({
  onHandler,
  imdb_id,
  userReview,
}: CommentSectionProps) => {
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [displayName, setDisplayName] = useState<string>("");
  const [userPhotoURL, setPhotoURL] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setDisplayName(user.displayName || "");
        setPhotoURL(user.photoURL || "");
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setDisplayName("");
        setPhotoURL("");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userReview) {
      setTitle(userReview.title);
      setComment(userReview.comment);
      setRating(userReview.rating);
    }
  }, [userReview]);

  const handleSubmit = async () => {
    // Check if user is logged in first
    if (!isLoggedIn) {
      toast.error("Please log in to comment", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (!comment.trim() || !title.trim() || rating === 0) {
      toast.error("Please fill in all fields and provide a rating", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    onHandler({
      imdb_id: imdb_id,
      title: title,
      comment: comment,
      rating: rating,
      userDisplayName: displayName,
      userPhotoURL: userPhotoURL,
    });

    setTitle("");
    setComment("");
    setRating(0);
  };

  const handleInputClick = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to comment", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <section>
      <div className="flex gap-3 justify-center flex-col max-sm:w-[420px] max-md:w-[520px] max-xl:w-[960px] xl:w-full max-lg:w-[720px]">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={isLoggedIn ? (userPhotoURL || "/default-avatar.png") : "/default-avatar.png"}
            alt="User avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="text-white font-medium">
            {isLoggedIn ? displayName : "Please log in to comment"}
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            className={`flex-1 bg-gray-800/50 text-white p-3 rounded-md placeholder-gray-400 ${
              !isLoggedIn ? "cursor-not-allowed opacity-60" : ""
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onClick={handleInputClick}
            placeholder="Review title"
            disabled={!isLoggedIn}
          />
          <div className="flex flex-col">
            <input
              type="number"
              min="1"
              max="5"
              className={`bg-gray-800/50 text-white p-3 rounded-md placeholder-gray-400 w-24 ${
                !isLoggedIn ? "cursor-not-allowed opacity-60" : ""
              }`}
              value={rating || ""}
              onChange={(e) => setRating(Number(e.target.value))}
              onClick={handleInputClick}
              placeholder="1-5"
              disabled={!isLoggedIn}
            />
            <span className="text-xs text-gray-400 mt-1">Rating</span>
          </div>
        </div>

        <textarea
          rows={5}
          className={`text-white rounded-xl p-3 bg-gray-800/50 placeholder-gray-400 resize-none ${
            !isLoggedIn ? "cursor-not-allowed opacity-60" : ""
          }`}
          placeholder={isLoggedIn ? "Write your review..." : "Please log in to write a review"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onClick={handleInputClick}
          disabled={!isLoggedIn}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleSubmit}
            className={`cursor-pointer rounded-lg font-semibold px-6 py-2 transition-colors ${
              isLoggedIn
                ? "bg-green-700 hover:bg-green-600 text-white"
                : "bg-gray-600 cursor-not-allowed text-gray-400"
            }`}
            disabled={!isLoggedIn}
          >
            {isLoggedIn ? "SUBMIT" : "LOG IN TO COMMENT"}
          </button>
        </div>
      </div>
    </section>
  );
};
