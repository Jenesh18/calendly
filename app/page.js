import CTA from "@/components/CTA";
import HeroSection from "@/components/HeroSection";
import HowWorks from "@/components/HowWorks";
import KeyFeatures from "@/components/KeyFeatures";
import TestimonialsCarousal from "@/components/Testimonials";



export default function Home() {
  return (
    <main className="container mx-auto px-4 py-16">
      {/* HERO Section */}
      <HeroSection />
      {/* key features section */}
      <KeyFeatures />
      {/* testimonials section  */}
      <TestimonialsCarousal />
      {/* How It Works Section */}
      <HowWorks />
      {/* CTA Section */}
      <CTA />
    </main>
  );
}
