"use client";
import { motion } from "framer-motion";
import { Zap, PlayCircle } from "lucide-react";
import Link from "next/link";
import HeroVisual from "./HeroVisual";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white bg-bujo-dot bg-bujo-dot">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-mono rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              AI-Powered SRE for Enterprise Scale
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                Terabytes of logs.{" "}
                <span className="text-brand-accent">Zero manual triage.</span>
              </h1>
              <p className="mt-4 text-lg text-text-secondary leading-relaxed">
                LogClaw is the self-hosted AI SRE agent that continuously monitors your logs, scores anomalies, and autonomously creates incident tickets — so your team focuses on fixing, not finding.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/onboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(255,87,34,1)]"
              >
                <Zap className="h-4 w-4" />
                Start Free Trial
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-lg border-2 border-black hover:bg-gray-50 transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
                Book a Demo
              </a>
            </div>

            {/* Social proof */}
            <p className="text-xs text-text-secondary font-mono">
              Self-hosted · No vendor lock-in · SOC 2 in progress
            </p>
          </motion.div>

          {/* Right: dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
