import { useState, useEffect } from "react";
import { subscribeObstacles } from "../../services/db";

export default function ObstacleGallery({ roundId }) {
  const [obstacles, setObstacles] = useState([]);

  useEffect(() => {
    const unsub = subscribeObstacles(roundId, setObstacles);
    return () => unsub();
  }, [roundId]);

  if (obstacles.length === 0)
    return <div className="text-center">No obstacles revealed yet.</div>;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
      }}
    >
      {obstacles.map((obs) => (
        <div
          key={obs.id}
          className="card"
          style={{ padding: "1rem", background: "rgba(255,255,255,0.05)" }}
        >
          <div
            style={{
              position: "relative",
              height: "150px",
              marginBottom: "1rem",
            }}
          >
            {obs.imageURL ? (
              <img
                src={obs.imageURL}
                alt={obs.name}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#333",
                }}
              >
                No Image
              </div>
            )}
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                background: "var(--primary-color)",
                color: "#000",
                padding: "2px 8px",
                fontWeight: "bold",
                borderRadius: "0 0 4px 0",
              }}
            >
              #{obs.order}
            </span>
          </div>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>
            {obs.name}
          </h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              color: "#888",
            }}
          >
            <span>Max: {obs.maxPoints}</span>
            <span>
              Pen: -{obs.touchPenalty} / -{obs.crashPenalty}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
