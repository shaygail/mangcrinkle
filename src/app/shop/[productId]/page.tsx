import ProductDetailClient from "@/components/ProductDetailClient";

type ProductPageProps = {
  params: Promise<{ productId: string }> | { productId: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const resolved = await Promise.resolve(params);
  return <ProductDetailClient productId={resolved.productId} />;
}
