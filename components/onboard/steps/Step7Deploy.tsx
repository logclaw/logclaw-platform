"use client";
import { ExternalLink, GitPullRequest, CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  prUrl?: string;
  loading?: boolean;
  error?: string;
  tenantId: string;
}

export default function Step7Deploy({ prUrl, loading, error, tenantId }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Deploy</h2>
        <p className="mt-2 text-text-secondary text-sm">
          We're creating a pull request to your GitOps repository. Once merged, ArgoCD picks it up automatically.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
          <span className="ml-3 text-sm text-text-secondary">Creating pull request...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {prUrl && !loading && (
        <div className="space-y-4">
          <div className="p-5 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="font-bold text-green-700">Pull request created!</p>
            </div>
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 font-mono underline"
            >
              <GitPullRequest className="h-4 w-4" />
              {prUrl}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="p-4 border border-gray-200 rounded-xl space-y-2">
            <p className="text-sm font-semibold">Next steps</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-text-secondary">
              <li>Review the generated YAML in the PR</li>
              <li>Merge the PR to trigger ArgoCD sync</li>
              <li>Monitor your deployment in the <a href={`/dashboard`} className="text-black underline">LogClaw dashboard</a></li>
              <li>Full stack operational in ~30 minutes</li>
            </ol>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-text-secondary font-mono">
            kubectl get all -n logclaw-{tenantId}
          </div>
        </div>
      )}
    </div>
  );
}
