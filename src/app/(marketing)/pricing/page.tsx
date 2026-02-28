import Pricing from "../../../../components/marketing/Pricing";
import DemoRequestCTA from "../../../../components/marketing/DemoRequestCTA";

export default function PricingPage() {
  return (
    <>
      <div className="pt-24 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">Pricing</h1>
          <p className="mt-4 text-text-secondary text-lg">Start free, scale as needed.</p>
        </div>
      </div>
      <Pricing />
      <DemoRequestCTA />
    </>
  );
}
