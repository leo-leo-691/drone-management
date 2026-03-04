import { Trophy, Timer } from "lucide-react";

function getRankColors(rank) {
  switch (rank) {
    case 1:
      return {
        border: "border-gold/40",
        bg: "bg-gold/[0.06]",
        glow: "shadow-[0_0_20px_rgba(255,215,0,0.12)]",
        badge: "bg-gold text-background",
        text: "text-gold",
      };
    case 2:
      return {
        border: "border-silver/30",
        bg: "bg-silver/[0.04]",
        glow: "shadow-[0_0_16px_rgba(192,192,192,0.08)]",
        badge: "bg-silver text-background",
        text: "text-silver",
      };
    case 3:
      return {
        border: "border-bronze/30",
        bg: "bg-bronze/[0.04]",
        glow: "shadow-[0_0_16px_rgba(205,127,50,0.08)]",
        badge: "bg-bronze text-background",
        text: "text-bronze",
      };
    default:
      return {
        border: "border-glass-border",
        bg: "bg-transparent",
        glow: "",
        badge: "bg-muted text-muted-foreground",
        text: "text-muted-foreground",
      };
  }
}

export default function Leaderboard({ teams = [], rounds = [] }) {
  const publishedRoundIds = rounds.filter((r) => r.published).map((r) => r.id);

  const getEffectiveStats = (team) => {
    let score = 0;
    let time = 0;

    publishedRoundIds.forEach((rid) => {
      score += team.roundDetails?.[rid]?.score || 0;
      time +=
        typeof team.roundDetails?.[rid]?.time === "number"
          ? team.roundDetails?.[rid]?.time
          : 0;
    });

    return { score, time };
  };
  const formatSecondsToMMSS = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const activeTeams = teams.filter(
    (t) =>
      t.status?.toLowerCase() !== "disqualified" &&
      t.status?.toLowerCase() !== "eliminated",
  );
  const disqualifiedTeams = teams.filter(
    (t) => t.status?.toLowerCase() === "disqualified",
  );
  const eliminatedTeams = teams.filter(
    (t) => t.status?.toLowerCase() === "eliminated",
  );

  const sortedActiveTeams = [...activeTeams].sort((a, b) => {
    const statsA = getEffectiveStats(a);
    const statsB = getEffectiveStats(b);

    // 1. Primary: Higher score ranks higher
    const scoreDiff = statsB.score - statsA.score;
    if (scoreDiff !== 0) return scoreDiff;

    // 2. Secondary: Lower time ranks higher
    const aTime = statsA.time || Infinity;
    const bTime = statsB.time || Infinity;

    return aTime - bTime;
  });

  let currentRank = 1;
  const sortedTeams = sortedActiveTeams.map((team, index, array) => {
    const currentStats = getEffectiveStats(team);

    if (index > 0) {
      const prev = array[index - 1];
      const prevStats = getEffectiveStats(prev);

      const isRankEqual =
        prevStats.score === currentStats.score &&
        prevStats.time === currentStats.time;

      if (!isRankEqual) {
        currentRank = index + 1;
      }
    }
    return { ...team, displayRank: currentRank, effectiveStats: currentStats };
  });

  return (
    <section className="flex flex-col gap-4" aria-label="Live leaderboard">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Trophy className="w-4 h-4 text-neon" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Live Rankings
          </h2>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {sortedTeams.length} Teams
        </span>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="flex flex-col gap-3">
        {sortedTeams.slice(0, 3).map((team) => {
          const colors = getRankColors(team.displayRank);
          return (
            <div
              key={team.id}
              className={`group relative overflow-hidden rounded-xl border ${colors.border} ${colors.bg} ${colors.glow} backdrop-blur-xl p-3 transition-all duration-300 hover:scale-[1.01]`}
            >
              {/* Rank Badge + Team Info */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-md ${colors.badge} text-xs font-bold font-mono shrink-0`}
                >
                  {team.displayRank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold truncate ${colors.text}`}>
                      {team.name}
                    </h3>
                    {team.displayRank === 1 && (
                      <Trophy className="w-3.5 h-3.5 text-gold shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    {team.status || "Active"}
                  </p>
                  {team.reEntryCount > 0 && (
                    <p className="text-[9px] font-bold text-neon uppercase tracking-tighter">
                      RE-ENTERED
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-base font-bold font-mono tabular-nums ${colors.text}`}
                  >
                    {team.effectiveStats.score.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">
                    pts
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t border-glass-border">
                {[
                  {
                    score: team.roundDetails?.round1?.score,
                    time: team.roundDetails?.round1?.time,
                    label: "R1",
                    isPublished: publishedRoundIds.includes("round1"),
                  },
                  {
                    score: team.roundDetails?.round2?.score,
                    time: team.roundDetails?.round2?.time,
                    label: "R2",
                    isPublished: publishedRoundIds.includes("round2"),
                  },
                  {
                    score: team.roundDetails?.round3?.score,
                    time: team.roundDetails?.round3?.time,
                    label: "R3",
                    isPublished: publishedRoundIds.includes("round3"),
                  },
                ].map((round, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      {round.label}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {round.isPublished ? round.score || 0 : "--"}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Timer className="w-2.5 h-2.5" />
                      <span className="text-[9px] font-mono">
                        {round.isPublished
                          ? formatSecondsToMMSS(round.time)
                          : "--:--"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Animated border glow on hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    team.displayRank === 1
                      ? "linear-gradient(135deg, rgba(255,215,0,0.05), transparent 60%)"
                      : team.displayRank === 2
                        ? "linear-gradient(135deg, rgba(192,192,192,0.04), transparent 60%)"
                        : "linear-gradient(135deg, rgba(205,127,50,0.04), transparent 60%)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Remaining Teams List */}
      <div className="rounded-xl border border-glass-border bg-glass backdrop-blur-xl overflow-hidden">
        <div className="divide-y divide-glass-border">
          {sortedTeams.slice(3).map((team) => {
            return (
              <div
                key={team.id}
                className="group flex items-center gap-3 px-4 py-3 hover:bg-neon/[0.02] transition-all duration-200"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-xs font-bold font-mono text-muted-foreground shrink-0">
                  {team.displayRank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-foreground truncate">
                      {team.name}
                    </h4>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground flex items-center gap-2">
                    {team.status || "Active"}
                    {team.reEntryCount > 0 && (
                      <span className="text-[8px] font-bold text-neon uppercase tracking-tighter bg-neon/10 px-1 rounded">
                        RE-ENTERED
                      </span>
                    )}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
                  {[
                    {
                      score: team.roundDetails?.round1?.score,
                      time: team.roundDetails?.round1?.time,
                      label: "R1",
                      isPublished: publishedRoundIds.includes("round1"),
                    },
                    {
                      score: team.roundDetails?.round2?.score,
                      time: team.roundDetails?.round2?.time,
                      label: "R2",
                      isPublished: publishedRoundIds.includes("round2"),
                    },
                    {
                      score: team.roundDetails?.round3?.score,
                      time: team.roundDetails?.round3?.score,
                      label: "R3",
                      isPublished: publishedRoundIds.includes("round3"),
                    },
                  ].map((round, idx) => (
                    <div key={idx} className="flex flex-col items-end">
                      <span>
                        {round.label}:{" "}
                        <span className="text-foreground font-semibold">
                          {round.isPublished ? round.score || 0 : "--"}
                        </span>
                      </span>
                      <div className="flex items-center gap-1 opacity-70">
                        <Timer className="w-2 h-2" />
                        <span>
                          {round.isPublished
                            ? formatSecondsToMMSS(round.time)
                            : "--:--"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-bold font-mono tabular-nums text-foreground">
                    {team.effectiveStats.score.toLocaleString()}
                  </p>
                  <p className="text-[8px] font-mono text-muted-foreground uppercase">
                    pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disqualified Teams Section */}
      {disqualifiedTeams.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-destructive">
              Disqualified
            </h3>
            <div className="h-px flex-1 bg-destructive/20" />
          </div>
          <div className="rounded-xl border border-destructive/20 bg-destructive/[0.02] backdrop-blur-xl overflow-hidden">
            <div className="divide-y divide-destructive/10">
              {disqualifiedTeams.map((team) => (
                <div
                  key={team.id}
                  className="group flex items-center gap-3 px-4 py-3 grayscale opacity-60"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-md bg-destructive/10 text-xs font-bold font-mono text-destructive/60 shrink-0">
                    DQ
                  </span>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h4 className="text-xs font-semibold text-muted-foreground truncate">
                      {team.name}
                    </h4>
                    {team.reEntryCount > 0 && (
                      <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-tight">
                        RE-ENTERED
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-mono text-muted-foreground font-bold italic">
                      LOST ELIGIBILITY
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Eliminated Teams Section */}
      {eliminatedTeams.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Eliminated
            </h3>
            <div className="h-px flex-1 bg-glass-border" />
          </div>
          <div className="rounded-xl border border-glass-border bg-glass/20 backdrop-blur-xl overflow-hidden">
            <div className="divide-y divide-glass-border">
              {eliminatedTeams.map((team) => (
                <div
                  key={team.id}
                  className="group flex items-center gap-3 px-4 py-3 opacity-50"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-md bg-muted text-xs font-bold font-mono text-muted-foreground shrink-0">
                    EL
                  </span>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h4 className="text-xs font-semibold text-muted-foreground truncate">
                      {team.name}
                    </h4>
                    {team.reEntryCount > 0 && (
                      <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-tight">
                        RE-ENTERED
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-mono text-muted-foreground font-bold italic">
                      OUT OF COMP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gold" />
          <span className="text-[10px] font-mono text-muted-foreground">
            1st Place
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-silver" />
          <span className="text-[10px] font-mono text-muted-foreground">
            2nd Place
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-bronze" />
          <span className="text-[10px] font-mono text-muted-foreground">
            3rd Place
          </span>
        </div>
      </div>
    </section>
  );
}
