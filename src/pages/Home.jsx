import { useEffect } from "react";
import { initRounds } from "../services/db";
import { useData } from "../context/DataContext";
import {
  Header,
  ArenaPanel,
  Leaderboard,
  Footer,
} from "../components/index.js";

export default function Home() {
  const { teams, rounds } = useData();

  useEffect(() => {
    // Ensure rounds exist just in case (though admin usually triggers it)
    initRounds().catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-neon/30">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header with Rounds Drawer Logic */}
      <Header rounds={rounds} />

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 py-5 md:px-8 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-5 md:gap-6 max-w-[1600px] mx-auto">
          {/* Left: Arena Preview */}
          <ArenaPanel teams={teams} />

          {/* Right: Leaderboard linked to Firebase Teams */}
          <Leaderboard teams={teams} rounds={rounds} />
        </div>
      </main>

      {/* Footer with Logos and Links */}
      <Footer />
    </div>
  );
}
