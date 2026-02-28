import { Calendar, ArrowRight } from "lucide-react";

export default function DemoRequestCTA() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
          See LogClaw in action
        </h2>
        <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
          30-minute live demo — we'll deploy LogClaw on your cluster while you watch. See the first anomaly detected and ticket created in real time.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-accent text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
          >
            <Calendar className="h-4 w-4" />
            Book a Demo
          </a>
          <a
            href="https://github.com/logclaw/logclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
          >
            Deploy Free <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-500 font-mono">
          No credit card required · Deploy in 30 minutes · Self-hosted forever free
        </p>
      </div>
    </section>
  );
}
