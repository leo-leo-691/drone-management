import { useState, useEffect } from "react";
import { subscribeObstacles } from "../../services/db";
import { Live } from "../index.js";

export default function RoundView({ round }) {
  const [obstacles, setObstacles] = useState([]);

  useEffect(() => {
    if (round.visible) {
      const unsub = subscribeObstacles(round.id, setObstacles);
      return () => unsub();
    }
  }, [round.id, round.visible]);

  if (!round.visible) return null;

  const [collapse, setCollapse] = useState(false);

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4 mb-4 border-l-4 border-primary pl-4 cursor-pointer">
        <h2
          className="text-2xl font-bold m-0"
          onClick={() => {
            setCollapse((prev) => {
              return !prev;
            });
          }}
        >
          {round.title}
        </h2>
        {!round.published ? <Live /> : null}
      </div>

      <div className={`${collapse ? "hidden" : null}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {obstacles.map((obs) => (
            <div
              key={obs.id}
              className="card p-0 overflow-hidden border border-gray-800 bg-[#1a1a1a] flex flex-col group hover:border-primary transition-all"
            >
              {/* Image Area */}
              <div className="h-40 bg-black relative">
                {obs.imageURL ? (
                  <img
                    src={obs.imageURL}
                    alt={obs.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 bg-[#0a0a0a]">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold border border-gray-700">
                  #{obs.order}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {obs.name}
                </h3>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-auto">
                  <div className="bg-[#222] p-1 rounded">
                    <div className="text-gray-500">Max</div>
                    <div className="font-bold text-green-400">
                      {obs.maxPoints}
                    </div>
                  </div>
                  <div className="bg-[#222] p-1 rounded">
                    <div className="text-gray-500">Touch</div>
                    <div className="font-bold text-yellow-500">
                      -{obs.touchPenalty}
                    </div>
                  </div>
                  <div className="bg-[#222] p-1 rounded">
                    <div className="text-gray-500">Crash</div>
                    <div className="font-bold text-red-500">
                      -{obs.crashPenalty}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {obstacles.length === 0 && (
            <div className="col-span-full p-8 text-center text-gray-600 border border-dashed border-gray-800 rounded">
              Obstacles are being set up for this round.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
