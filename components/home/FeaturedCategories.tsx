"use client";
import Link from "next/link";
import { useCategories } from "@/context/CategoriesContext";
import { useMemo, useRef } from "react";

export default function FeaturedCategories() {
  const { categories, isLoading }: any = useCategories();

  const fallbackImage =
    "https://www.archanaskitchen.com/images/archanaskitchen/Dessert_Cookies/Indian_Spicy_Masala_Cookie_Recipe_Khara_Biscuit-1.jpg";

  const lastValidCategories = useRef<any[]>([]);

  const uniqueCategories = useMemo(() => {
    const rawData = categories?.data || [];

    if (rawData.length === 0) {
      return lastValidCategories.current.length > 0 ? lastValidCategories.current : [];
    }

    const filtered = rawData.filter(
      (cat: any, index: number, self: any[]) =>
        index === self.findIndex((c) => c.id === cat.id)
    );

    lastValidCategories.current = filtered;
    return filtered;
  }, [categories?.data]);

  const showSkeleton = isLoading && uniqueCategories.length === 0;

  // Triple the list for seamless infinite CSS-only scroll
  const infiniteCategories = [...uniqueCategories, ...uniqueCategories, ...uniqueCategories];

  return (
    <section className="py-10 bg-orange-50 bg-catBgImage bg-cover bg-center bg-no-repeat" style={{ minHeight: '400px' }}>
      <div className="mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="font-bold max-w-2xl mx-auto text-sm sm:text-base">
            Explore our range of high-quality, eco-friendly products organized into easy-to-browse categories.
          </p>
        </div>

        {showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`cat-skeleton-${i}`} className="flex flex-col items-center p-4 animate-pulse">
                <div className="w-full max-w-[12rem] aspect-square mb-4 rounded-full bg-gray-200 shadow-sm shadow-gray-300"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cat-marquee">
            <div className="cat-marquee-track">
              {infiniteCategories.map((category: any, idx: number) => (
                <div key={`${category?.slug_name || category?.id}-${idx}`} className="cat-marquee-item">
                  <Link
                    href={`/categories/${category?.slug_name}`}
                    className="block group flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300"
                  >
                    <div className="w-full max-w-[12rem] aspect-square mb-4 overflow-hidden rounded-full mx-auto shadow-lg border border-gray-200">
                      <img
                        src={category.image || fallbackImage}
                        alt={category.name}
                        loading="eager"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center font-medium hover:underline text-sm sm:text-base"
          >
            View All Categories
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
