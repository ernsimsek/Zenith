export default function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
        )}
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
