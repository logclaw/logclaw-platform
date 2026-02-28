import { z } from "zod";

const tierEnum = z.enum(["standard", "ha", "ultra-ha"]);
const cloudProviderEnum = z.enum(["aws", "gcp", "azure"]);
const llmProviderEnum = z.enum(["claude", "openai", "ollama", "vllm", "disabled"]);

export const tenantValuesSchema = z.object({
  tenantId: z.string().min(2).max(63).regex(/^[a-z0-9-]+$/, {
    message: "Tenant ID must be lowercase alphanumeric with hyphens only",
  }),
  global: z.object({
    tenantName: z.string().min(1),
    storageClass: z.string().default("gp3"),
    storageClassHighThroughput: z.string().default("io2"),
    tier: tierEnum.default("ha"),
    objectStorage: z.object({
      provider: z.enum(["s3", "gcs", "azure"]).default("s3"),
      bucket: z.string().min(1),
      region: z.string().default("us-east-1"),
    }),
    secretStore: z.object({
      provider: z.enum(["aws", "gcp", "vault", "azure"]).default("aws"),
      region: z.string().default("us-east-1"),
    }),
    llm: z.object({
      provider: llmProviderEnum.default("disabled"),
      model: z.string().default("llama3.2:8b"),
    }).default({}),
  }),
  platform: z.object({ enabled: z.boolean().default(true) }).default({}),
  kafka: z.object({ enabled: z.boolean().default(true) }).default({}),
  flink: z.object({ enabled: z.boolean().default(true) }).default({}),
  opensearch: z.object({ enabled: z.boolean().default(true) }).default({}),
  mlEngine: z.object({ enabled: z.boolean().default(true) }).default({}),
  airflow: z.object({ enabled: z.boolean().default(false) }).default({}),
  ticketingAgent: z.object({ enabled: z.boolean().default(true) }).default({}),
  "logclaw-ticketing-agent": z.object({
    config: z.object({
      pagerduty: z.object({ enabled: z.boolean().default(false) }).default({}),
      jira: z.object({
        enabled: z.boolean().default(false),
        baseUrl: z.string().url().optional(),
        projectKey: z.string().optional(),
      }).default({}),
      servicenow: z.object({ enabled: z.boolean().default(false) }).default({}),
      opsgenie: z.object({ enabled: z.boolean().default(false) }).default({}),
      zammad: z.object({ enabled: z.boolean().default(false) }).default({}),
      slack: z.object({
        enabled: z.boolean().default(false),
        channel: z.string().optional(),
      }).default({}),
    }).default({}),
  }).default({}),
});

export type TenantValues = z.infer<typeof tenantValuesSchema>;

export function validateTenantValues(data: unknown): { success: true; data: TenantValues } | { success: false; errors: string[] } {
  const result = tenantValuesSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
  };
}
