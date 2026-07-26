const PHRASES = [
  "EARN YOUR REST",
  "SLOW IS SMOOTH — SMOOTH IS FAST",
  "THE ONLY EASY DAY WAS YESTERDAY",
  "SWEAT NOW · SHINE LATER",
  "NO GYM · NO EXCUSES",
  "DISCIPLINE IS A DECISION",
];

export default function Marquee() {
  const line = PHRASES.map((p) => `${p}`).join("  ▲  ");
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y-2 border-line bg-ember py-2"
    >
      <div className="marquee-track flex w-max whitespace-nowrap font-cond text-lg font-bold tracking-[0.25em] text-night">
        <span className="px-4">{line}&nbsp;&nbsp;▲&nbsp;&nbsp;</span>
        <span className="px-4">{line}&nbsp;&nbsp;▲&nbsp;&nbsp;</span>
      </div>
    </div>
  );
}
