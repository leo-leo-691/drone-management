import { useState, useEffect } from "react";
import { subscribeEvents, subscribeArenaSettings } from "../../services/db";
import { ArenaCam } from "../index.js";

export default function ArenaPanel({ teams = [] }) {
  const [events, setEvents] = useState([]);
  const [arenaSettings, setArenaSettings] = useState({ trackTemp: "22" });

  useEffect(() => {
    // Subscribe to events
    const unsubEvents = subscribeEvents((allEvents) => {
      setEvents(allEvents);
    });

    // Subscribe to arena settings (temp)
    const unsubSettings = subscribeArenaSettings(setArenaSettings);

    return () => {
      unsubEvents();
      unsubSettings();
    };
  }, []);

  // Count active teams (not disqualified)
  const activeCount = (teams || []).filter(
    (t) => t?.status !== "Disqualified" && t?.status !== "Eliminated",
  ).length;

  const arenaStats = [
    { label: "Active Drones", value: `${activeCount}` },
    { label: "Track Temp", value: `${arenaSettings.trackTemp}°C` },
  ];

  return (
    <section
      className="flex flex-col gap-4 md:gap-5"
      aria-label="Arena preview"
    >
      {/* Arena Preview Card */}

      <ArenaCam />
      {/* Arena Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {arenaStats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-lg border border-glass-border bg-glass backdrop-blur-xl p-3 md:p-4 group hover:border-neon/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/3 transition-colors duration-300" />
            <p className="relative text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="relative text-lg md:text-xl font-bold font-mono text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Event Log */}
      <div className="rounded-xl border border-glass-border bg-glass backdrop-blur-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Event Log
          </h3>
          <span className="text-[10px] font-mono text-neon animate-pulse-neon">
            Live Stream
          </span>
        </div>
        <div className="divide-y divide-glass-border max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-neon/20 scrollbar-track-transparent">
          {events.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-neon/2 transition-colors duration-200"
            >
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums whitespace-nowrap pt-0.5">
                {entry.time}
              </span>
              <span
                className={`text-xs font-mono leading-relaxed ${entry.type === "highlight"
                  ? "text-neon"
                  : entry.type === "warning"
                    ? "text-gold"
                    : "text-muted-foreground"
                  }`}
              >
                {entry.event}
              </span>
            </div>
          ))}
          {events.length === 0 && (
            <div className="p-8 text-center opacity-30">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest">
                Waiting for mission data...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
