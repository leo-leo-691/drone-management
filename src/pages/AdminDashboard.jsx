import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { subscribeRounds, subscribeTeams, initRounds } from "../services/db";
import RoundCard from "../components/admin/RoundCard";
import TeamManager from "../components/admin/TeamManager";
import EventManager from "../components/admin/EventManager";
import ArenaSettings from "../components/admin/ArenaSettings";
import {
  LogOut,
  LayoutDashboard,
  Users,
  MessageSquare,
  Thermometer,
} from "lucide-react";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("rounds");

  useEffect(() => {
    initRounds().catch(console.error);
    const unsubRounds = subscribeRounds(setRounds);
    const unsubTeams = subscribeTeams(setTeams);
    return () => {
      unsubRounds();
      unsubTeams();
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch {
      console.error("Failed to log out");
    }
  }

  return (
    <div className="min-h-screen bg-[#050a0f] text-foreground relative overflow-hidden py-6">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 md:mb-12 p-4 md:p-6 rounded-2xl bg-glass border border-glass-border backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter italic text-white uppercase leading-none">
                ADMIN<span className="text-neon">SYSTEM</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-px w-8 bg-neon/50"></span>
                <p className="text-[10px] font-mono font-bold text-muted-foreground tracking-[0.3em] uppercase">
                  Control Terminal V2.4
                </p>
              </div>
            </div>

            <nav className="flex items-center p-1 bg-black/40 rounded-xl border border-glass-border w-full md:w-auto overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("rounds")}
                className={`flex items-center justify-center gap-2 px-3 py-2 md:px-6 md:py-2.5 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap flex-1 md:flex-initial ${activeTab === "rounds"
                    ? "bg-neon text-background shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
              >
                <LayoutDashboard size={14} /> Rounds
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`flex items-center justify-center gap-2 px-3 py-2 md:px-6 md:py-2.5 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap flex-1 md:flex-initial ${activeTab === "teams"
                    ? "bg-neon text-background shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
              >
                <Users size={14} /> Teams
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`flex items-center justify-center gap-2 px-3 py-2 md:px-6 md:py-2.5 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap flex-1 md:flex-initial ${activeTab === "events"
                    ? "bg-neon text-background shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
              >
                <MessageSquare size={14} /> Events
              </button>
              <button
                onClick={() => setActiveTab("arena")}
                className={`flex items-center justify-center gap-2 px-3 py-2 md:px-6 md:py-2.5 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap flex-1 md:flex-initial ${activeTab === "arena"
                    ? "bg-neon text-background shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
              >
                <Thermometer size={14} /> Arena
              </button>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all duration-300 text-sm font-bold uppercase tracking-widest"
          >
            <LogOut
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Sign Out
          </button>
        </header>

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === "rounds" && (
            <div className="grid gap-6">
              {rounds.length === 0 && (
                <div className="relative overflow-hidden group text-center p-16 rounded-3xl bg-glass border border-dashed border-glass-border backdrop-blur-xl">
                  {/* Decorative background scanlines */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(0,240,255,1)_1px,transparent_1px)] bg-size-[100%_4px]" />

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon/10 border border-neon/20 text-neon mb-6 animate-pulse">
                      <LayoutDashboard size={40} />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tight text-white uppercase mb-2">
                      No Mission Data Detected
                    </h3>
                    <p className="mb-8 text-muted-foreground max-w-md mx-auto font-mono text-sm">
                      Terminal database is offline. Round configuration required
                      to initiate sequence.
                    </p>
                    <button
                      onClick={() =>
                        initRounds()
                          .then(() => alert("System Sync Complete."))
                          .catch((e) => alert("Sync Failure: " + e.message))
                      }
                      className="group relative px-8 py-4 bg-neon text-background font-black uppercase tracking-tighter italic rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.2)]"
                    >
                      <span className="relative z-10">Initialize System</span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-xl" />
                    </button>
                  </div>
                </div>
              )}
              {rounds.map((round) => (
                <RoundCard key={round.id} round={round} />
              ))}
            </div>
          )}

          {activeTab === "teams" && (
            <div className="rounded-3xl bg-glass border border-glass-border backdrop-blur-xl shadow-2xl overflow-hidden p-1">
              <TeamManager teams={teams} />
            </div>
          )}

          {activeTab === "events" && (
            <div className="max-w-4xl mx-auto">
              <EventManager />
            </div>
          )}

          {activeTab === "arena" && (
            <div className="max-w-xl mx-auto">
              <ArenaSettings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
