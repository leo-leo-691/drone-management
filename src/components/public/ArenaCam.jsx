import { Eye } from "lucide-react";

export default function ArenaCam() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-glass-border bg-glass backdrop-blur-xl group">
      {/* Simulated Arena View */}
      <div className="relative aspect-video md:aspect-16/10 bg-background overflow-hidden">
        {/* Grid Floor */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                  linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)
                `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Perspective Grid */}
        <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
          <div
            className="w-[200%] h-[60%] opacity-30"
            style={{
              backgroundImage: `
                  linear-gradient(rgba(0,240,255,0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,240,255,0.2) 1px, transparent 1px)
                `,
              backgroundSize: "60px 60px",
              transform: "perspective(400px) rotateX(60deg)",
              transformOrigin: "center bottom",
            }}
          />
        </div>

        {/* Glowing Track Lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer track */}
          <path
            d="M 150 100 Q 400 60, 650 100 Q 720 200, 650 350 Q 400 420, 150 350 Q 80 250, 150 100"
            fill="none"
            stroke="rgba(0,240,255,0.3)"
            strokeWidth="2"
            filter="url(#glow)"
          />
          {/* Inner track */}
          <path
            d="M 220 160 Q 400 130, 580 160 Q 630 240, 580 300 Q 400 350, 220 300 Q 170 240, 220 160"
            fill="none"
            stroke="rgba(0,240,255,0.2)"
            strokeWidth="1.5"
            filter="url(#glow)"
          />
          {/* Checkpoints */}
          <circle
            cx="400"
            cy="80"
            r="5"
            fill="#00f0ff"
            opacity="0.6"
            className="animate-pulse-neon"
          />
          <circle
            cx="680"
            cy="225"
            r="5"
            fill="#00f0ff"
            opacity="0.6"
            className="animate-pulse-neon"
          />
          <circle
            cx="400"
            cy="390"
            r="5"
            fill="#00f0ff"
            opacity="0.6"
            className="animate-pulse-neon"
          />
          <circle
            cx="120"
            cy="225"
            r="5"
            fill="#00f0ff"
            opacity="0.6"
            className="animate-pulse-neon"
          />

          {/* Drone Positions */}
          <g className="animate-float">
            <circle cx="350" cy="140" r="6" fill="#ffd700" />
            <circle
              cx="350"
              cy="140"
              r="12"
              fill="none"
              stroke="#ffd700"
              strokeWidth="1"
              opacity="0.4"
            />
          </g>
          <g className="animate-float" style={{ animationDelay: "0.5s" }}>
            <circle cx="500" cy="180" r="6" fill="#00f0ff" />
            <circle
              cx="500"
              cy="180"
              r="12"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="1"
              opacity="0.4"
            />
          </g>
          <g className="animate-float" style={{ animationDelay: "1s" }}>
            <circle cx="300" cy="280" r="6" fill="#ff3d5a" />
            <circle
              cx="300"
              cy="280"
              r="12"
              fill="none"
              stroke="#ff3d5a"
              strokeWidth="1"
              opacity="0.4"
            />
          </g>
          <g className="animate-float" style={{ animationDelay: "1.5s" }}>
            <circle cx="550" cy="300" r="6" fill="#c0c0c0" />
            <circle
              cx="550"
              cy="300"
              r="12"
              fill="none"
              stroke="#c0c0c0"
              strokeWidth="1"
              opacity="0.4"
            />
          </g>
        </svg>

        {/* Scan Line Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="absolute w-full h-px bg-neon animate-scan-line" />
        </div>

        {/* Corner Labels */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-glass-border">
          <Eye className="w-3.5 h-3.5 text-neon" />
          <span className="text-[10px] font-mono text-neon uppercase tracking-wider">
            Arena Cam 01
          </span>
        </div>
      </div>
    </div>
  );
}
