import { useState, useEffect } from "react";
import { Radio } from "lucide-react";
import { subscribeObstacles } from "../../services/db";

export default function RoundObstaclesList({ round, onObstacleClick }) {
  const [obstacles, setObstacles] = useState([]);

  useEffect(() => {
    const unsub = subscribeObstacles(round.id, setObstacles);
    return () => unsub();
  }, [round.id]);

  return (
    <div className="flex flex-col gap-4 group">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-black italic tracking-tight text-white uppercase flex-1">
          {round.title}
        </h3>
        <div className="h-px bg-gradient-to-r from-neon/50 to-transparent flex-[2]" />
      </div>

      {obstacles.length > 0 ? (
        <div className="grid gap-3">
          {obstacles.map((obs) => (
            <div
              key={obs.id}
              onClick={() => onObstacleClick(obs)}
              className="relative group/item flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-neon/20 hover:bg-neon/5 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover/item:bg-neon/10 transition-colors" />

              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black/40 group-hover/item:border-neon/30 transition-colors">
                {obs.imageURL ? (
                  <img
                    src={obs.imageURL}
                    alt={obs.name}
                    className="w-full h-full object-cover opacity-70 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/20">
                    <Radio className="w-5 h-5 text-muted-foreground opacity-30" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 relative">
                <p className="text-xs font-black uppercase tracking-wide text-foreground group-hover/item:text-neon transition-colors truncate">
                  {obs.name}
                </p>
                <div className="flex items-center gap-3 mt-1.5 font-mono text-[9px] font-bold">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/10">
                    <span className="opacity-50">PTS</span>
                    <span>+{obs.maxPoints}</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/10">
                    <span className="opacity-50">TCH</span>
                    <span>-{obs.touchPenalty}</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/10">
                    <span className="opacity-50">CRS</span>
                    <span>-{obs.crashPenalty}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-white/10 text-center">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
            Awaiting Layout Config...
          </p>
        </div>
      )}
    </div>
  );
}
