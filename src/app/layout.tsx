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

// Skip ClerkProvider when keys aren't configured — lets marketing pages
// render locally without needing a Clerk account set up.
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const htmlShell = (children: React.ReactNode) => (
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
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (hasClerk) {
    return <ClerkProvider>{htmlShell(children)}</ClerkProvider>;
  }
  return htmlShell(children);
}
