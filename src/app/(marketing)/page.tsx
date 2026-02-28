import Hero from "../../../components/marketing/Hero";
import TrustBar from "../../../components/marketing/TrustBar";
import Architecture from "../../../components/marketing/Architecture";
import Features from "../../../components/marketing/Features";
import ComparisonTable from "../../../components/marketing/ComparisonTable";
import Pricing from "../../../components/marketing/Pricing";
import DemoRequestCTA from "../../../components/marketing/DemoRequestCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Architecture />
      <Features />
      <ComparisonTable />
      <Pricing />
      <DemoRequestCTA />
    </>
  );
}
