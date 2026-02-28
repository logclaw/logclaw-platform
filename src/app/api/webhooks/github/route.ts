import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const digest = `sha256=${hmac.digest("hex")}`;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  const event = req.headers.get("x-github-event");

  const secret = process.env.GITHUB_APP_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Handle GitHub App installation events
  if (event === "installation") {
    const action = payload.action as string;
    const installationId = (payload.installation as { id: number })?.id;

    console.log(`GitHub App installation event: ${action} id=${installationId}`);

    // installation created/deleted — surface in app as needed
    return NextResponse.json({ received: true, action });
  }

  // Installation callback redirect (non-webhook — GitHub redirects user here)
  // This is handled separately via the GET handler below
  return NextResponse.json({ received: true, event });
}

// OAuth callback after user installs the GitHub App
// GitHub redirects to: /api/webhooks/github?installation_id=...&setup_action=install
export async function GET(req: NextRequest) {
  const installationId = req.nextUrl.searchParams.get("installation_id");
  const setupAction = req.nextUrl.searchParams.get("setup_action");

  if (!installationId) {
    return NextResponse.redirect(new URL("/onboard?error=no_installation", req.url));
  }

  // Redirect back to onboard wizard with installation_id encoded in URL
  // The wizard reads this param to know the install succeeded
  const redirectUrl = new URL("/onboard", req.url);
  redirectUrl.searchParams.set("installation_id", installationId);
  if (setupAction) redirectUrl.searchParams.set("setup_action", setupAction);

  return NextResponse.redirect(redirectUrl);
}
