/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { MovieVideo } from "../services/movie.service";

export const VideoPlayer = ({ Videos }: { Videos: MovieVideo[] }) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const currentVideo =
    Videos && Videos.length > 0 ? Videos[selectedVideoIndex] : null;

  const handleVideoError = (e: any) => {
    console.error("Video loading error:", e);
    setIsLoading(false);
    setHasError(true);
  };

  const handleVideoSelect = (index: number) => {
    setSelectedVideoIndex(index);
    setIsLoading(true);
    setHasError(false);
  };

  if (!Videos || Videos.length === 0) {
    return (
      <section className="flex flex-col justify-center items-center px-4 space-y-4">
        <div className="w-full h-[550px] aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-700 flex items-center justify-center bg-gray-800">
          <p className="text-gray-400">No videos available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center px-4 space-y-4">
      <div className="w-full h-[550px] aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-700 relative bg-black">
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-20">
            <div className="text-center">
              <p className="text-red-400 mb-2">Failed to load video</p>
              <p className="text-gray-400 text-sm mb-4">
                The video source may be expired or unavailable
              </p>
              <button
                onClick={() => handleVideoSelect(selectedVideoIndex)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {currentVideo && (
          <video
            key={`${currentVideo.src}-${selectedVideoIndex}`} // Better key for re-rendering
            className="w-full h-full object-contain"
            src={currentVideo.src} // Use src directly instead of source element
            poster={currentVideo.poster || undefined}
            controls={true} // Force controls to always show
            autoPlay={false} // Set to false to avoid autoplay issues
            muted={currentVideo.muted || false}
            loop={currentVideo.loop || false}
            preload="metadata"
            playsInline={true} // Important for mobile
            crossOrigin="anonymous" // May help with CORS
            onLoadStart={() => {
              console.log("Video load started");
              setIsLoading(true);
            }}
            onLoadedMetadata={() => {
              console.log("Video metadata loaded");
              setIsLoading(false);
            }}
            onLoadedData={() => {
              console.log("Video data loaded");
              setIsLoading(false);
            }}
            onCanPlay={() => {
              console.log("Video can play");
              setIsLoading(false);
            }}
            onError={handleVideoError}
            onPlay={() => console.log("Video started playing")}
            onPause={() => console.log("Video paused")}
          >
            {/* Fallback source element */}
            <source
              src={currentVideo.src}
              type={currentVideo.type || "video/mp4"}
            />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Always show video info for debugging */}
      {currentVideo && (
        <div className="text-center text-sm text-gray-400 mt-2 bg-gray-800 p-3 rounded-lg">
          <p className="mb-1">
            Video {selectedVideoIndex + 1} of {Videos.length}
          </p>
          {currentVideo.type && (
            <p className="mb-1">Format: {currentVideo.type}</p>
          )}
          {currentVideo.width && currentVideo.height && (
            <p className="mb-1">
              Resolution: {currentVideo.width}x{currentVideo.height}
            </p>
          )}
          <p className="text-xs text-gray-500 break-all">
            Source: {currentVideo.src.substring(0, 100)}...
          </p>
          <div className="flex gap-2 justify-center mt-2 text-xs">
            <span
              className={`px-2 py-1 rounded ${
                currentVideo.controls ? "bg-green-600" : "bg-red-600"
              }`}
            >
              Controls: {currentVideo.controls ? "On" : "Off"}
            </span>
            <span
              className={`px-2 py-1 rounded ${
                currentVideo.autoplay ? "bg-green-600" : "bg-red-600"
              }`}
            >
              Autoplay: {currentVideo.autoplay ? "On" : "Off"}
            </span>
          </div>
        </div>
      )}

      {/* Video Selection Buttons - Always show if multiple videos */}
      {Videos.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {Videos.map((video, index) => (
            <button
              key={video.id || index}
              onClick={() => handleVideoSelect(index)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
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

      {/* Manual Play Button as backup */}
      <button
        onClick={() => {
          const videoElement = document.querySelector("video");
          if (videoElement) {
            videoElement.play().catch(console.error);
          }
        }}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
        Force Play Video
      </button>
    </section>
  );
};
