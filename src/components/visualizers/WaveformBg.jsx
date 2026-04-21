export default function WaveformBg({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-void via-deep to-void" />
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-30"
      >
        <defs>
          <linearGradient id="wave1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7B2FFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7B2FFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#7B2FFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="none" strokeWidth="1.5">
          <path
            stroke="url(#wave1)"
            d="M0 320 Q 180 220 360 320 T 720 320 T 1080 320 T 1440 320"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0 320 Q 180 220 360 320 T 720 320 T 1080 320 T 1440 320;
                M0 300 Q 180 420 360 300 T 720 300 T 1080 300 T 1440 300;
                M0 320 Q 180 220 360 320 T 720 320 T 1080 320 T 1440 320"
            />
          </path>
          <path
            stroke="url(#wave2)"
            d="M0 360 Q 200 460 400 360 T 800 360 T 1200 360 T 1440 360"
          >
            <animate
              attributeName="d"
              dur="11s"
              repeatCount="indefinite"
              values="
                M0 360 Q 200 460 400 360 T 800 360 T 1200 360 T 1440 360;
                M0 380 Q 200 260 400 380 T 800 380 T 1200 380 T 1440 380;
                M0 360 Q 200 460 400 360 T 800 360 T 1200 360 T 1440 360"
            />
          </path>
        </g>
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(123,47,255,0.1),transparent_55%)]" />
    </div>
  );
}
