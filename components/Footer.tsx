import Image from "next/image";
import FooterScene from "./FooterScene";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" {...P}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" {...P}>
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" {...P}>
        <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 4c.5 2.6 2.4 4.3 5 4.5" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" {...P}>
        <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.4 18.6Z" />
        <path d="M9.2 9.3c.3 2.4 2.1 4.3 4.6 5l1.1-1.1-1.6-.9-.8.7a4.5 4.5 0 0 1-2.2-2.2l.7-.8-.9-1.6Z" />
      </svg>
    ),
  },
];

const columns = [
  {
    title: "Explore",
    links: [
      ["Our process", "#grind"],
      ["Shop beans", "#sip"],
      ["Menu", "#menu"],
      ["Order online", "#menu"],
    ],
  },
  {
    title: "Gulpsee",
    links: [
      ["Our story", "#bean"],
      ["Sourcing", "#bean"],
      ["Wholesale", "#"],
      ["Careers", "#"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Delivery", "#"],
      ["FAQs", "#"],
      ["Privacy policy", "#"],
      ["Terms", "#"],
    ],
  },
];

export default function Footer() {
  return (
    <footer id="visit" className="footer">
      <FooterScene />
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <Image src="/brand/wordmark-espresso.png" alt="Gulpsee" width={1200} height={643} className="footer-logo" />
            <p className="footer-tag">
              Freshly ground in Lagos. Specialty beans, poured by hand, worth every gulp.
            </p>
            <p className="footer-hours">
              Mon–Fri 7am – 8pm · Sat–Sun 8am – 9pm
              <br />
              Lagos, Nigeria
            </p>
            <ul className="footer-social">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label}>
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {columns.map((c) => (
            <nav key={c.title} className="footer-col" aria-label={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Gulpsee Coffee. All rights reserved.</span>
          <span>
            Brewed with <span className="footer-heart" aria-label="love">♥</span> in Lagos
          </span>
        </div>
      </div>
    </footer>
  );
}
