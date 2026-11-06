// Painted-style illustration for the top of the footer: a highland coffee farm
// at golden hour (think Mambilla Plateau) that fades into the footer below.
// Pure SVG, generated with a seeded random so server and client match exactly.

const W = 1440;
const H = 560;

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const gauss = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2));

/** A hill's top edge. */
type Ridge = (x: number) => number;

const ridges: { top: Ridge; fill: string; shade: string; dark: string; light: string; rows: number; gap: number; size: number; dx: number }[] = [
  {
    // far left highland
    top: (x) => 352 - 78 * gauss(x, 330, 300) - 10 * Math.sin(x / 70),
    fill: "#9aa864",
    shade: "#6c8040",
    dark: "#4f6330",
    light: "#b4c27a",
    rows: 6,
    gap: 15,
    size: 4.2,
    dx: 15,
  },
  {
    // right highland
    top: (x) => 372 - 62 * gauss(x, 1110, 360) - 8 * Math.sin(x / 55 + 1),
    fill: "#8a9c56",
    shade: "#5d7438",
    dark: "#435a28",
    light: "#a9bb6c",
    rows: 6,
    gap: 17,
    size: 4.8,
    dx: 17,
  },
  {
    // near terraces
    top: (x) => 448 - 46 * gauss(x, 720, 520) - 6 * Math.sin(x / 90 + 2),
    fill: "#6f8644",
    shade: "#46602a",
    dark: "#2f461c",
    light: "#93ad5c",
    rows: 6,
    gap: 22,
    size: 7,
    dx: 23,
  },
];

const path = (top: Ridge) => {
  let d = `M0 ${H} L0 ${top(0).toFixed(1)}`;
  for (let x = 20; x <= W; x += 20) d += ` L${x} ${top(x).toFixed(1)}`;
  return d + ` L${W} ${H} Z`;
};

/** Rows of coffee shrubs following one hill's contour (drawn right after that hill). */
function Shrubs({ k }: { k: number }) {
  const r = rng(7 + k * 101);
  const out: React.ReactNode[] = [];
  [ridges[k]].forEach((ridge) => {
    for (let row = 1; row <= ridge.rows; row++) {
      const s = ridge.size * (1 + row * 0.12);
      for (let x = (row % 2) * (ridge.dx / 2); x < W; x += ridge.dx * (1 + row * 0.08)) {
        const jx = x + (r() - 0.5) * 4;
        const y = ridge.top(jx) + row * ridge.gap * (1 + row * 0.06) - 2;
        if (y > H) continue;
        const v = 0.75 + r() * 0.5;
        out.push(
          <g key={`b${k}-${row}-${x}`}>
            <ellipse cx={jx} cy={y + s * 0.15} rx={s * 1.25 * v} ry={s * 0.8 * v} fill={ridge.dark} />
            <circle cx={jx - s * 0.45 * v} cy={y - s * 0.1} r={s * 0.62 * v} fill={ridge.shade} />
            <circle cx={jx + s * 0.4 * v} cy={y - s * 0.2} r={s * 0.7 * v} fill={ridge.shade} />
            <circle cx={jx - s * 0.1} cy={y - s * 0.45 * v} r={s * 0.38 * v} fill={ridge.light} />
          </g>,
        );
        if (k === 2 && r() < 0.28) {
          out.push(<circle key={`c${k}-${row}-${x}`} cx={jx + s * 0.4} cy={y} r={2.3} fill="#c0412a" />);
        }
      }
    }
  });
  return <g>{out}</g>;
}

/** A coffee branch: stem, glossy leaf pairs and clusters of red cherries. */
function Branch({ flip = false }: { flip?: boolean }) {
  const r = rng(flip ? 31 : 13);
  const leaves: React.ReactNode[] = [];
  const pts = [
    [40, 520],
    [110, 470],
    [175, 440],
    [240, 425],
    [300, 418],
  ];
  pts.forEach(([x, y], i) => {
    if (i === 0) return;
    const len = 62 - i * 6;
    [-1, 1].forEach((side) => {
      const ang = side * (40 + r() * 20) - 20;
      leaves.push(
        <ellipse
          key={`l${i}${side}`}
          cx={x + Math.cos(((ang - 90) * Math.PI) / 180) * len * 0.5}
          cy={y + Math.sin(((ang - 90) * Math.PI) / 180) * len * 0.5}
          rx={len * 0.24}
          ry={len * 0.55}
          transform={`rotate(${ang} ${x + Math.cos(((ang - 90) * Math.PI) / 180) * len * 0.5} ${y + Math.sin(((ang - 90) * Math.PI) / 180) * len * 0.5})`}
          fill="url(#leaf)"
        />,
      );
    });
    if (i % 2 === 1 || i === 4) {
      for (let c = 0; c < 5; c++) {
        const cx = x + (r() - 0.5) * 20;
        const cy = y + 6 + (r() - 0.3) * 14;
        leaves.push(
          <g key={`c${i}-${c}`}>
            <circle cx={cx} cy={cy} r={6.5} fill={c % 3 === 0 ? "#7c1f14" : "#b23a26"} />
            <circle cx={cx - 2} cy={cy - 2.2} r={1.8} fill="#f3b49a" opacity={0.75} />
          </g>,
        );
      }
    }
  });
  return (
    // Hangs down from a top corner, like the edge of a coffee tree's canopy framing the view.
    <g transform={(flip ? `translate(${W} 0) scale(-1 1) ` : "") + `translate(-20 -12) scale(1.3) translate(0 ${H}) scale(1 -1)`}>
      <path d="M-10 545 C 60 500, 120 455, 190 437 S 290 416, 320 417" stroke="#4b3220" strokeWidth={7} fill="none" strokeLinecap="round" />
      {leaves}
    </g>
  );
}

function Birds() {
  const b = [
    [880, 170, 1],
    [915, 188, 0.8],
    [948, 160, 0.9],
    [430, 140, 0.7],
  ];
  return (
    <g stroke="#4a3426" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.75}>
      {b.map(([x, y, s], i) => (
        <path key={i} d={`M${x - 10 * s} ${y - 3 * s} Q ${x - 4 * s} ${y - 7 * s} ${x} ${y} Q ${x + 4 * s} ${y - 7 * s} ${x + 10 * s} ${y - 3 * s}`} />
      ))}
    </g>
  );
}

export default function FooterScene() {
  return (
    <svg className="footer-scene" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" role="img" aria-label="Illustration of a highland coffee farm at sunset">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9bfc8" />
          <stop offset="0.3" stopColor="#f1d2b8" />
          <stop offset="0.52" stopColor="#f7a874" />
          <stop offset="0.7" stopColor="#fbcb8c" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="1" />
          <stop offset="0.25" stopColor="#ffe3b0" stopOpacity="0.85" />
          <stop offset="1" stopColor="#f7b07a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b58c86" />
          <stop offset="1" stopColor="#d9a98c" />
        </linearGradient>
        <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7f9a4c" />
          <stop offset="1" stopColor="#2f4a22" />
        </linearGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.74" style={{ stopColor: "var(--footer-bg)", stopOpacity: 0 }} />
          <stop offset="0.99" style={{ stopColor: "var(--footer-bg)", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="soft" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="paint" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
        </filter>
      </defs>

      <rect width={W} height={H} fill="url(#sky)" />
      <circle cx={1035} cy={255} r={280} fill="url(#sunGlow)" />
      <circle cx={1035} cy={255} r={46} fill="#fff6e0" />

      {/* clouds, drifting like coffee steam */}
      <g filter="url(#soft)" opacity={0.9}>
        <ellipse cx={260} cy={110} rx={230} ry={42} fill="#fbe7d6" />
        <ellipse cx={420} cy={150} rx={170} ry={30} fill="#f3c2a6" />
        <ellipse cx={1180} cy={120} rx={260} ry={40} fill="#fae2cf" />
        <ellipse cx={980} cy={200} rx={180} ry={24} fill="#f2b796" />
        <ellipse cx={680} cy={70} rx={200} ry={26} fill="#f8e9dc" />
      </g>
      <g fill="none" stroke="#fff3e6" strokeWidth={5} strokeLinecap="round" opacity={0.55}>
        <path d="M150 165 C 230 120, 330 175, 420 130 S 560 120, 600 150" />
        <path d="M1120 185 C 1180 150, 1260 190, 1330 150" />
      </g>

      {/* misty far mountains (two layers for depth) */}
      <path
        d={`M0 ${H} L0 300 C 140 255, 260 240, 380 262 S 560 225, 700 258 S 900 240, 1000 262 S 1230 232, 1440 270 L1440 ${H} Z`}
        fill="#c79c94"
        opacity={0.5}
      />
      <path
        d={`M0 ${H} L0 330 C 120 300, 200 270, 300 285 S 460 250, 560 290 S 760 300, 860 270 S 1040 300, 1160 280 S 1340 250, 1440 300 L1440 ${H} Z`}
        fill="url(#far)"
        opacity={0.75}
      />
      {ridges.map((r, i) => (
        <g key={i}>
          <path d={path(r.top)} fill={r.fill} filter="url(#paint)" />
          <Shrubs k={i} />
        </g>
      ))}
      <Birds />
      <Branch />
      <Branch flip />
      <rect width={W} height={H} fill="url(#fade)" />
    </svg>
  );
}
