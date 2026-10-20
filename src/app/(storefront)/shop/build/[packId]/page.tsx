import BoxBuilderClient from "@/components/shop/BoxBuilderClient";

type BoxBuilderPageProps = {
  params: Promise<{ packId: string }> | { packId: string };
};

export default async function BoxBuilderPage({ params }: BoxBuilderPageProps) {
  const resolved = await Promise.resolve(params);
  return <BoxBuilderClient packId={resolved.packId} />;
}
