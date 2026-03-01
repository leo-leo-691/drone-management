import { useState, useEffect } from "react";
import {
  subscribeObstacles,
  addObstacle,
  updateObstacle,
  deleteObstacle,
} from "../../services/db";
import { uploadObstacleImage } from "../../services/storage";
import { Trash2, Edit2, Upload, Plus, Save, X } from "lucide-react";

export default function ObstacleManager({ roundId }) {
  const [obstacles, setObstacles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    maxPoints: 100,
    touchPenalty: 10,
    crashPenalty: 50,
    order: 1,
    imageURL: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const unsub = subscribeObstacles(roundId, setObstacles);
    return () => unsub();
  }, [roundId]);

  const resetForm = () => {
    setFormData({
      name: "",
      maxPoints: 100,
      touchPenalty: 10,
      crashPenalty: 50,
      order: obstacles.length + 1,
      imageURL: "",
    });
    setFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = formData.imageURL;
      if (file) {
        url = await uploadObstacleImage(file);
      }

      const data = {
        ...formData,
        imageURL: url,
        maxPoints: Number(formData.maxPoints),
        touchPenalty: Number(formData.touchPenalty),
        crashPenalty: Number(formData.crashPenalty),
        order: Number(formData.order),
      };

      if (editingId) {
        await updateObstacle(roundId, editingId, data);
      } else {
        await addObstacle(roundId, data);
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save obstacle: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (obs) => {
    setEditingId(obs.id);
    setFormData({
      name: obs.name,
      maxPoints: obs.maxPoints,
      touchPenalty: obs.touchPenalty,
      crashPenalty: obs.crashPenalty,
      order: obs.order,
      imageURL: obs.imageURL,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this obstacle?")) {
      await deleteObstacle(roundId, id);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-1">
        <div className="p-4 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          <h3 className="text-xs font-black italic tracking-[0.2em] text-neon uppercase flex items-center gap-2">
            {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
            {editingId ? "Edit Obstacle" : "Add Obstacle"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Obstacle Name
              </label>
              <input
                placeholder="Enter name..."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white placeholder:text-muted-foreground/30 focus:border-neon outline-none transition-all font-mono text-sm uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Base Points
                </label>
                <input
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) =>
                    setFormData({ ...formData, maxPoints: e.target.value })
                  }
                  required
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white focus:border-neon outline-none transition-all font-mono text-sm tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">
                  Sequence
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  required
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white focus:border-neon outline-none transition-all font-mono text-sm tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1 text-gold/60">
                  Touch Pen.
                </label>
                <input
                  type="number"
                  value={formData.touchPenalty}
                  onChange={(e) =>
                    setFormData({ ...formData, touchPenalty: e.target.value })
                  }
                  required
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white focus:border-gold outline-none transition-all font-mono text-sm tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1 text-destructive/60">
                  Crash Pen.
                </label>
                <input
                  type="number"
                  value={formData.crashPenalty}
                  onChange={(e) =>
                    setFormData({ ...formData, crashPenalty: e.target.value })
                  }
                  required
                  className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white focus:border-destructive outline-none transition-all font-mono text-sm tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest ml-1">
                Visual Asset
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white">
                  <Upload size={14} /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {file && (
                  <span className="text-[9px] font-mono text-neon truncate max-w-[100px]">
                    {file.name}
                  </span>
                )}
              </div>
              {formData.imageURL && !file && (
                <div className="mt-3 p-2 rounded-xl border border-white/5 bg-black/40 flex justify-center">
                  <img
                    src={formData.imageURL}
                    alt="Preview"
                    className="h-20 object-contain rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 md:px-6 py-3 bg-neon text-background font-black italic uppercase tracking-tighter rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
              >
                <Save size={16} />
                {loading ? "SAVING..." : editingId ? "REBUILD" : "EXECUTE"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white transition-all rounded-xl"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-end mb-2 px-2">
          <h3 className="text-xs font-black italic tracking-[0.2em] text-white uppercase">
            Obstacles List{" "}
            <span className="text-muted-foreground/40 font-mono ml-2">
              ({obstacles.length})
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
          {obstacles.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-2xl border border-white/5 bg-white/[0.01]">
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest italic">
                No Data Found
              </p>
            </div>
          )}

          {obstacles.map((obs) => (
            <div
              key={obs.id}
              className="group relative flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-neon/20 transition-all duration-300"
            >
              <div className="absolute top-2 right-2 flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(obs)}
                  className="p-1.5 bg-white/5 hover:bg-neon/20 text-muted-foreground hover:text-neon rounded-lg transition-all"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(obs.id)}
                  className="p-1.5 bg-white/5 hover:bg-destructive/20 text-muted-foreground hover:text-destructive rounded-lg transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="text-xl font-black italic tracking-tighter text-neon/40 group-hover:text-neon transition-colors">
                  {String(obs.order).padStart(2, "0")}
                </div>
              </div>

              {obs.imageURL ? (
                <img
                  src={obs.imageURL}
                  alt={obs.name}
                  className="w-16 h-16 object-cover rounded-xl bg-black/40 border border-white/5"
                />
              ) : (
                <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
                  NO_IMG
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-sm font-black italic text-white uppercase truncate tracking-tight mb-2">
                  {obs.name}
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-0.5 rounded bg-neon/10 border border-neon/20 text-[8px] font-black text-neon uppercase tracking-wider">
                    {obs.maxPoints} PTS
                  </div>
                  <div className="px-2 py-0.5 rounded bg-gold/10 border border-gold/20 text-[8px] font-black text-gold uppercase tracking-wider">
                    -{obs.touchPenalty}
                  </div>
                  <div className="px-2 py-0.5 rounded bg-destructive/10 border border-destructive/20 text-[8px] font-black text-destructive uppercase tracking-wider">
                    -{obs.crashPenalty}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
