"use client";

interface LLMConfig {
  provider: "claude" | "openai" | "ollama" | "vllm" | "disabled";
  model: string;
}

const PROVIDERS = [
  { value: "disabled", label: "Disabled", desc: "No LLM. Tickets created without RCA summaries." },
  { value: "ollama", label: "Ollama (in-cluster)", desc: "Llama 3.2, Mistral, etc. Fully air-gapped. No API costs.", badge: "Recommended" },
  { value: "claude", label: "Claude (Anthropic)", desc: "claude-sonnet-4-6 or claude-opus-4-6. Best RCA quality." },
  { value: "openai", label: "OpenAI", desc: "GPT-4o, o1. Requires OPENAI_API_KEY in secret store." },
  { value: "vllm", label: "vLLM (custom endpoint)", desc: "Self-hosted vLLM inference server. Provide endpoint URL." },
];

const OLLAMA_MODELS = ["llama3.2:8b", "llama3.2:3b", "mistral:7b", "gemma2:9b"];
const CLAUDE_MODELS = ["claude-sonnet-4-6", "claude-opus-4-6", "claude-haiku-4-5-20251001"];
const OPENAI_MODELS = ["gpt-4o", "gpt-4o-mini", "o1-mini"];

interface Props {
  config: LLMConfig;
  onChange: (c: LLMConfig) => void;
}

export default function Step5LLM({ config, onChange }: Props) {
  const modelOptions =
    config.provider === "ollama" ? OLLAMA_MODELS :
    config.provider === "claude" ? CLAUDE_MODELS :
    config.provider === "openai" ? OPENAI_MODELS : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">LLM provider</h2>
        <p className="mt-2 text-text-secondary text-sm">The LLM generates root cause analysis summaries and ticket descriptions.</p>
      </div>

      <div className="space-y-2">
        {PROVIDERS.map((p) => (
          <div
            key={p.value}
            onClick={() => onChange({ provider: p.value as LLMConfig["provider"], model: modelOptions[0] ?? "" })}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${config.provider === p.value ? "border-black bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "border-gray-200 hover:border-gray-400"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{p.label}</p>
                  {p.badge && <span className="text-xs bg-brand-accent text-white px-1.5 py-0.5 rounded font-mono">{p.badge}</span>}
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{p.desc}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${config.provider === p.value ? "bg-black border-black" : "border-gray-300"}`} />
            </div>
          </div>
        ))}
      </div>

      {modelOptions.length > 0 && (
        <div>
          <label className="block text-sm font-semibold mb-2">Model</label>
          <select
            value={config.model}
            onChange={(e) => onChange({ ...config, model: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black rounded-lg text-sm font-mono outline-none bg-white"
          >
            {modelOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      )}

      {config.provider === "ollama" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-mono">
          Ollama will be deployed as a pod in your namespace. Model weights (~4GB for llama3.2:8b) stored on a PVC.
        </div>
      )}
    </div>
  );
}
