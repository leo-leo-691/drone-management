import { useState, useEffect } from "react";
import {
  subscribeEvents,
  addEvent,
  deleteEvent,
  updateEvent,
} from "../../services/db";
import {
  Trash2,
  Plus,
  Info,
  AlertTriangle,
  Star,
  Edit3,
  XCircle,
} from "lucide-react";

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [newText, setNewText] = useState("");
  const [type, setType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const unsub = subscribeEvents(setEvents);
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setLoading(true);
    try {
      if (editId) {
        await updateEvent(editId, newText, type);
        setEditId(null);
      } else {
        await addEvent(newText, type);
      }
      setNewText("");
      setType("info");
    } catch (err) {
      console.error(err);
      alert(editId ? "Failed to update event" : "Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (ev) => {
    setEditId(ev.id);
    setNewText(ev.event);
    setType(ev.type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setNewText("");
    setType("info");
  };

  return (
    <div className="bg-glass border border-glass-border rounded-3xl p-4 md:p-8 space-y-6 md:space-y-8 animate-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black italic tracking-tighter text-white uppercase">
            {editId ? "Update" : "Event"}{" "}
            <span className="text-neon">
              {editId ? "Intelligence" : "Broadcaster"}
            </span>
          </h2>
          <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mt-1">
            {editId
              ? `Editing Log ID: ${editId.slice(0, 8)}`
              : "Real-time Race Log Management"}
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-neon/10 border border-neon/20">
          <span className="text-[10px] font-mono font-bold text-neon uppercase tracking-widest">
            {events.length} Logs
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Event Narrative
          </label>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Ex: Ghost Rider sets lap record of 14.5s..."
            className="bg-black/40 border border-white/10 text-white p-4 rounded-2xl text-sm focus:border-neon outline-none transition-all placeholder:text-white/10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Event Severity
            </label>
            <div className="flex gap-2">
              {[
                { id: "info", icon: Info, color: "text-blue-400" },
                { id: "highlight", icon: Star, color: "text-neon" },
                { id: "warning", icon: AlertTriangle, color: "text-gold" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all duration-300 ${
                    type === t.id
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-black/20 border-white/5 text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <t.icon size={16} className={t.color} />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                    {t.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-3 flex-col sm:flex-row">
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="h-[48px] md:h-[52px] px-6 bg-white/5 border border-white/10 text-white font-black italic uppercase tracking-tighter rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-xs"
              >
                <XCircle size={18} />
                Cancel
              </button>
            )}
            <button
              disabled={loading}
              className={`h-[48px] md:h-[52px] px-8 py-3 bg-neon text-background font-black italic uppercase tracking-tighter rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-xs flex-1`}
            >
              {editId ? <Edit3 size={18} /> : <Plus size={18} />}
              {loading
                ? editId
                  ? "Updating..."
                  : "Broadcasting..."
                : editId
                  ? "Update Log"
                  : "Broadcast Event"}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4 pt-6 border-t border-white/5">
        <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-[0.3em] mb-4">
          Recent Chronicles
        </h3>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="group flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-neon/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="pt-1 text-[10px] font-mono text-muted-foreground/40 tabular-nums">
                  {ev.time}
                </div>
                <div className="space-y-1">
                  <p
                    className={`text-xs font-mono font-bold ${
                      ev.type === "highlight"
                        ? "text-neon"
                        : ev.type === "warning"
                          ? "text-gold"
                          : "text-white/80"
                    }`}
                  >
                    {ev.event}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[8px] font-mono text-muted-foreground/30 uppercase tracking-widest">
                      Type: {ev.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(ev)}
                  className="p-2 text-muted-foreground hover:text-neon hover:bg-neon/10 rounded-lg transition-all"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => deleteEvent(ev.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="py-12 text-center opacity-30">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest">
                No active events logged
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
