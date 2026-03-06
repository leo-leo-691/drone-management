import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { subscribeObstacles, updateTeam } from "../../services/db";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Timer, AlertTriangle, Trophy, X } from "lucide-react";

export default function ScoreModal({ team, roundId, onClose }) {
  const [obstacles, setObstacles] = useState([]);
  const [scores, setScores] = useState({}); // { obstacleId: { touches: 0, crashes: 0 } }
  const [groundTouches, setGroundTouches] = useState(0);
  const [groundPenalty, setGroundPenalty] = useState(10);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!team || !roundId) return;

    // Fetch Round Config (for groundPenalty)
    getDoc(doc(db, "rounds", roundId)).then((snap) => {
      if (snap.exists() && snap.data().groundPenalty !== undefined) {
        setGroundPenalty(snap.data().groundPenalty);
      }
    });

    // Fetch Obstacles
    const unsub = subscribeObstacles(roundId, (obs) => {
      setObstacles(obs);

      // Initialize state from team data
      const roundData = team.roundDetails?.[roundId] || {};
      setGroundTouches(roundData.groundTouches || 0);

      const initialScores = {};
      obs.forEach((o) => {
        const saved = roundData.obstacleScores?.[o.id] || {
          touches: 0,
          crashes: 0,
          skipped: false,
        };
        initialScores[o.id] = saved;
      });
      setScores(initialScores);

      // Initialize Time
      const timeInSeconds = team.roundDetails?.[roundId].time || 0;
      if (typeof timeInSeconds === "number" && timeInSeconds >= 0) {
        const m = Math.floor(timeInSeconds / 60);
        const s = timeInSeconds % 60;
        setMinutes(String(m));
        setSeconds(String(s));
      } else if (
        typeof timeInSeconds === "string" &&
        timeInSeconds.includes(":")
      ) {
        // Fallback for legacy string time
        const [m, s] = timeInSeconds.split(":");
        setMinutes(m);
        setSeconds(s);
      } else {
        setMinutes("");
        setSeconds("");
      }
    });
    return () => unsub();
  }, [roundId, team]);

  const calculateTotal = () => {
    // 1. Check Ground Touch Disqualification
    if (groundTouches >= 3) return 0;

    // 2. Sum Obstacle Scores
    let obstacleSum = 0;
    obstacles.forEach((obs) => {
      const s = scores[obs.id] || { touches: 0, crashes: 0, skipped: false };
      const obsScore = s.skipped ? 0 :
        obs.maxPoints -
        s.touches * obs.touchPenalty -
        s.crashes * obs.crashPenalty;
      obstacleSum += obsScore;
    });
    obstacleSum -= groundPenalty * groundTouches;

    return obstacleSum;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const roundScore = calculateTotal();
      const isDisqualified = groundTouches >= 3;

      // Validate and Format Time
      const m = parseInt(minutes) || 0;
      const s = parseInt(seconds) || 0;

      if (m < 0 || s < 0 || s > 59 || (m == 0 && s == 0)) {
        alert("Invalid time entry. Seconds and minutes must be between 0-59.");
        setLoading(false);
        return;
      }

      const totalSeconds = m * 60 + s;

      // Update Team
      const updates = {
        [`roundDetails.${roundId}`]: {
          groundTouches: Number(groundTouches),
          obstacleScores: scores,
          time: totalSeconds,
          score: roundScore,
        },
      };

      // Recalculate Total Score
      const r1 =
        roundId === "round1"
          ? roundScore
          : team.roundDetails?.round1?.score || 0;
      const r2 =
        roundId === "round2"
          ? roundScore
          : team.roundDetails?.round2?.score || 0;
      const r3 =
        roundId === "round3"
          ? roundScore
          : team.roundDetails?.round3?.score || 0;

      updates.totalScore = r1 + r2 + r3;

      // Recalculate Total Time
      const t1 =
        roundId === "round1"
          ? totalSeconds
          : typeof team.roundDetails?.round1?.time === "number"
            ? team.roundDetails?.round1?.time
            : 0;
      const t2 =
        roundId === "round2"
          ? totalSeconds
          : typeof team.roundDetails?.round2?.time === "number"
            ? team.roundDetails?.round2?.time
            : 0;
      const t3 =
        roundId === "round3"
          ? totalSeconds
          : typeof team.roundDetails?.round3?.time === "number"
            ? team.roundDetails?.round3?.time
            : 0;

      updates.totalTime = t1 + t2 + t3;

      if (isDisqualified) {
        updates.status = "Disqualified";
      } else if (team.status === "Disqualified") {
        updates.status = "Active";
      }

      await updateTeam(team.id, updates);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save scores");
    } finally {
      setLoading(false);
    }
  };

  const updateScore = (obsId, field, val) => {
    setScores((prev) => ({
      ...prev,
      [obsId]: {
        ...prev[obsId],
        [field]: field === "skipped" ? val : Number(val),
      },
    }));
  };

  if (!team || !roundId) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#050a0f]/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-glass border border-glass-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-500">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent opacity-50" />

        {/* Header */}
        <div className="p-4 md:p-6 border-b border-glass-border flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-2 md:p-2.5 bg-neon/10 border border-neon/20 rounded-xl text-neon">
              <Trophy size={18} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black italic tracking-tighter text-white uppercase leading-none">
                Score Entry: <span className="text-neon">{team.name}</span>
              </h2>
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                Round {roundId?.replace("round", "")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 flex flex-col gap-6 md:gap-8 scrollbar-hide">
          {/* Time & Ground Touches Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Time Input */}
            <div className="p-4 md:p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
              <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
                <Timer size={14} className="text-neon" /> Mission Duration
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-center">
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white text-center text-xl md:text-2xl font-black italic tracking-tighter rounded-xl p-2.5 md:p-3 focus:border-neon outline-none transition-all tabular-nums"
                    placeholder="00"
                  />
                  <span className="text-[8px] font-mono text-muted-foreground uppercase block mt-1.5 tracking-widest">
                    Mins
                  </span>
                </div>
                <span className="text-xl font-black text-white/20">:</span>
                <div className="flex-1 text-center">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white text-center text-xl md:text-2xl font-black italic tracking-tighter rounded-xl p-2.5 md:p-3 focus:border-neon outline-none transition-all tabular-nums"
                    placeholder="00"
                  />
                  <span className="text-[8px] font-mono text-muted-foreground uppercase block mt-1.5 tracking-widest">
                    Secs
                  </span>
                </div>
              </div>
            </div>

            {/* Ground Touches Section */}
            <div
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${groundTouches >= 3 ? "border-destructive/30 bg-destructive/5" : "border-white/5 bg-white/[0.02]"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={14} className="text-neon" /> Ground
                </label>
                <div className="flex items-center gap-2 bg-black/40 rounded-xl p-1 border border-white/5">
                  <button
                    onClick={() =>
                      setGroundTouches(Math.max(0, groundTouches - 1))
                    }
                    className="p-1 px-2 text-muted-foreground hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <div
                    className={`w-8 text-center font-black text-lg md:text-xl italic tracking-tighter tabular-nums ${groundTouches >= 3 ? "text-destructive" : "text-white"}`}
                  >
                    {groundTouches}
                  </div>
                  <button
                    onClick={() => setGroundTouches(groundTouches + 1)}
                    className="p-1 px-2 text-muted-foreground hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-[8px] md:text-[9px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                Protocol:{" "}
                <span className="text-destructive font-black">
                  3 touches = DQ
                </span>
              </div>
              {groundTouches >= 3 && (
                <div className="mt-3 text-[8px] md:text-[9px] text-destructive font-black uppercase tracking-widest animate-pulse flex items-center gap-1.5">
                  <AlertTriangle size={12} /> DISQUALIFIED
                </div>
              )}
            </div>
          </div>

          {/* Obstacles List */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.3em] pl-1">
              Obstacle Performance Matrix
            </h3>
            {obstacles.map((obs) => {
              const s = scores[obs.id] || { touches: 0, crashes: 0, skipped: false };
              const currentScore = s.skipped ? 0 :
                obs.maxPoints -
                s.touches * obs.touchPenalty -
                s.crashes * obs.crashPenalty;

              return (
                <div
                  key={obs.id}
                  className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-neon/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-black italic tracking-tighter text-white/90 uppercase flex items-center gap-2">
                      {obs.order}. {obs.name}
                      {s.skipped && (
                        <span className="px-2 py-0.5 rounded-md bg-destructive/20 text-destructive text-[10px] font-mono font-bold tracking-widest border border-destructive/30 uppercase">
                          Skipped
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateScore(obs.id, "skipped", !s.skipped)}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all border ${s.skipped
                            ? "bg-destructive/20 text-destructive border-destructive/50 hover:bg-destructive/30"
                            : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        {s.skipped ? "Unskip" : "Skip"}
                      </button>
                      <span
                        className={`text-sm font-black tabular-nums italic tracking-tighter w-16 text-right ${currentScore < 0 ? "text-destructive" : (s.skipped ? "text-muted-foreground" : "text-neon")}`}
                      >
                        {currentScore} PTS
                      </span>
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${s.skipped ? "opacity-30 pointer-events-none" : ""}`}>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[8px] font-mono font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">
                        Touches (-{obs.touchPenalty})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={s.touches}
                        onChange={(e) =>
                          updateScore(obs.id, "touches", e.target.value)
                        }
                        disabled={s.skipped}
                        className="bg-black/40 border border-white/10 text-white p-2 rounded-xl text-center font-mono text-sm focus:border-neon outline-none disabled:opacity-50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[8px] font-mono font-bold text-destructive/60 uppercase tracking-widest ml-1">
                        Crashes (-{obs.crashPenalty})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={s.crashes}
                        onChange={(e) =>
                          updateScore(obs.id, "crashes", e.target.value)
                        }
                        disabled={s.skipped}
                        className="bg-black/40 border border-white/10 text-white p-2 rounded-xl text-center font-mono text-sm focus:border-destructive outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-glass-border bg-white/[0.02] flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
              Round Total
            </span>
            <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-gold leading-none mt-1">
              {calculateTotal()}
            </span>
          </div>
          <div className="flex gap-2 min-w-0">
            <button
              onClick={onClose}
              className="px-3 md:px-6 py-2 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
            >
              Abort
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 md:flex-none px-4 md:px-8 py-2 md:py-3 bg-neon text-background text-[9px] md:text-[10px] font-black italic uppercase tracking-tighter rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Saving..." : "Save Data"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
