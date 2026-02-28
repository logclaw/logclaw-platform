import {
  pgTable,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  uuid,
} from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tier: text("tier").notNull().default("ha"),
  cloudProvider: text("cloud_provider").notNull().default("aws"),
  orgId: text("org_id").notNull(),
  repoFullName: text("repo_full_name"),
  githubInstallationId: text("github_installation_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const metrics = pgTable("metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  collectedAt: timestamp("collected_at").defaultNow().notNull(),
  kafkaLagJson: jsonb("kafka_lag_json"),
  flinkStatusJson: jsonb("flink_status_json"),
  osHealthJson: jsonb("os_health_json"),
  esoStatusJson: jsonb("eso_status_json"),
});

export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  enabled: boolean("enabled").notNull().default(false),
  configJson: jsonb("config_json"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const onboardSessions = pgTable("onboard_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  currentStep: integer("current_step").notNull().default(1),
  valuesJson: jsonb("values_json"),
  prUrl: text("pr_url"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
