import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="LogClaw" className="h-8 w-8" />
          <span className="font-bold text-xl tracking-tight">LogClaw</span>
        </a>
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#000000",
              colorDanger: "#FF5722",
              borderRadius: "0px",
              fontFamily: "Inter, sans-serif",
            },
            elements: {
              card: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border border-black",
              formButtonPrimary:
                "bg-black text-white hover:bg-gray-900 rounded-none shadow-[4px_4px_0px_0px_rgba(255,87,34,1)]",
              footerActionLink: "text-brand-accent hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}
