"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import WizardShell from "../../../../components/onboard/WizardShell";
import Step1GitConnect from "../../../../components/onboard/steps/Step1GitConnect";
import Step2TenantInfo from "../../../../components/onboard/steps/Step2TenantInfo";
import Step3Components from "../../../../components/onboard/steps/Step3Components";
import Step4Ticketing from "../../../../components/onboard/steps/Step4Ticketing";
import Step5LLM from "../../../../components/onboard/steps/Step5LLM";
import Step6Review from "../../../../components/onboard/steps/Step6Review";
import Step7Deploy from "../../../../components/onboard/steps/Step7Deploy";
import dump from "js-yaml";

const DEFAULT_TICKETING = {
  pagerduty: { enabled: false },
  jira: { enabled: false, baseUrl: "", projectKey: "" },
  servicenow: { enabled: false },
  opsgenie: { enabled: false },
  zammad: { enabled: false, groupName: "SRE Incidents" },
  slack: { enabled: false, channel: "#sre-incidents" },
  routing: { critical: [] as string[], high: [] as string[], medium: [] as string[], low: [] as string[] },
};

const DEFAULT_COMPONENTS = {
  kafka: true,
  flink: true,
  opensearch: true,
  mlEngine: true,
  airflow: false,
  ticketingAgent: true,
};

export default function OnboardPage() {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [gitInstallationId, setGitInstallationId] = useState<number | undefined>();
  const [repo, setRepo] = useState("");
  const [tenantInfo, setTenantInfo] = useState<{ tenantId: string; tenantName: string; tier: "ha" | "standard" | "ultra-ha"; cloudProvider: "aws" | "gcp" | "azure"; bucket: string; region: string }>({ tenantId: "", tenantName: "", tier: "ha", cloudProvider: "aws", bucket: "", region: "us-east-1" });
  const [components, setComponents] = useState(DEFAULT_COMPONENTS);
  const [ticketing, setTicketing] = useState(DEFAULT_TICKETING);
  const [llm, setLlm] = useState<{ provider: "ollama" | "claude" | "openai" | "vllm" | "disabled"; model: string }>({ provider: "ollama", model: "llama3.2:8b" });
  const [prUrl, setPrUrl] = useState<string | undefined>();
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | undefined>();

  function generateYaml(): string {
    const enabledPlatforms = Object.entries(ticketing)
      .filter(([k, v]) => k !== "routing" && (v as any).enabled)
      .map(([k]) => k);

    const criticalRouting = ["pagerduty", "jira", "zammad", "slack"].filter((p) => ticketing[p as keyof typeof ticketing] && (ticketing[p as keyof typeof ticketing] as any).enabled);
    const highRouting = ["jira", "zammad", "slack"].filter((p) => ticketing[p as keyof typeof ticketing] && (ticketing[p as keyof typeof ticketing] as any).enabled);

    const ns = `logclaw-${tenantInfo.tenantId}`;
    const vals: Record<string, unknown> = {
      tenantId: tenantInfo.tenantId,
      clusterServer: "",
      global: {
        tenantName: tenantInfo.tenantName,
        tenantId: tenantInfo.tenantId,
        storageClass: tenantInfo.cloudProvider === "aws" ? "gp3" : tenantInfo.cloudProvider === "gcp" ? "standard-rwo" : "managed-premium",
        storageClassHighThroughput: tenantInfo.cloudProvider === "aws" ? "io2" : tenantInfo.cloudProvider === "gcp" ? "premium-rwo" : "managed-premium",
        tier: tenantInfo.tier,
        topologyKey: "topology.kubernetes.io/zone",
        objectStorage: { provider: tenantInfo.cloudProvider === "gcp" ? "gcs" : tenantInfo.cloudProvider === "azure" ? "azure" : "s3", bucket: tenantInfo.bucket, region: tenantInfo.region },
        secretStore: { provider: tenantInfo.cloudProvider, name: "logclaw-secret-store", kind: "ClusterSecretStore", region: tenantInfo.region },
        kafkaBrokers: `logclaw-kafka-${tenantInfo.tenantId}-kafka-bootstrap.${ns}.svc.cluster.local:9093`,
        kafkaTopics: { rawLogs: "raw-logs", anomalies: "anomalies", enriched: "enriched-logs" },
        opensearchEndpoint: `https://logclaw-opensearch-${tenantInfo.tenantId}.${ns}.svc.cluster.local:9200`,
        llm: { provider: llm.provider, model: llm.model },
        monitoring: { enabled: true, prometheusNamespace: "monitoring" },
      },
      platform: { enabled: true },
      kafka: { enabled: components.kafka },
      flink: { enabled: components.flink },
      opensearch: { enabled: components.opensearch },
      mlEngine: { enabled: components.mlEngine },
      airflow: { enabled: components.airflow },
      ticketingAgent: { enabled: components.ticketingAgent },
      "logclaw-ticketing-agent": {
        config: {
          pagerduty: ticketing.pagerduty,
          jira: ticketing.jira,
          servicenow: ticketing.servicenow,
          opsgenie: ticketing.opsgenie,
          zammad: ticketing.zammad,
          slack: ticketing.slack,
          routing: {
            critical: criticalRouting,
            high: highRouting,
            medium: highRouting.filter((p) => p !== "slack"),
            low: ["jira"].filter((p) => ticketing.jira.enabled),
          },
          anomaly: { minimumScore: 0.9 },
        },
      },
      zammad: { enabled: ticketing.zammad.enabled },
    };
    return dump.dump(vals);
  }

  async function handleDeploy() {
    if (!repo || !gitInstallationId) return;
    setDeploying(true);
    setDeployError(undefined);
    try {
      const [owner, repoName] = repo.split("/");
      const res = await fetch("/api/onboard/pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          installationId: gitInstallationId,
          owner,
          repo: repoName,
          tenantId: tenantInfo.tenantId,
          tenantName: tenantInfo.tenantName,
          yamlContent: generateYaml(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create PR");
      setPrUrl(data.prUrl);
    } catch (e: any) {
      setDeployError(e.message);
    } finally {
      setDeploying(false);
    }
  }

  const yaml = generateYaml();
  const isStep7 = step === 7;

  return (
    <WizardShell
      currentStep={step}
      onBack={() => setStep((s) => Math.max(1, s - 1))}
      onNext={() => {
        if (step === 6) {
          setStep(7);
          handleDeploy();
        } else {
          setStep((s) => Math.min(7, s + 1));
        }
      }}
      nextLabel={step === 6 ? "Create PR & Deploy" : step === 7 ? "Go to Dashboard" : "Continue"}
      nextDisabled={step === 7 && !prUrl}
    >
      {step === 1 && <Step1GitConnect installationId={gitInstallationId} repo={repo} onRepoSelect={(id, r) => { setGitInstallationId(id); setRepo(r); }} />}
      {step === 2 && <Step2TenantInfo values={tenantInfo} onChange={setTenantInfo} />}
      {step === 3 && <Step3Components enabled={components} onChange={(k, v) => setComponents((c) => ({ ...c, [k]: v }))} />}
      {step === 4 && <Step4Ticketing config={ticketing} onChange={(c) => setTicketing({ pagerduty: c.pagerduty, jira: { enabled: c.jira.enabled, baseUrl: c.jira.baseUrl ?? "", projectKey: c.jira.projectKey ?? "" }, servicenow: c.servicenow, opsgenie: c.opsgenie, zammad: { enabled: c.zammad.enabled, groupName: c.zammad.groupName ?? "SRE Incidents" }, slack: { enabled: c.slack.enabled, channel: c.slack.channel ?? "#sre-incidents" }, routing: c.routing ?? { critical: [], high: [], medium: [], low: [] } })} />}
      {step === 5 && <Step5LLM config={llm} onChange={setLlm} />}
      {step === 6 && <Step6Review yaml={yaml} errors={[]} />}
      {step === 7 && <Step7Deploy prUrl={prUrl} loading={deploying} error={deployError} tenantId={tenantInfo.tenantId} />}
    </WizardShell>
  );
}
