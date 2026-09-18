import Hero, { BrandHighlights } from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import Recipes from "@/components/Recipes";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
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
      <BrandHighlights highlights={homepage.heroHighlights} />
      <BestSellers title={homepage.bestSellersTitle} />
      <Recipes content={homepage} steps={orderSteps} />
      <Testimonials content={homepage} testimonials={testimonials} />
      <CTA content={homepage} />
    </>
  );
}
