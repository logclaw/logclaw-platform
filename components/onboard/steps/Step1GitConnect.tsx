"use client";
import { Github, CheckCircle2, GitBranch } from "lucide-react";

interface Props {
  installationId?: number;
  repo?: string;
  onRepoSelect: (installationId: number, repo: string) => void;
}

export default function Step1GitConnect({ installationId, repo, onRepoSelect }: Props) {
  const installUrl = process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL ?? "https://github.com/apps/logclaw/installations/new";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Connect your Git provider</h2>
        <p className="mt-2 text-text-secondary text-sm">
          LogClaw uses a GitHub App to create a PR with your tenant configuration. The app gets scoped write access to a single repo — nothing else.
        </p>
      </div>

      {!installationId ? (
        <a
          href={installUrl}
          className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-black text-white font-bold rounded-xl border-2 border-black hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
        >
          <Github className="h-5 w-5" />
          Install LogClaw GitHub App
        </a>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">GitHub App installed</p>
              <p className="text-xs text-text-secondary font-mono">Installation ID: {installationId}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Select GitOps repository</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50">
                <GitBranch className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="owner/repo-name"
                  defaultValue={repo}
                  onBlur={(e) => {
                    const val = e.target.value;
                    if (val.includes("/")) onRepoSelect(installationId, val);
                  }}
                  className="flex-1 bg-transparent text-sm outline-none font-mono"
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              e.g. <span className="font-mono">acme-corp/gitops-infra</span> — we'll create <span className="font-mono">gitops/tenants/tenant-{"{id}"}.yaml</span>
            </p>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <p className="text-xs font-semibold mb-1 font-mono">What access does the GitHub App request?</p>
        <ul className="text-xs text-text-secondary space-y-1">
          <li>✓ Read repository contents</li>
          <li>✓ Create branches and pull requests</li>
          <li>✗ No access to other repos, org settings, or secrets</li>
        </ul>
      </div>
    </div>
  );
}
