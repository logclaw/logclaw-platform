import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogClaw — AI-Powered SRE Platform",
  description:
    "Enterprise log intelligence platform. Transform terabytes of logs into actionable incidents with self-hosted AI.",
  openGraph: {
    title: "LogClaw — AI-Powered SRE Platform",
    description:
      "Transform terabytes of logs into actionable incidents with self-hosted AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
