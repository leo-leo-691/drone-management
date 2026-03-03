import { Header, Footer } from "../components/index.js";
import { useData } from "../context/DataContext";
import { Phone, Mail, Users } from "lucide-react";
import { groupPhoto } from "../assets/index.js";

export default function About() {
  const { rounds } = useData();

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

      {/* Header */}
      <Header rounds={rounds} />

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 py-12 md:px-8 md:py-20 flex flex-col items-center">
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
          {/* Heading */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-neon/50"></div>
              <Users className="w-6 h-6 text-neon" />
              <div className="w-12 h-px bg-neon/50"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-white leading-none">
              ORGANISATION <span className="text-neon">COMMITTEE</span>
            </h1>
            <p className="mt-4 text-sm md:text-base font-mono font-bold text-muted-foreground uppercase tracking-[0.4em]">
              The Team Behind Droneomania
            </p>
          </div>

          {/* Committee Photo */}
          <div className="relative group w-full aspect-video md:aspect-21/9 rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-16">
            <img
              src={groupPhoto}
              alt="Organisation Committee"
              className="w-full h-full object-cover group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 border border-neon/20 rounded-2xl z-20 pointer-events-none group-hover:border-neon/50 transition-colors duration-500"></div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            {/* Phone */}
            <div className="group flex flex-col items-center p-8 rounded-2xl bg-glass border border-white/5 hover:border-neon/30 hover:bg-neon/5 transition-all duration-500 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <Phone className="w-6 h-6 text-neon" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Call Us
              </h3>
              <p className="text-xl font-black text-white">+91 69133 47776</p>
            </div>

            {/* Email */}
            <div className="group flex flex-col items-center p-8 rounded-2xl bg-glass border border-white/5 hover:border-neon/30 hover:bg-neon/5 transition-all duration-500 backdrop-blur-xl">
              <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <Mail className="w-6 h-6 text-neon" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Email Us
              </h3>
              <p className="text-xl font-black text-white">
                ambiora2026@gmail.com
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
