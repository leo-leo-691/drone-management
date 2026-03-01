import { logoLightNoBg, collegeLogo } from "../../assets/index.js";

export default function Footer() {
  const footerLinks = [
    {
      name: "Guidlines",
      url: "https://drive.google.com/drive/folders/1gePAsfh9DM4DMsMqkqOLnm4VuHXw96oI",
      isExternal: true,
      isActive: true,
    },
    {
      name: "Reports",
      url: "/report",
      isExternal: false,
      isActive: true,
    },
    {
      name: "About Us",
      url: "/about",
      isExternal: false,
      isActive: true,
    },
  ];
  return (
    <footer className="relative z-10 py-12 px-4 md:px-8 border-t border-white/10 bg-[#050a0f]/80 backdrop-blur-2xl mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Side: Branding */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-neon/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <img
                src={logoLightNoBg}
                alt="Droneomania Logo"
                className="relative h-12 md:h-16 w-auto object-contain"
              />
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            <img
              src={collegeLogo}
              alt="College Logo"
              className="h-10 md:h-14 w-auto object-contain border border-white/5 rounded-lg shadow-2xl"
            />
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter italic leading-none text-white uppercase">
              DRONE<span className="text-neon">O</span>MANIA
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              <p className="text-[10px] md:text-xs font-mono font-bold text-muted-foreground uppercase tracking-[0.3em]">
                Ambiora'26
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Links & Info */}
        <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
          <nav className="flex flex-wrap justify-center gap-6 md:gap-12">
            {footerLinks.map((link) =>
              link.isActive ? (
                <a
                  key={link.name}
                  href={link.url}
                  target={link.isExternal ? "_blank" : null}
                  className="text-sm font-mono font-black uppercase tracking-widest text-muted-foreground hover:text-neon transition-all duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon transition-all duration-300 group-hover:w-full"></span>
                </a>
              ) : null,
            )}
          </nav>

          <div className="flex flex-col items-center lg:items-end gap-2 pt-6 border-t border-white/5 w-full lg:w-auto">
            <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-muted-foreground/60 uppercase tracking-widest">
              <span>Terminal: NMIMS_SHP_MAIN_V2</span>
              <span className="h-1 w-1 rounded-full bg-white/20"></span>
              <span>© 2026 DRONEOMANIA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
