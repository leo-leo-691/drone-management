import { useState, useEffect } from "react";
import { subscribeArenaSettings, updateArenaSettings } from "../../services/db";
import { Thermometer, Save } from "lucide-react";

export default function ArenaSettings() {
  const [temp, setTemp] = useState("22");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = subscribeArenaSettings((settings) => {
      setTemp(settings.trackTemp || "22");
    });
    return () => unsub();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateArenaSettings({ trackTemp: temp });
      alert("Arena environment updated.");
    } catch (err) {
      console.error(err);
      alert("System integrity error. Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-glass border border-glass-border rounded-3xl p-4 md:p-8 space-y-6 md:space-y-8 animate-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase">
            Arena <span className="text-neon">Environment</span>
          </h2>
          <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mt-1">
            Real-time Sensor Override
          </p>
        </div>
        <div className="p-2.5 bg-neon/10 border border-neon/20 rounded-xl text-neon">
          <Thermometer size={22} />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Track Surface Temperature (°C)
          </label>
          <div className="relative group max-w-sm">
            <Thermometer
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-neon transition-colors"
              size={18}
            />
            <input
              type="number"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              placeholder="Ex: 22"
              className="w-full bg-black/40 border border-white/10 text-white py-3 md:py-4 pl-12 pr-6 rounded-xl text-xl md:text-2xl font-black italic tracking-tighter focus:border-neon outline-none transition-all placeholder:text-white/10"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 md:py-4 bg-neon text-background font-black italic uppercase tracking-tighter rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
        >
          <Save size={18} />
          {loading ? "Re-calibrating..." : "Sync Environment"}
        </button>
      </form>

      <div className="p-4 rounded-xl border border-white/5 bg-white/2">
        <p className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest leading-relaxed">
          <span className="text-neon font-black">LOG:</span> Syncing temperature
          will reflect instantly on all spectator terminals. Calibration takes
          &lt;100ms.
        </p>
      </div>
    </div>
  );
}
