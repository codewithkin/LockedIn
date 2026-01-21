import {
  Navbar,
  HeroSection,
  FeaturesSection,
  MissionSection,
  TestimonialsSection,
  DownloadSection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <MissionSection />
      <TestimonialsSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}
