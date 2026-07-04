import Hero, { Tagline } from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import Story from "@/components/Story";
import Recipes from "@/components/Recipes";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Merch from "@/components/Merch";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Tagline />
      <BestSellers />
      <Story />
      <Recipes />
      <Testimonials />
      <CTA />
      <Merch />
    </>
  );
}
