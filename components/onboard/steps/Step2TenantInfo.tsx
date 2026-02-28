"use client";
import { useState } from "react";

interface TenantInfo {
  tenantId: string;
  tenantName: string;
  tier: "standard" | "ha" | "ultra-ha";
  cloudProvider: "aws" | "gcp" | "azure";
  bucket: string;
  region: string;
}

interface Props {
  values: TenantInfo;
  onChange: (v: TenantInfo) => void;
}

export default function Step2TenantInfo({ values, onChange }: Props) {
  const [slugError, setSlugError] = useState("");

  function validateSlug(v: string) {
    if (!/^[a-z0-9-]+$/.test(v)) {
      setSlugError("Lowercase letters, numbers, and hyphens only");
    } else {
      setSlugError("");
    }
    onChange({ ...values, tenantId: v });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tenant configuration</h2>
        <p className="mt-2 text-text-secondary text-sm">This becomes your Kubernetes namespace: <span className="font-mono bg-gray-100 px-1 rounded">logclaw-{"{tenant-id}"}</span></p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1">Tenant ID *</label>
          <input
            type="text"
            value={values.tenantId}
            onChange={(e) => validateSlug(e.target.value.toLowerCase())}
            placeholder="acme-corp"
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black rounded-lg font-mono text-sm outline-none transition-colors"
          />
          {slugError && <p className="mt-1 text-xs text-red-500">{slugError}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold mb-1">Tenant Name *</label>
          <input
            type="text"
            value={values.tenantName}
            onChange={(e) => onChange({ ...values, tenantName: e.target.value })}
            placeholder="Acme Corporation"
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black rounded-lg text-sm outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Deployment Tier</label>
          <select
            value={values.tier}
            onChange={(e) => onChange({ ...values, tier: e.target.value as TenantInfo["tier"] })}
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black rounded-lg text-sm outline-none bg-white"
          >
            <option value="standard">Standard (1-node PoC)</option>
            <option value="ha">HA (3-node production)</option>
            <option value="ultra-ha">Ultra-HA (multi-AZ)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Cloud Provider</label>
          <select
            value={values.cloudProvider}
            onChange={(e) => onChange({ ...values, cloudProvider: e.target.value as TenantInfo["cloudProvider"] })}
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black rounded-lg text-sm outline-none bg-white"
          >
            <option value="aws">AWS</option>
            <option value="gcp">GCP</option>
            <option value="azure">Azure</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Object Storage Bucket</label>
          <input
            type="text"
            value={values.bucket}
            onChange={(e) => onChange({ ...values, bucket: e.target.value })}
            placeholder="logclaw-acme-corp-data"
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black rounded-lg font-mono text-sm outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Region</label>
          <input
            type="text"
            value={values.region}
            onChange={(e) => onChange({ ...values, region: e.target.value })}
            placeholder="us-east-1"
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black rounded-lg font-mono text-sm outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
