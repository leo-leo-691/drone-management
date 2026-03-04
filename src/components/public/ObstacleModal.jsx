import { X, Radio, Activity } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ObstacleModal({ obstacle, onClose }) {
  if (!obstacle) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300",
        obstacle
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
    >
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-glass border border-neon/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.2)] animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-neon/20 border border-white/10 hover:border-neon text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="relative aspect-video bg-black/40 border-b border-glass-border">
            {obstacle.imageURL ? (
              <img
                src={obstacle.imageURL}
                alt={obstacle.name}
                className="w-full max-h-[40vh] object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <Radio className="w-20 h-20 text-neon" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black to-transparent">
              <h3 className="text-lg md:text-2xl font-black italic tracking-tighter text-white uppercase">
                {obstacle.name}
              </h3>
            </div>
          </div>

          <div className="p-4 md:p-8 flex flex-col gap-3 md:gap-6">
            {/* Row 1: Reward (Full Width) */}
            <div className="flex flex-col gap-1 md:gap-2 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/20 transition-colors group">
              <p className="text-[10px] md:text-xs font-mono font-bold text-muted-foreground group-hover:text-green-400 uppercase tracking-widest text-center">
                Reward Points
              </p>
              <p className="text-3xl md:text-4xl font-black text-green-400 text-center drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                +{obstacle.maxPoints}
              </p>
            </div>

            {/* Row 2: Penalties (Split View) */}
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              <div className="flex flex-col gap-1 md:gap-2 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-colors group">
                <p className="text-[8px] md:text-[10px] font-mono font-bold text-muted-foreground group-hover:text-amber-400 uppercase tracking-widest text-center text-nowrap">
                  Touch Penalty
                </p>
                <p className="text-xl md:text-3xl font-black text-amber-500 text-center">
                  -{obstacle.touchPenalty}
                </p>
              </div>
              <div className="flex flex-col gap-1 md:gap-2 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/20 transition-colors group">
                <p className="text-[8px] md:text-[10px] font-mono font-bold text-muted-foreground group-hover:text-red-400 uppercase tracking-widest text-center text-nowrap">
                  Crash Penalty
                </p>
                <p className="text-xl md:text-3xl font-black text-red-500 text-center">
                  -{obstacle.crashPenalty}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 pb-4 md:pb-8 flex items-center gap-2 md:gap-3">
            <Activity className="w-3 h-3 md:w-4 md:h-4 text-neon animate-pulse-neon" />
            <p className="text-[8px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Real-time telemetry updated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
