"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Database, AlertTriangle, Plug, Settings, Plus, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

interface Tenant {
  id: string;
  slug: string;
  name: string;
  health: "healthy" | "degraded" | "critical";
}

interface Props {
  tenants: Tenant[];
  activeTenantId?: string;
}

const NAV_ITEMS = [
  { href: "", icon: LayoutDashboard, label: "Overview" },
  { href: "/kafka", icon: Database, label: "Kafka" },
  { href: "/anomalies", icon: AlertTriangle, label: "Anomalies" },
  { href: "/integrations", icon: Plug, label: "Integrations" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const HEALTH_DOT = {
  healthy: "bg-green-500",
  degraded: "bg-yellow-500",
  critical: "bg-red-500 animate-pulse",
};

export default function TenantSidebar({ tenants, activeTenantId }: Props) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="w-64 bg-gray-950 text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <img src="/logo.svg" alt="LogClaw" className="h-7 w-7" />
        <span className="font-bold">LogClaw</span>
      </div>

      {/* Tenants */}
      <div className="px-3 py-4 border-b border-white/10 flex-shrink-0">
        <p className="text-xs font-mono text-gray-500 px-2 mb-2 uppercase tracking-wider">Tenants</p>
        <div className="space-y-1">
          {tenants.map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/${t.id}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${activeTenantId === t.id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${HEALTH_DOT[t.health]}`} />
              <span className="truncate">{t.name}</span>
            </Link>
          ))}
        </div>
        <Link
          href="/onboard"
          className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add tenant
        </Link>
      </div>

      {/* Nav */}
      {activeTenantId && (
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-xs font-mono text-gray-500 px-2 mb-2 uppercase tracking-wider">Navigation</p>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const full = `/dashboard/${activeTenantId}${href}`;
            const active = pathname === full;
            return (
              <Link
                key={href}
                href={full}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${active ? "bg-brand-accent/20 text-brand-accent" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-500 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
