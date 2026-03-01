import { Activity, Radio, Wifi, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { logoLightNoBg, collegeLogo } from "../../assets/index.js";
import ObstacleModal from "./ObstacleModal.jsx";
import RoundObstaclesList from "./RoundObstaclesList.jsx";

export default function Header({ rounds = [] }) {
  const visibleRounds = rounds.filter((r) => r.visible);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedObstacle, setSelectedObstacle] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Global UI State Management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
        setSelectedObstacle(null);
      }
    };
    if (isDrawerOpen || selectedObstacle) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen, selectedObstacle]);

  return (
    <>
      <header className="relative z-10 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 border-b border-glass-border bg-glass backdrop-blur-xl">
        {/* Left: Logo + Branding + Hamburger */}
        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-all text-muted-foreground hover:text-neon active:scale-95"
            aria-label="Open competition rounds"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <Link
            to="/"
            className="flex items-center gap-3 md:gap-4 group hover:opacity-80 transition-opacity"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-neon/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-glass border border-white/10 shadow-2xl">
                <img
                  src={logoLightNoBg}
                  alt="logo"
                  className="h-8 w-8 md:h-10 md:w-10 object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h1 className="text-base md:text-2xl font-black tracking-tighter italic leading-none text-white whitespace-nowrap uppercase">
                DRONE<span className="text-neon">O</span>MANIA
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-px w-3 md:w-6 bg-neon/50"></span>
                <p className="text-[8px] md:text-[10px] font-mono font-bold text-muted-foreground tracking-[0.2em] uppercase">
                  Ambiora'26
                </p>
              </div>
            </div>
          </Link>

          <div className="hidden sm:block h-10 w-0.5 bg-glass-border opacity-100"></div>

          <div className="hidden md:flex items-center gap-3">
            <img
              src={collegeLogo}
              alt="nmims logo"
              className="h-10 md:h-12 border border-white/5 rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Right: Status Indicators */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-destructive/30 bg-destructive/10">
            <Radio className="w-3 h-3 text-destructive animate-pulse" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-destructive">
              Live
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <Wifi className="w-4 h-4 text-neon" />
            <span className="text-xs font-mono">12ms</span>
          </div>
          <div className="hidden md:block text-xs font-mono text-muted-foreground tabular-nums">
            {formatTime(currentTime)}
          </div>
        </div>
      </header>

      {/* Detail Modal Component */}
      <ObstacleModal
        obstacle={selectedObstacle}
        onClose={() => setSelectedObstacle(null)}
      />

      {/* Drawer Implementation */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity duration-500",
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsDrawerOpen(false)}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[320px] sm:w-[450px] bg-[#050a0f]/95 border-r border-neon/20 shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out transform flex flex-col",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="absolute top-0 right-0 w-1 h-full bg-linear-to-b from-transparent via-neon/20 to-transparent" />

        <div className="flex items-center justify-between p-6 md:p-8 border-b border-glass-border">
          <div className="flex flex-col">
            <h2 className="text-neon text-xl md:text-2xl font-black tracking-tighter italic uppercase leading-tight">
              MISSION<span className="text-white ml-2">BRIEFS</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-neon animate-pulse-neon" />
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                Round Configurations
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="group p-2 rounded-xl bg-white/5 hover:bg-neon/10 border border-white/5 hover:border-neon/30 transition-all duration-300 text-muted-foreground hover:text-neon"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          <div className="flex flex-col gap-8">
            {visibleRounds.length > 0 ? (
              visibleRounds.map((round) => (
                <RoundObstaclesList
                  key={round.id}
                  round={round}
                  onObstacleClick={setSelectedObstacle}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <Activity className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-sm font-mono font-bold uppercase tracking-widest">
                  No Mission Data Available
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Waiting for admin to publish rounds...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-glass-border bg-black/20">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
            <span>Terminal: NMIMS_SHP_01</span>
            <span className="text-neon/50">v2.4.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
