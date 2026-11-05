// Small line icons for the feature callouts (24x24, stroke = currentColor).
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const icons = {
  bean: (
    <>
      <ellipse cx="12" cy="12" rx="6" ry="8.5" transform="rotate(-25 12 12)" />
      <path d="M14.8 4.6c-3.2 2.2-1.6 6-3.2 8.4-1.2 1.8-3.4 2.4-4.4 4.6" />
    </>
  ),
  flame: <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-4 3.4-5.6 3.9-9.8 2.6 1.6 3.4 3.7 3.4 5.4 1-.7 1.6-1.8 1.7-3 2 1.5 4 4.1 4 7.4 0 3.6-2.6 6.2-6.5 6.2Z" />,
  burr: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  grain: (
    <>
      <circle cx="7" cy="8" r="1.4" />
      <circle cx="12" cy="6" r="1.1" />
      <circle cx="16.5" cy="9" r="1.5" />
      <circle cx="9.5" cy="12.5" r="1.2" />
      <circle cx="14" cy="13.5" r="1.3" />
      <circle cx="8" cy="17" r="1.1" />
      <circle cx="12.5" cy="18" r="1.4" />
      <circle cx="17" cy="16.5" r="1" />
    </>
  ),
  aroma: <path d="M8 20c-2-2.5 2-4.5 0-7s2-4.5 0-7M12 20c-2-2.5 2-4.5 0-7s2-4.5 0-7M16 20c-2-2.5 2-4.5 0-7s2-4.5 0-7" />,
  cup: (
    <>
      <path d="M4.5 9h12v4.5a6 6 0 0 1-12 0V9Z" />
      <path d="M16.5 10.5h1.2a2.3 2.3 0 0 1 0 4.6h-1.6M3 21h15" />
    </>
  ),
  hand: <path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11m0-5.5V4.8a1.5 1.5 0 0 1 3 0V11m0-4.5a1.5 1.5 0 0 1 3 0V12m0-3a1.5 1.5 0 0 1 3 0v4.5c0 4.1-3 7.5-7 7.5-2.8 0-4.4-1.4-5.8-3.6L4.1 13.6a1.4 1.4 0 0 1 2.3-1.6L7 13" />,
  thermo: (
    <>
      <path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0Z" />
      <path d="M12 9v7" />
    </>
  ),
  spiral: <path d="M12 12.5a1 1 0 1 1 1-1.5 2.5 2.5 0 1 1-3.4-2.8A4.5 4.5 0 1 1 7.5 15a6.5 6.5 0 1 1 11-6.5" />,
  leaf: (
    <>
      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
      <path d="M5 19c3-4 6-7 9-9" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17.5" cy="17.5" r="1.6" />
    </>
  ),
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...P} aria-hidden="true">
      {icons[name]}
    </svg>
  );
}
