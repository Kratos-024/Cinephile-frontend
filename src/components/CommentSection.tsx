import { useState } from "react";
import { auth } from "../firebase/firebase";
export interface commentType {
  title: string;
  comment: string;
  displayName: string;
  photoURL: string;
  rating: number;
}
export type CommentSectionProps = {
  onHandler: (data: commentType) => void;
};

export const CommentSection = ({ onHandler }: CommentSectionProps) => {
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [displayName, setDisplayName] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");

  auth.onAuthStateChanged((user) => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  });
  return (
    <section>
      <div className="flex flex-col w-fit ">
        <div>
          <img src={photoURL} className="rounded-full p-2" />
          <p>{displayName}</p>
        </div>
        <div className="flex gap-2 mb-1">
          <input
            className=" bg-gray-800/50 placeholder:p-2 rounded-md"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          ></input>
          <input
            className=" bg-gray-800/50 placeholder:p-2 rounded-md"
            onChange={(e) => setRating(+e.target.value)}
            placeholder="Rating"
          ></input>
        </div>
        <textarea
          rows={5}
          cols={100}
          className="text-gray-400 rounded-xl placeholder:p-2 bg-gray-800/50"
          placeholder="Reply as reviewer"
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <div className="flex justify-end mt-2">
          <button
            onClick={() =>
              onHandler({
                title: title,
                comment: comment,
                rating: rating,
                displayName: displayName,
                photoURL: photoURL,
              })
            }
            className="cursor-pointer rounded-lg bg-green-700 text-white font-semibold px-4 py-2"
          >
            COMMENT
          </button>
        </div>
      </div>
    </section>
  );
};
