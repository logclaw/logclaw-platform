import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Self-hosted on your infrastructure.",
    features: [
      "Open-source core (Apache 2.0)",
      "Unlimited local log volume",
      "Ollama in-cluster LLM",
      "Community support (GitHub)",
      "BYOL (Bring Your Own License)",
    ],
    cta: "Deploy Free",
    href: "https://github.com/logclaw/logclaw",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo per tenant",
    description: "Managed updates, priority support.",
    features: [
      "Everything in Starter",
      "Managed chart updates & CVE patches",
      "10M logs / month included",
      "3 ticketing connectors",
      "Email support (< 24h response)",
      "Access to enterprise portal",
    ],
    cta: "Start Free Trial",
    href: "/onboard",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "VPC deployment, SLAs, SAML SSO.",
    features: [
      "Everything in Pro",
      "VPC / air-gapped deployment",
      "Joint architecture design",
      "SAML SSO + SCIM provisioning",
      "SOC 2 audit reports",
      "Dedicated Slack Connect channel",
      "Custom connector development",
    ],
    cta: "Contact Sales",
    href: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#",
    highlight: false,
    external: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Simple, honest pricing</h2>
          <p className="mt-4 text-text-secondary text-lg">Start free. Scale with confidence.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const cardClass = plan.highlight
              ? "border-2 border-black bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              : "border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors";
            return (
              <div key={plan.name} className={`rounded-2xl p-8 flex flex-col ${cardClass}`}>
                <div className="mb-6">
                  {plan.highlight && (
                    <span className="inline-block mb-3 px-2 py-0.5 bg-brand-accent text-white text-xs font-bold rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-text-secondary text-sm">{plan.period}</span>}
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{plan.description}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-brand-accent" : "text-green-600"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.external ? (
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center px-6 py-3 rounded-lg font-bold text-sm border-2 transition-colors ${plan.highlight ? "bg-brand-accent text-white border-brand-accent hover:bg-orange-600" : "bg-white text-black border-black hover:bg-gray-50"}`}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.href}
                    className={`block text-center px-6 py-3 rounded-lg font-bold text-sm border-2 transition-colors ${plan.highlight ? "bg-brand-accent text-white border-brand-accent hover:bg-orange-600" : "bg-white text-black border-black hover:bg-gray-50"}`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
