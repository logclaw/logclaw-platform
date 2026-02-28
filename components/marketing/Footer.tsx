import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo.svg" alt="LogClaw" className="h-7 w-7" />
              <span className="font-bold">LogClaw</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Self-hosted AI SRE for turning terabytes of logs into actionable incidents.
            </p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Product</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/#features" className="hover:text-black transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-black transition-colors">Pricing</Link></li>
              <li><Link href="/security" className="hover:text-black transition-colors">Security</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Company</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="https://github.com/logclaw/logclaw" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">GitHub</a></li>
              <li><a href="mailto:support@logclaw.ai" className="hover:text-black transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3">Platform</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/sign-in" className="hover:text-black transition-colors">Sign in</Link></li>
              <li><Link href="/onboard" className="hover:text-black transition-colors">Get started</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">© {new Date().getFullYear()} LogClaw. All rights reserved.</p>
          <a href="https://github.com/logclaw/logclaw" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
