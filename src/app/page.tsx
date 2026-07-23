import Hero, { Tagline } from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import Story from "@/components/Story";
import Recipes from "@/components/Recipes";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Merch from "@/components/Merch";
import {
  getHomepage,
  getOrderSteps,
  getTestimonials,
} from "@/lib/strapi";

export default async function HomePage() {
  const [homepage, testimonials, orderSteps] = await Promise.all([
    getHomepage(),
    getTestimonials(),
    getOrderSteps(),
  ]);

  return (
    <>
      <Hero content={homepage} />
      <Tagline content={homepage} />
      <BestSellers />
      <Story content={homepage} />
      <Recipes content={homepage} steps={orderSteps} />
      <Testimonials content={homepage} testimonials={testimonials} />
      <CTA content={homepage} />
      <Merch />
    </>
  );
}
