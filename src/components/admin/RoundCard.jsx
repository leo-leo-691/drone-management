import { useState } from "react";
import { updateRoundStatus } from "../../services/db";
import ObstacleManager from "./ObstacleManager";
import { ChevronDown, ChevronUp, Eye, EyeOff, Send, Lock } from "lucide-react";

export default function RoundCard({ round }) {
  const [expanded, setExpanded] = useState(false);

  const toggleVisibility = async (e) => {
    e.stopPropagation();
    await updateRoundStatus(round.id, { visible: !round.visible });
  };

  const togglePublished = async (e) => {
    e.stopPropagation();
    if (
      confirm(
        `Are you sure you want to ${round.published ? "UNPUBLISH" : "PUBLISH"} ${round.title} results?`,
      )
    ) {
      await updateRoundStatus(round.id, { published: !round.published });
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-glass border border-glass-border backdrop-blur-xl transition-all duration-500 hover:border-neon/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.05)] mb-6">
      {/* Decorative scanline on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div
        className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 md:p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div
            className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl border transition-all duration-500 shrink-0 ${
              round.visible
                ? "bg-neon/10 border-neon/30 text-neon shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                : "bg-white/5 border-white/10 text-muted-foreground"
            }`}
          >
            {round.visible ? (
              <Eye size={18} className="md:w-[22px] md:h-[22px]" />
            ) : (
              <EyeOff size={18} className="md:w-[22px] md:h-[22px]" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-black italic tracking-tighter text-white uppercase leading-none">
              {round.title}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${round.visible ? "bg-neon animate-pulse" : "bg-muted-foreground"}`}
                />
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-widest ${round.visible ? "text-neon" : "text-muted-foreground"}`}
                >
                  {round.visible ? "System Online" : "System Offline"}
                </span>
              </div>
              <span className="text-white/10 text-xs text-muted-foreground">
                •
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${round.published ? "bg-gold animate-pulse" : "bg-muted-foreground"}`}
                />
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-widest ${round.published ? "text-gold" : "text-muted-foreground"}`}
                >
                  {round.published ? "Data Published" : "Data Restricted"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={toggleVisibility}
            className={`flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
              round.visible
                ? "border-neon/30 text-neon hover:bg-neon/10"
                : "border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
            }`}
          >
            {round.visible ? "Deactivate" : "Activate"}
          </button>

          <button
            onClick={togglePublished}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-1.5 md:px-5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
              round.published
                ? "bg-gold/10 border-gold/30 text-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                : "border-white/10 text-muted-foreground hover:text-gold hover:bg-gold/5"
            }`}
          >
            <Send size={12} className="md:w-3.5 md:h-3.5" />
            {round.published ? "Published" : "Publish"}
          </button>

          <div
            className={`ml-2 text-muted-foreground transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          >
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Expanded Content with slide animation */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 border-t border-glass-border bg-black/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-neon/10" />
            <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.3em]">
              Obstacle Configuration Matrix
            </h4>
            <div className="h-px flex-1 bg-neon/10" />
          </div>
          <ObstacleManager roundId={round.id} />
        </div>
      </div>
    </div>
  );
}
