import { useState } from "react";
import { addTeam, updateTeam, deleteTeam } from "../../services/db";
import ScoreModal from "./ScoreModal";
import ReEntryPanel from "./ReEntryPanel";
import { UserPlus, Trash2, RotateCcw, Timer } from "lucide-react";

export default function TeamManager({ teams }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [scoringTeam, setScoringTeam] = useState(null); // { team, roundId }
  const [reEntryTeam, setReEntryTeam] = useState(null); // Team selected for re-entry

  const formatSecondsToMMSS = (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds))
      return seconds || "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    await addTeam(newTeamName);
    setNewTeamName("");
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this team?")) {
      await deleteTeam(id);
    }
  };

  const handleStatusChange = async (team, newStatus) => {
    await updateTeam(team.id, { status: newStatus });
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 md:mb-10 pb-6 border-b border-white/5">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon/10 border border-neon/20 text-neon">
              <UserPlus size={18} />
            </div>
            Squad Repository
          </h3>
          <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">
            Managing {teams.length} registered flight crews
          </p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`group relative overflow-hidden px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${showAdd
            ? "bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20"
            : "bg-neon text-background shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:scale-105 active:scale-95"
            }`}
        >
          <span className="relative z-10">
            {showAdd ? "Abort Command" : "Initiate New Squad"}
          </span>
          {!showAdd && (
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
          )}
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAddTeam}
          className="relative overflow-hidden bg-black/40 p-6 rounded-2xl border border-neon/20 mb-10 flex gap-3 animate-in fade-in slide-in-from-top-4 duration-500"
        >
          {/* Decorative scanline */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(0,240,255,1)_1px,transparent_1px)] bg-[length:100%_4px]" />

          <input
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Input Squad Designation..."
            className="flex-1 bg-white/[0.03] border border-white/10 p-3 rounded-xl text-white placeholder:text-muted-foreground/50 focus:border-neon focus:ring-1 ring-neon/50 outline-none transition-all font-mono text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="px-8 py-3 bg-neon text-background font-black uppercase tracking-tighter italic rounded-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Confirm
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`group relative flex flex-col gap-6 p-6 rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${team.status === "Disqualified"
              ? "border-destructive/30 bg-destructive/[0.02] hover:border-destructive/50"
              : "border-glass-border bg-white/[0.02] hover:border-neon/30"
              }`}
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-base md:text-lg font-black italic tracking-tighter text-white uppercase truncate">
                    {team.name}
                  </h4>
                  {team.reEntryCount > 0 && (
                    <div className="px-2 py-0.5 rounded-md bg-gold/10 border border-gold/30 text-[8px] font-black text-gold uppercase tracking-[0.1em] animate-pulse">
                      RE-ENTERED
                    </div>
                  )}
                </div>

                <div className="relative inline-block text-black">
                  <select
                    value={team.status}
                    onChange={(e) => handleStatusChange(team, e.target.value)}
                    className={`appearance-none text-[9px] font-black tracking-[0.2em] px-3 py-1.5 rounded-lg border transition-all duration-300 cursor-pointer outline-none ${team.status === "Active"
                      ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]"
                      : team.status === "Disqualified"
                        ? "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20 shadow-[0_0_10px_rgba(255,61,90,0.1)]"
                        : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
                      }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Eliminated">Eliminated</option>
                    <option value="Disqualified">Disqualified</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-2xl font-black italic tracking-tighter text-gold tabular-nums leading-none">
                  {team.totalScore || 0}
                </div>
                <div className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  Total Score
                </div>
              </div>
            </div>

            {/* Matrix Data Grid */}
            <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-xl border border-white/5">
              {["round1", "round2", "round3"].map((rid, idx) => (
                <div
                  key={rid}
                  className="flex flex-col items-center gap-1.5 py-1"
                >
                  <span className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                    Round {idx + 1}
                  </span>
                  <span
                    className={`text-sm font-black tracking-tighter italic ${team.roundDetails?.[rid]?.score < 0 ? "text-destructive" : "text-white"}`}
                  >
                    {team.roundDetails?.[rid]?.score || 0}
                  </span>
                  <div className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground/60">
                    <Timer size={8} />
                    {formatSecondsToMMSS(team.roundDetails?.[rid]?.time)}
                  </div>
                </div>
              ))}
            </div>

            {/* Operational Controls */}
            <div className="flex flex-col gap-3 mt-auto">
              <div className="grid grid-cols-3 gap-2">
                {["1", "2", "3"].map((r) => (
                  <button
                    key={r}
                    onClick={() =>
                      setScoringTeam({ teamId: team.id, roundId: `round${r}` })
                    }
                    className="group/btn relative px-2 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-neon hover:border-neon/30 hover:bg-neon/5 transition-all duration-300"
                  >
                    Round {r}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                {team.status === "Eliminated" ||
                  team.status === "Disqualified" ? (
                  <button
                    onClick={() => setReEntryTeam(team)}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#00d4ff] hover:text-[#00f5ff] transition-all duration-300 group/re"
                  >
                    <RotateCcw
                      size={12}
                      className="group-hover/re:rotate-[-45deg] transition-transform"
                    />{" "}
                    Re-Entry
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-neon animate-pulse" />
                    <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
                      System Stable
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleDelete(team.id)}
                  className="p-1.5 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300"
                  title="Purge Squad Data"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-gray-600 border-2 border-dashed border-gray-800 rounded-lg bg-[#1a1a1a]">
          <UserPlus size={48} className="mb-4 opacity-20" />
          <p className="text-lg">No teams registered yet.</p>
          <p className="text-sm">Add a team to start the competition.</p>
        </div>
      )}

      {scoringTeam && (
        <ScoreModal
          team={teams.find((t) => t.id === scoringTeam.teamId)}
          roundId={scoringTeam.roundId}
          onClose={() => setScoringTeam(null)}
        />
      )}

      {reEntryTeam && (
        <ReEntryPanel team={reEntryTeam} onClose={() => setReEntryTeam(null)} />
      )}
    </div>
  );
}
