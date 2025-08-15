import { useState } from "react";
import type { MovieVideo } from "../services/movie.service";

export const VideoPlayer = ({ Videos }: { Videos: MovieVideo[] }) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  if (!Videos || Videos.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-800 rounded-lg text-gray-400">
        No videos available
      </div>
    );
  }

  const currentVideo = Videos[selectedVideoIndex];

  return (
    <section className="flex flex-col md:items-center gap-4 mb-8">
      <div className="w-full max-w-5xl max-md:w-[440px] aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <video
          key={`${currentVideo.src}-${selectedVideoIndex}`}
          className="w-full h-full"
          src={currentVideo.src}
          poster={currentVideo.poster}
          controls
          preload="metadata"
          onError={() => console.error("Video failed to load")}
        >
          <source
            src={currentVideo.src}
            type={currentVideo.type || "video/mp4"}
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {Videos.length > 1 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {Videos.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedVideoIndex(index)}
              className={`px-3 py-1 rounded ${
                selectedVideoIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Video {index + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
