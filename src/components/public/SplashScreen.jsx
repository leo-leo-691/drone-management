import { useEffect, useState } from "react";
import logo from "../../assets/logo-light-no-bg.png";

const SplashScreen = ({ finishLoading, dataLoaded }) => {
  const [loadingText, setLoadingText] = useState("Initializing Systems");
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const texts = [
      "Calibrating Avionics...",
      "Syncing Hive Mind...",
      "Arming Propulsion...",
      "Ready for Takeoff",
    ];

    let textIdx = 0;
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        const next = texts[textIdx];
        textIdx = (textIdx + 1) % texts.length;
        return next;
      });
    }, 700);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setAnimationFinished(true);
          return 100;
        }
        // Speed up slightly if data is already loaded
        const increment = dataLoaded ? 2 : 1;
        return Math.min(100, prev + increment);
      });
    }, 25);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [dataLoaded]);

  useEffect(() => {
    if (animationFinished && dataLoaded && !isExiting) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(finishLoading, 800);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [animationFinished, dataLoaded, isExiting, finishLoading]);

  return (
    <div
      className={`fixed inset-0 z-9999 bg-[#050a0f] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        isExiting
          ? "opacity-0 scale-105 blur-2xl"
          : "opacity-100 scale-100 blur-0"
      }`}
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/10 blur-[150px] rounded-full animate-pulse-neon" />

      {/* Corner Accents */}
      <div className="absolute top-12 left-12 w-24 h-24 border-t-2 border-l-2 border-neon/30 opacity-20" />
      <div className="absolute top-12 right-12 w-24 h-24 border-t-2 border-r-2 border-neon/30 opacity-20" />
      <div className="absolute bottom-12 left-12 w-24 h-24 border-b-2 border-l-2 border-neon/30 opacity-20" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-b-2 border-r-2 border-neon/30 opacity-20" />

      {/* Logo Container */}
      <div className="relative h-48 md:h-64 aspect-square flex items-center justify-center">
        {/* Construction Lines */}
        {!isExiting && progress < 40 && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-0 left-0 h-px w-full bg-neon animate-line-h" />
            <div className="absolute top-1/4 left-0 h-px w-full bg-neon/30 animate-line-h [animation-delay:0.1s]" />
            <div className="absolute top-2/4 left-0 h-px w-full bg-neon/30 animate-line-h [animation-delay:0.2s]" />
            <div className="absolute top-3/4 left-0 h-px w-full bg-neon/30 animate-line-h [animation-delay:0.3s]" />
            <div className="absolute top-0 left-0 w-px h-full bg-neon animate-line-v shadow-[0_0_10px_#00f0ff]" />
            <div className="absolute top-0 left-1/4 w-px h-full bg-neon/30 animate-line-v [animation-delay:0.15s]" />
            <div className="absolute top-0 left-2/4 w-px h-full bg-neon/30 animate-line-v [animation-delay:0.25s]" />
            <div className="absolute top-0 left-3/4 w-px h-full bg-neon/30 animate-line-v [animation-delay:0.35s]" />
          </div>
        )}

        {/* The Logo Display */}
        <div className="relative group">
          <div className="absolute -inset-12 bg-neon/20 blur-3xl opacity-50 transition-opacity duration-1000 animate-pulse" />

          {/* Regular Logo - Hide during disassemble */}
          {!isExiting && (
            <img
              src={logo}
              alt="Logo"
              className={`w-48 md:w-64 h-auto relative z-10 animate-float drop-shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-opacity duration-500 ${
                progress > 15 ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Disassembling Logo Layers */}
          {isExiting && (
            <div className="relative w-48 md:w-64 aspect-square z-10">
              <img
                src={logo}
                alt=""
                className="absolute inset-0 w-full h-auto animate-dis-tl [clip-path:inset(0_50%_50%_0)]"
              />
              <img
                src={logo}
                alt=""
                className="absolute inset-0 w-full h-auto animate-dis-tr [clip-path:inset(0_0_50%_50%)]"
              />
              <img
                src={logo}
                alt=""
                className="absolute inset-0 w-full h-auto animate-dis-bl [clip-path:inset(50%_50%_0_0)]"
              />
              <img
                src={logo}
                alt=""
                className="absolute inset-0 w-full h-auto animate-dis-br [clip-path:inset(50%_0_0_50%)]"
              />

              {/* Digital Glitch/Spark Effects during disassembly */}
              <div className="absolute inset-0 bg-neon/20 mix-blend-overlay animate-pulse" />
            </div>
          )}

          {/* Scanning Effect Overlay */}
          {!isExiting && progress > 25 && (
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-3xl opacity-60">
              <div className="w-full h-1 bg-neon/60 shadow-[0_0_15px_rgba(0,240,255,0.8)] animate-scan-line" />
            </div>
          )}
        </div>
      </div>

      {/* Loading Info */}
      <div className="mt-20 flex flex-col items-center gap-6 w-72 md:w-80 relative z-10">
        <div className="flex justify-between items-end w-full">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-neon uppercase tracking-[0.3em]">
              {loadingText}
            </span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-neon rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
          <span className="text-xl font-black italic tracking-tighter text-neon font-mono">
            {progress}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-px">
          <div
            className="h-full bg-linear-to-r from-neon/40 via-neon to-neon/40 shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tactical Decals */}
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-white/10" />
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-1 w-4 rounded-xs transition-all duration-500 ${
                  progress > (i + 1) * 20
                    ? "bg-neon shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                    : "bg-white/5"
                }`}
              />
            ))}
          </div>
          <div className="h-px w-8 bg-white/10" />
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-linear-to-r from-transparent to-white/10" />
          <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-[1em] whitespace-nowrap">
            Hyperion OS v4.0.2
          </span>
          <div className="h-px w-12 bg-linear-to-l from-transparent to-white/10" />
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-mono text-white/10 uppercase">
              Lat-A
            </span>
            <span className="text-[8px] font-mono text-neon/40 font-bold">
              40.7128° N
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[7px] font-mono text-white/10 uppercase">
              Long-B
            </span>
            <span className="text-[8px] font-mono text-neon/40 font-bold">
              74.0060° W
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
