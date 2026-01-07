// ❌ No 'use client' here
import SubCategoryPageClient from "./SubCategoryPageClient";

export default function Page({ params }: { params: { id: string; subslug: string } }) {
  console.log("Route Params:", params.id, params.subslug);

  return (
    <SubCategoryPageClient
      categorySlug={params.id}
      subSlug={params.subslug}
    />
  );
}
