import { Shield, Lock, Eye, Server, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">Security</h1>
        <p className="text-text-secondary text-lg mb-16">
          LogClaw is built for enterprises where security is non-negotiable.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {[
            { icon: Shield, title: "SOC 2 Type II", desc: "Currently in progress. Report available to enterprise customers under NDA." },
            { icon: Lock, title: "Data Never Leaves Your VPC", desc: "Air-gapped mode: Ollama in-cluster LLM, Zammad in-cluster ITSM. Zero external egress required." },
            { icon: Eye, title: "GDPR Compliant", desc: "Data residency controls, right to erasure, no telemetry by default." },
            { icon: Server, title: "Encryption", desc: "TLS 1.3 in transit (cert-manager), AES-256 at rest (cloud provider KMS). SCRAM-SHA-512 for Kafka." },
            { icon: CheckCircle2, title: "SAML SSO + SCIM", desc: "Enterprise auth via Okta, Azure AD, Ping Identity. SCIM for automated user provisioning." },
            { icon: Shield, title: "Network Isolation", desc: "Default-deny NetworkPolicy baseline. Every component opens only required ports. Namespace-per-tenant isolation." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 border-2 border-gray-200 rounded-xl hover:border-black transition-colors">
              <div className="w-10 h-10 bg-brand-accent/10 rounded-lg flex items-center justify-center mb-3">
                <Icon className="h-5 w-5 text-brand-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-sm text-text-secondary">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-black rounded-2xl text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Questions about security?</h2>
          <p className="text-gray-400 mb-6">We share pen test reports, architecture diagrams, and audit logs with enterprise customers.</p>
          <a
            href="mailto:security@logclaw.ai"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Contact security@logclaw.ai
          </a>
        </div>
      </div>
    </div>
  );
}
