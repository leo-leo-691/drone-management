import { useState, useEffect } from "react";
import { Routes, Route, useParams, Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Clock,
  AlertTriangle,
  ChevronRight,
  Search,
  LayoutGrid,
  FileText,
  ArrowLeft,
  TriangleAlert,
} from "lucide-react";
import { Header, Footer } from "../components";
import { useData } from "../context/DataContext";

// --- Team List Component ---
const TeamList = ({ teams }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#050a0f] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-neon via-gold to-neon rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative bg-glass border border-glass-border p-6 md:p-8 rounded-4xl flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-neon/10 border border-neon/20">
                <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-neon uppercase tracking-widest">
                  Reporting Module
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                Team <span className="text-neon">Intelligence</span> <br />
                <span className="text-white/20">Reports Archive</span>
              </h1>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Operational Readiness
              </span>
              <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-neon" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-neon transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search teams by callsign..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-6 text-sm font-mono focus:border-neon outline-none transition-all placeholder:text-white/20"
            />
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
            <span>Total Units: {teams.length}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>
              Operational: {teams.filter((t) => t.status === "Active").length}
            </span>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Link
              key={team.id}
              to={`/report/${team.id}`}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-linear-to-br from-neon/50 to-transparent rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-glass border border-glass-border p-3 rounded-2xl hover:border-neon/30 transition-all duration-300 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-3 text-white/2 -mr-4 -mt-4 rotate-12">
                  <FileText size={64} />
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                      Callsign
                    </span>
                    <h3 className="text-lg font-black italic tracking-tighter text-white uppercase group-hover:text-neon transition-colors">
                      {team.name}
                    </h3>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded-full text-[7px] font-mono font-bold uppercase tracking-widest border ${team.status === "Active"
                      ? "bg-neon/10 border-neon/20 text-neon"
                      : "bg-destructive/10 border-destructive/20 text-destructive"
                      }`}
                  >
                    {team.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="space-y-0.5">
                    <span className="text-[7px] font-mono text-muted-foreground/60 uppercase">
                      Aggregated Points
                    </span>
                    <div className="text-base font-black italic tracking-tighter text-white">
                      {team.totalScore || 0}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[7px] font-mono text-muted-foreground/60 uppercase">
                      Total Mission Time
                    </span>
                    <div className="text-base font-black italic tracking-tighter text-white">
                      {team.totalTime || 0}s
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8px] font-mono font-bold text-neon uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    Access Report Intelligence
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-muted-foreground group-hover:text-neon transform group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
              <Search size={32} />
            </div>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
              No matching teams found in database
            </p>
          </div>
        )}
      </div>
    </div >
  );
};

// --- Team Report Details Component ---
const TeamReport = ({ teams }) => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const team = teams.find((t) => t.id === teamId);

  if (!team) {
    return <NotFound />;
  }

  const rounds = ["round1", "round2", "round3"];

  const getRoundStats = (roundId) => {
    const details = team.roundDetails?.[roundId] || {};
    const obstacleScores = details.obstacleScores || {};

    let totalTouches = 0;
    let totalCrashes = 0;

    Object.values(obstacleScores).forEach((s) => {
      totalTouches += s.touches || 0;
      totalCrashes += s.crashes || 0;
    });

    return {
      points: details.score || 0,
      groundTouches: details.groundTouches || 0,
      touches: totalTouches,
      crashes: totalCrashes,
      time: details.time || 0,
    };
  };

  return (
    <div className="min-h-screen bg-[#050a0f] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12 pb-24">
        {/* Back Button */}
        <button
          onClick={() => navigate("/report")}
          className="group flex items-center gap-3 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest hover:text-white transition-colors"
        >
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-neon/30 group-hover:text-neon transition-all">
            <ArrowLeft size={16} />
          </div>
          Return to Fleet Overview
        </button>

        {/* Header */}
        <div className="relative p-6 md:p-8 rounded-3xl bg-glass border border-glass-border overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-neon/5 blur-[80px] -mr-24 -mt-24 rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 blur-[60px] -ml-16 -mb-16 rounded-full" />

          <div className="relative flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                <div className="p-1 bg-neon/10 rounded-md">
                  <LayoutGrid size={12} className="text-neon" />
                </div>
                <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-muted-foreground">
                  Team Intelligence ID: {team.id.slice(0, 8)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                {team.name}
              </h1>
            </div>

            <div className="flex flex-col items-center md:items-end gap-0.5">
              <span className="text-[7px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Aggregated Status
              </span>
              <div
                className={`text-2xl font-black italic tracking-tighter uppercase ${team.status === "Active" ? "text-neon" : "text-destructive"
                  }`}
              >
                {team.status}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-glass border border-glass-border rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Trophy size={12} className="text-gold" /> Total Points Score
              </span>
              <div className="text-2xl font-black italic tracking-tighter text-gold">
                {team.totalScore || 0}
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="w-12 h-12 rounded-3xl border border-gold/20 flex items-center justify-center text-gold/40">
                <Trophy size={20} />
              </div>
            </div>
          </div>
          <div className="bg-glass border border-glass-border rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={12} className="text-neon" /> Cumulative Duration
              </span>
              <div className="text-2xl font-black italic tracking-tighter text-neon">
                {team.totalTime || 0}
                <span className="text-lg ml-1">s</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="w-12 h-12 rounded-3xl border border-neon/20 flex items-center justify-center text-neon/40">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Rounds Detailed Report */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.5em] whitespace-nowrap">
              Mission Phase Analysis
            </h2>
            <div className="h-px w-full bg-linear-to-r from-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rounds.map((rid, idx) => {
              const stats = getRoundStats(rid);
              const isDQ = stats.groundTouches >= 3;

              return (
                <div
                  key={rid}
                  className={`relative group ${isDQ ? "opacity-70" : ""}`}
                >
                  <div
                    className={`absolute -inset-0.5 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-500 bg-linear-to-b ${isDQ
                      ? "from-destructive to-transparent"
                      : "from-neon to-transparent"
                      }`}
                  />
                  <div className="relative bg-glass border border-glass-border p-5 rounded-3xl space-y-4">
                    {/* Round Label */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                          Phase 0{idx + 1}
                        </span>
                        <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">
                          ROUND {idx + 1}
                        </h3>
                      </div>
                      {isDQ && (
                        <div className="p-1.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg animate-pulse">
                          <TriangleAlert size={14} />
                        </div>
                      )}
                    </div>

                    {/* Main Score */}
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-mono text-muted-foreground font-bold uppercase tracking-widest">
                        Efficiency Points
                      </span>
                      <div
                        className={`text-3xl font-black italic tracking-tighter ${isDQ ? "text-destructive" : "text-white"}`}
                      >
                        {stats.points}
                      </div>
                    </div>

                    {/* Detailed Stats Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl bg-white/2 border border-white/5 space-y-0.5">
                        <span className="text-[7px] font-mono text-muted-foreground/60 uppercase">
                          Duration
                        </span>
                        <div className="text-xl font-black italic tracking-tighter text-neon">
                          {stats.time}s
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/2 border border-white/5 space-y-0.5">
                        <span className="text-[7px] font-mono text-muted-foreground/60 uppercase">
                          Ground
                        </span>
                        <div
                          className={`text-xl font-black italic tracking-tighter ${stats.groundTouches >= 2 ? "text-destructive" : "text-white"}`}
                        >
                          {stats.groundTouches} / 3
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/2 border border-white/5 space-y-0.5">
                        <span className="text-[7px] font-mono text-muted-foreground/60 uppercase">
                          Touches
                        </span>
                        <div className="text-xl font-black italic tracking-tighter text-white">
                          {stats.touches}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/2 border border-white/5 space-y-0.5">
                        <span className="text-[7px] font-mono text-muted-foreground/60 uppercase">
                          Crashes
                        </span>
                        <div className="text-xl font-black italic tracking-tighter text-destructive">
                          {stats.crashes}
                        </div>
                      </div>
                    </div>

                    {isDQ && (
                      <div className="pt-3 border-t border-destructive/20">
                        <p className="text-[9px] font-mono font-bold text-destructive uppercase tracking-widest text-center">
                          Protocol Violation: Disqualified
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Not Found Component ---
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#050a0f] text-white flex items-center justify-center p-6">
      <div className="text-center space-y-12 max-w-md">
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-destructive blur-2xl opacity-20 animate-pulse" />
          <AlertTriangle size={120} className="relative text-destructive" />
        </div>
        <div className="space-y-4">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase">
            Data Link Broken
          </h2>
          <p className="text-muted-foreground font-mono text-sm leading-relaxed uppercase tracking-widest">
            The requested team profile could not be retrieved from the central
            hive. The entry may have been purged or does not exist.
          </p>
        </div>
        <button
          onClick={() => navigate("/report")}
          className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-neon hover:text-black hover:border-neon transition-all duration-300"
        >
          Re-establish Connection
        </button>
      </div>
    </div>
  );
};

// --- Main Reports Page ---
export default function Reports() {
  const { teams, rounds } = useData();

  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-neon/30">
      <Header rounds={rounds} />

      <main className="flex-1">
        <Routes>
          <Route index element={<TeamList teams={teams} />} />
          <Route path=":teamId" element={<TeamReport teams={teams} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
