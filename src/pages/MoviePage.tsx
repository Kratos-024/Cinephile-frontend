import { motion } from "framer-motion";
import { NavBar } from "../components/NavBar";
import { Menu } from "../components/Menu"; // Fixed: Import your Menu component, not from lucide-react
import { useState } from "react";
export const VideoPlayer = () => {
  return (
    <section className="flex justify-center items-center  px-4">
      <div className="w-full h-[550px] spect-video rounded-2xl overflow-hidden shadow-lg border border-gray-700">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/xOsLIiBStEs"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

const MovieDetails = () => {
  const [activeTab, setActiveTab] = useState("subscription");
  const [selectedLanguage, setSelectedLanguage] = useState("Tamil");

  const tabs = [
    { id: "subscription", label: "Subscription" },
    { id: "buy", label: "Buy" },
    { id: "bestprice", label: "Best price" },
    { id: "rent", label: "Rent" },
    { id: "free", label: "Free" },
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

  const languages = ["தமிழ்", "English", "తెలుగు", "हिन्दी"];

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

  const castMembers = [
    {
      name: "Pete Docter",
      role: "Director",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    },
    {
      name: "Lacara Jones",
      role: "Masayaru Futaki",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b512c60a?w=50&h=50&fit=crop&crop=face",
    },
    {
      name: "Nout Golstein",
      role: "Lizzie Rose",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    },
    {
      name: "Sari Anand",
      role: "Griet Solaren",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    },
  ];

  return (
    <div className=" bg-gradient-to-b from-[#110c25]/90 via-[#0b0818]/95 to-[#0b0818] text-white p-6">
      <div className="w-full mx-auto">
        <div className="flex  flex-col w-full">
          {" "}
          <VideoPlayer />
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
                {/* Movie Info */}
                <div className="flex-1 space-y-6">
                  {/* Streaming Services */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Streaming Services
                    </h3>
                    <div className="flex space-x-4">
                      {streamingServices.map((service, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mb-2 relative`}
                          >
                            {service.isIcon ? (
                              <i className={`${service.icon} text-white`}></i>
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

                  {/* Movie Title and Details */}
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">
                        Soul{" "}
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded text-lg">
                          13+
                        </span>
                      </h1>
                      <p className="text-gray-400">
                        2020 • Family/Comedy • 1h 47m
                      </p>
                    </div>

                    {/* Available Languages */}
                    <div>
                      <h4 className="font-semibold mb-2">
                        Available Languages:
                      </h4>
                      <div className="flex space-x-3">
                        {languages.map((lang, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 px-3 py-1 rounded text-sm"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="flex space-x-8">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                            IMDb
                          </span>
                          <span className="text-3xl font-bold">9.2</span>
                        </div>
                        <p className="text-gray-400 text-sm">IMDb Rating</p>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <i className="fas fa-play text-red-500"></i>
                          <span className="text-3xl font-bold">96%</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Way2watch Rating
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-4 space-y-8">
              {/* Language Selector */}
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

              {/* Actions */}
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

              {/* Cast & Crew */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Cast & Crew</h3>
                  <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                    View 15+ more
                  </button>
                </div>
                <div className="space-y-4">
                  {castMembers.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-gray-400 text-xs">{member.role}</p>
                        <p className="text-white text-sm font-medium">
                          {member.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Synopsis Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Synopsis</h3>
          <p className="text-gray-400 leading-relaxed max-w-4xl">
            Joe is a middle-school band teacher whose life hasn't quite gone the
            way he expected. His true passion is jazz -- and he's good. But when
            he travels to another realm to help someone find their passion, he
            soon discovers what it means to have soul.
          </p>
        </div>
      </div>
    </div>
  );
};

export const MoviePage = () => {
  const [menu, setMenu] = useState(true);
  const menuHandler = () => {
    setMenu(!menu);
  };

  return (
    <>
      <div
        className="fixed inset-0 h-full w-full
         bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg')",
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
            <MovieDetails />
          </div>
        </div>
      </motion.section>
    </>
  );
};
