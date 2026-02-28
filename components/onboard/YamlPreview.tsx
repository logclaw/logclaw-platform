"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  yaml: string;
}

export default function YamlPreview({ yaml }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Simple syntax highlight via regex replacements
  const highlighted = yaml
    .replace(/^(#.*)$/gm, '<span class="text-gray-400">$1</span>')
    .replace(/^(\s*)([\w-]+):/gm, '$1<span class="text-blue-300">$2</span>:')
    .replace(/:\s+(".*?")/g, ': <span class="text-green-300">$1</span>')
    .replace(/:\s+(true|false)/g, ': <span class="text-yellow-300">$1</span>')
    .replace(/:\s+(\d+)/g, ': <span class="text-orange-300">$1</span>');

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg border border-gray-700">
        <span className="text-xs text-gray-400 font-mono">gitops/tenants/tenant-{"{id}"}.yaml</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-300 p-4 rounded-b-lg overflow-auto text-xs font-mono leading-relaxed max-h-72 border border-gray-700 border-t-0">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
