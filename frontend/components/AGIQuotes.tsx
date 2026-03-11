"use client";

const quotes = [
  {
    quote: "I think we'll have AI that is smarter than any one human probably around the end of next year.",
    person: "Elon Musk",
    role: "CEO, Tesla / xAI",
    date: "April 2024",
  },
  {
    quote: "I think there's a meaningful chance we'll have something that we could describe as AGI by 2027.",
    person: "Sam Altman",
    role: "CEO, OpenAI",
    date: "January 2025",
  },
  {
    quote: "I'm pretty confident we're going to get to basically human-level AI in 2-3 years.",
    person: "Dario Amodei",
    role: "CEO, Anthropic",
    date: "October 2024",
  },
  {
    quote: "The pace of progress is extraordinary. AI will be the most transformative technology in human history.",
    person: "Sundar Pichai",
    role: "CEO, Google",
    date: "2024",
  },
  {
    quote: "AI will eliminate most white-collar jobs within the next decade.",
    person: "Vinod Khosla",
    role: "Founder, Khosla Ventures",
    date: "2024",
  },
  {
    quote: "We are at an inflection point. AI coding tools can now do 80% of what junior developers do.",
    person: "Jensen Huang",
    role: "CEO, NVIDIA",
    date: "March 2025",
  },
  {
    quote: "We could get to AGI by 2028, and shortly after that, superintelligence.",
    person: "Leopold Aschenbrenner",
    role: "Former OpenAI researcher",
    date: "June 2024",
  },
  {
    quote: "The jobs that AI will impact first are knowledge workers  - exactly the people coming out of universities.",
    person: "Marc Andreessen",
    role: "Co-founder, a16z",
    date: "2024",
  },
];

export default function AGIQuotes({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/5" />
      <div
        className="absolute top-14 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 w-[calc(100%-2rem)] md:w-[600px] max-h-[70vh] overflow-y-auto bg-white border border-[var(--border)] rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
                Why AGI Mode?
              </h3>
              <p className="text-sm text-[var(--muted)] max-w-md">
                These are the people building the AI. This is what they&apos;re saying about when it arrives.
                AGI mode models their timelines.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--muted)] hover:text-[var(--foreground)] text-lg"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            {quotes.map((q, i) => (
              <div
                key={i}
                className="border-l-2 border-[var(--border)] pl-4 py-1"
              >
                <p className="text-sm leading-relaxed mb-1.5">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">
                  {q.person}  - {q.role}, {q.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
