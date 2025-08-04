import { Play, Info, Circle } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative w-full h-[810px] rounded-3xl overflow-hidden">
      <div
        className="absolute   inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('images/heroImages/monsters.jpg')",
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/30"></div>

      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Monsters, INC.
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
              </div>

              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">
                Animated film that explores the world of Monstropolis, where
                monsters generate their city's power by scaring children at
                night.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  <Play className="w-6 h-6 fill-current" />
                  Watch Now
                </button>

                <button className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                  <Info className="w-6 h-6" />
                  Details
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-current text-red-500" />
                  <span>HD</span>
                </div>
                <span>2001</span>
                <span>Animation</span>
                <span>1h 32m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>

      <div className="absolute top-8 right-8 flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-white/60 text-sm">LIVE</span>
      </div>
    </div>
  );
}
