"use client";

import { Clock, Flag, Gauge, Users } from "lucide-react";

export default function StatsBar({ teams = [] }) {
  const safeTeams = teams || [];
  const activeCount = safeTeams.filter((t) => t?.status !== "DQ").length;
  const totalCount = safeTeams.length;

  const stats = [
    {
      icon: Users,
      label: "Teams Active",
      value: `${activeCount} / ${totalCount}`,
    },
    { icon: Flag, label: "Laps Completed", value: "84" },
    { icon: Gauge, label: "Avg Speed", value: "128 km/h" },
    { icon: Clock, label: "Elapsed", value: "02:47:13" },
  ];

  return (
    <footer className="border-t border-glass-border bg-glass/50 backdrop-blur-xl px-4 py-3 md:px-8 md:py-4">
      <div className="flex items-center justify-between gap-4 overflow-x-auto">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2.5 shrink-0">
            <stat.icon className="w-3.5 h-3.5 text-neon" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-mono font-bold tabular-nums text-foreground">
                {stat.value}
              </span>
              <span className="hidden md:inline text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
