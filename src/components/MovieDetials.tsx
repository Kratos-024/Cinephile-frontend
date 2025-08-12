import { useState } from "react";
import type { ApiMovieResponse } from "../services/movie.service";
import { VideoPlayer } from "./MovieVideo";
import { CommentSection, type commentType } from "./CommentSection";

export const MovieDetails = ({
  movieData,
}: {
  movieData: ApiMovieResponse["data"];
}) => {
  const [activeTab, setActiveTab] = useState("Info");
  const [selectedLanguage, setSelectedLanguage] = useState("Tamil");
  const [reviews, setReview] = useState<commentType[]>([
    { title: "", comment: "", rating: 0, photoURL: "", displayName: "" },
  ]);

  const onReviewhandler = ({
    title,
    comment,
    rating,
    photoURL,
    displayName,
  }: commentType) => {
    setReview([
      ...reviews,
      {
        title: title,
        comment: comment,
        rating: rating,
        photoURL: photoURL,
        displayName,
      },
    ]);
  };
  const tabs = [
    { id: "Info", label: "Info" },
    { id: "Reviews", label: "Reviews" },
    { id: "Images", label: "Images" },
  ];

  const streamingServices = [
    { name: "Netflix", icon: "N", color: "bg-red-600" },
    { name: "Prime", icon: "P", color: "bg-blue-500", badge: "HD" },
    { name: "Hotstar", icon: "H", color: "bg-orange-500", badge: "UHD" },
    {
      name: "Youtube",
      icon: "fab fa-youtube",
      color: "bg-red-500",
      isIcon: true,
    },
  ];

  const actions = [
    {
      id: "like",
      icon: "fas fa-thumbs-up",
      label: "Like",
      color: "bg-blue-600",
    },
    { id: "share", icon: "fas fa-share", label: "Share", color: "bg-gray-700" },
    {
      id: "watchlist",
      icon: "fas fa-bookmark",
      label: "Watchlist",
      color: "bg-gray-700",
    },
    { id: "seen", icon: "fas fa-eye", label: "Seen?", color: "bg-gray-700" },
  ];

  return (
    <div className="bg-gradient-to-b from-[#110c25]/90 via-[#0b0818]/95 to-[#0b0818] text-white p-6">
      <div className="w-full mx-auto">
        <div className="flex flex-col w-full">
          <VideoPlayer Videos={movieData.videoSources || []} />

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-8">
              <div className="flex space-x-8 border-b border-gray-700 pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 transition-colors ${
                      activeTab === tab.id
                        ? "text-white border-b-2 border-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex space-x-8">
                <div className="flex-1 space-y-6">
                  {activeTab === "Info" && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Streaming Services
                        </h3>
                        <div className="flex space-x-4">
                          {streamingServices.map((service, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center"
                            >
                              <div
                                className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mb-2 relative`}
                              >
                                {service.isIcon ? (
                                  <i
                                    className={`${service.icon} text-white`}
                                  ></i>
                                ) : (
                                  <span className="text-white font-bold text-xs">
                                    {service.icon}
                                  </span>
                                )}
                                {service.badge && (
                                  <span className="absolute -top-2 -right-2 bg-green-500 text-xs px-1 rounded">
                                    {service.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">
                                {service.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className=" flex gap-3 items-center">
                            {" "}
                            <h1 className="text-4xl font-bold mb-2">
                              {movieData.title}
                            </h1>
                            <p
                              className="bg-yellow-500 font-bold
                             text-black px-2   py-1 rounded
                             text-lg"
                            >
                              {movieData.Rated}
                            </p>
                          </div>

                          <p className="text-gray-400">
                            {movieData.Released} • {movieData.genre} •{" "}
                            {movieData.Runtime}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">
                            Available Languages:
                          </h4>
                          <div className="flex space-x-3">
                            <span className="bg-gray-700 px-3 py-1 rounded text-sm">
                              {movieData.Language}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-8">
                          {movieData.rating.map(
                            (
                              rating: { Source: string; Value: string },
                              index: number
                            ) => {
                              let logoSrc = "";

                              if (rating.Source === "Internet Movie Database") {
                                logoSrc = "/images/logo/imdb.png";
                              } else if (rating.Source === "Rotten Tomatoes") {
                                logoSrc = "/images/logo/rotten.png";
                              } else if (rating.Source === "Metacritic") {
                                logoSrc = "/images/logo/metacritic.png";
                              }

                              return (
                                <div
                                  key={index}
                                  className="flex items-center space-x-3"
                                >
                                  <img
                                    src={logoSrc}
                                    alt={rating.Source}
                                    className="w-8 h-7"
                                  />
                                  <span>{rating.Value}</span>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "Images" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Movie Images
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {movieData.images && movieData.images.length > 0 ? (
                          movieData.images.map((image, index) => (
                            <img
                              key={index}
                              src={image.src}
                              alt={image.alt || `Movie image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1489599511985-c1b6c27e3e1b?w=400&h=300&fit=crop";
                              }}
                            />
                          ))
                        ) : (
                          <p className="text-gray-400 col-span-2">
                            No images available
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "Reviews" && (
                    <div className="max-w-4xl mx-auto p-6">
                      <CommentSection onHandler={onReviewhandler} />

                      <div className="space-y-6 mt-8">
                        {reviews.map((review: commentType, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-sm 
                   border border-gray-700/50 p-6 rounded-xl shadow-lg 
                   hover:shadow-xl transition-all duration-300 
                   hover:border-gray-600/50 group"
                          >
                            <div className="flex items-start gap-4 mb-4">
                              <div className="relative flex-shrink-0">
                                <img
                                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-600/50
                         group-hover:border-gray-500/70 transition-colors duration-300"
                                  src={review.photoURL || "/default-avatar.png"}
                                  alt={`${review.displayName}'s avatar`}
                                />
                                <div
                                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 
                            rounded-full border-2 border-gray-800"
                                ></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-white text-lg">
                                      {review.displayName}
                                    </h4>
                                    <span className="text-gray-400 text-sm">
                                      @
                                      {review.displayName
                                        .toLowerCase()
                                        .replace(/\s+/g, "")}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <span
                                        key={i}
                                        className={`text-lg transition-colors duration-200 ${
                                          i < review.rating
                                            ? "text-yellow-400 drop-shadow-sm"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium text-gray-300">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="ml-16">
                              {review.title && (
                                <h5 className="font-medium text-gray-200 mb-3 text-lg leading-relaxed">
                                  "{review.title}"
                                </h5>
                              )}

                              <p className="text-gray-300 leading-relaxed text-base">
                                {review.comment}
                              </p>
                              {/* 
                              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-700/30">
                                <button
                                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 
                               transition-colors duration-200 text-sm"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 11v9m4-10H7m7 0h1m-1 0h1m-1 0V5a2 2 0 00-2-2h-.095"
                                    />
                                  </svg>
                                  Helpful
                                </button>

                                <button
                                  className="flex items-center gap-2 text-gray-400 hover:text-red-400 
                               transition-colors duration-200 text-sm"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  Report
                                </button>
                              </div> */}
                            </div>
                          </div>
                        ))}

                        {/* Empty state */}
                        {reviews.length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-300 mb-2">
                              No reviews yet
                            </h3>
                            <p className="text-gray-500">
                              Be the first to share your thoughts!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-4 space-y-8">
              <div className="text-right">
                <p className="text-gray-400">
                  Language:
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="text-white bg-transparent ml-2 border-none outline-none"
                  >
                    <option value="Tamil" className="bg-gray-800">
                      Tamil
                    </option>
                    <option value="English" className="bg-gray-800">
                      English
                    </option>
                    <option value="Hindi" className="bg-gray-800">
                      Hindi
                    </option>
                    <option value="Telugu" className="bg-gray-800">
                      Telugu
                    </option>
                  </select>
                  <i className="fas fa-chevron-down ml-1"></i>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Actions</h3>
                <div className="flex space-x-4">
                  {actions.map((action) => (
                    <button
                      key={action.id}
                      className="flex flex-col items-center space-y-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <div
                        className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center transition-colors`}
                      >
                        <i className={action.icon}></i>
                      </div>
                      <span className="text-xs">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Cast & Crew</h3>
                  {movieData.cast && movieData.cast.length > 4 && (
                    <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                      View {movieData.cast.length - 4}+ more
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {movieData.cast && movieData.cast.length > 0 ? (
                    movieData.cast.slice(0, 4).map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={
                            member.imageUrl ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                          }
                          alt={member.actorName}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face";
                          }}
                        />
                        <div>
                          <p className="text-gray-400 text-xs">
                            {member.characterName || "Character"}
                          </p>
                          <p className="text-white text-sm font-medium">
                            {member.actorName || "Actor"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Cast information not available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
          <p className="text-gray-400 leading-relaxed max-w-4xl">
            {movieData.storyLine}
          </p>
        </div>
      </div>
    </div>
  );
};
