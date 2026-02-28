import { Shield, Lock, FileCheck } from "lucide-react";

const logos = [
  { name: "AWS", src: "/logos/aws.svg" },
  { name: "GCP", src: "/logos/gcp.svg" },
  { name: "Azure", src: "/logos/azure.svg" },
  { name: "PagerDuty", src: "/logos/pagerduty.svg" },
  { name: "Jira", src: "/logos/jira.svg" },
  { name: "Slack", src: "/logos/slack.svg" },
  { name: "Splunk", src: "/logos/splunk.svg" },
  { name: "Datadog", src: "/logos/datadog.svg" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-gray-200 bg-background-secondary py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {[
            { icon: Shield, label: "SOC 2 Type II in progress" },
            { icon: Lock, label: "GDPR compliant" },
            { icon: FileCheck, label: "HIPAA ready" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium">
              <Icon className="h-4 w-4 text-brand-accent" />
              {label}
            </div>
          ))}
        </div>

        {/* Integration logos */}
        <p className="text-center text-xs text-text-secondary font-mono mb-6">
          Works with your existing stack
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center justify-center h-8 grayscale hover:grayscale-0 transition-all">
              <img src={logo.src} alt={logo.name} className="h-6 max-w-[80px] object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
