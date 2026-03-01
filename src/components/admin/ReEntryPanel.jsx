import { useState } from "react";
import { updateTeam } from "../../services/db";
import { RotateCcw, AlertTriangle } from "lucide-react";

export default function ReEntryPanel({ team, onClose }) {
  const [selectedRound, setSelectedRound] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleReEntry = async () => {
    if ((team.reEntryCount || 0) >= 1) {
      alert(
        "⚠️ RE-ENTRY DENIED: This team has already used their one re-entry.",
      );
      return;
    }

    if (
      !confirm(
        `Are you sure you want to approve Re-Entry for ${team.name} in Round ${selectedRound}?`,
      )
    )
      return;

    setLoading(true);
    try {
      const roundKey = `round${selectedRound}`;
      const updates = {
        reEntryCount: (team.reEntryCount || 0) + 1,
        status: "Active",
        [`scores.${roundKey}`]: 0,
        [`${roundKey}Time`]: 0,
        [`roundDetails.${roundKey}`]: {},
      };

      // Recalculate total: Remove the score and time of the round being reset
      let currentTotalScore = team.totalScore || 0;
      currentTotalScore -= team.scores?.[roundKey] || 0;
      updates.totalScore = currentTotalScore;

      let currentTotalTime = team.totalTime || 0;
      currentTotalTime -=
        typeof team[`${roundKey}Time`] === "number"
          ? team[`${roundKey}Time`]
          : 0;
      updates.totalTime = currentTotalTime;

      await updateTeam(team.id, updates);
      onClose();
    } catch (err) {
      console.error("Re-entry failed", err);
      alert("Error processing re-entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#050a0f]/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-glass border border-glass-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-500">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

        {/* Header */}
        <div className="p-4 md:p-6 border-b border-glass-border flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-2 md:p-2.5 bg-gold/10 border border-gold/20 rounded-xl text-gold">
              <RotateCcw size={18} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                Re-Entry Approval
              </h3>
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                Squad: {team.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-4 md:p-6 flex flex-col gap-6">
          <div className="flex items-start gap-4 bg-gold/10 p-3 md:p-4 rounded-2xl border border-gold/20">
            <AlertTriangle
              className="text-gold shrink-0 mt-0.5 md:w-[18px] md:h-[18px]"
              size={16}
            />
            <div className="text-[9px] md:text-[10px] font-mono font-bold text-gold/80 uppercase tracking-widest leading-relaxed">
              <span className="text-white">CRITICAL:</span> This will reset the
              score for the selected round using their single allowed re-entry.
            </div>
          </div>

          <div>
            <label className="block mb-2 md:mb-3 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Select Round to Reset:
            </label>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {["1", "2", "3"].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRound(r)}
                  className={`p-3 md:p-4 rounded-xl border text-[10px] md:text-xs font-black italic uppercase tracking-tighter transition-all duration-300 ${
                    selectedRound === r
                      ? "bg-gold text-background border-gold shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                      : "bg-white/[0.02] border-white/10 text-muted-foreground hover:border-gold/30 hover:text-white"
                  }`}
                >
                  Round {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <button
              onClick={onClose}
              className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
            >
              Abort Sync
            </button>
            <button
              onClick={handleReEntry}
              disabled={loading}
              className="px-6 md:px-8 py-2 md:py-3 bg-gold text-background text-[9px] md:text-[10px] font-black italic uppercase tracking-tighter rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Re-Syncing..." : "Approve Re-Sync"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
