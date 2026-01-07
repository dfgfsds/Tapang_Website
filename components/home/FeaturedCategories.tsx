"use client";
import Link from "next/link";
import { useCategories } from "@/context/CategoriesContext";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function FeaturedCategories() {
  const { categories }: any = useCategories();

  const fallbackImage =
    "https://www.archanaskitchen.com/images/archanaskitchen/Dessert_Cookies/Indian_Spicy_Masala_Cookie_Recipe_Khara_Biscuit-1.jpg";

  const [slidesToShow, setSlidesToShow] = useState(5);

  // ✅ Remove duplicate categories (just in case)
  const uniqueCategories = categories?.data
    ? categories.data.filter(
      (cat: any, index: number, self: any[]) =>
        index === self.findIndex((c) => c.id === cat.id)
    )
    : [];

  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 640) setSlidesToShow(1);
      else if (width < 768) setSlidesToShow(2);
      else if (width < 1024) setSlidesToShow(3);
      else if (width < 1280) setSlidesToShow(4);
      else setSlidesToShow(5);
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  // ✅ If only one category → disable infinite loop and autoplay
  const isSingleCategory = uniqueCategories.length <= 1;

  const settings = {
    dots: !isSingleCategory,
    infinite: !isSingleCategory,
    speed: 800,
    slidesToShow: Math.min(slidesToShow, uniqueCategories.length || 1),
    slidesToScroll: 1,
    autoplay: !isSingleCategory,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <section className="py-10 bg-catBgImage">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="font-bold max-w-2xl mx-auto text-sm sm:text-base">
            Explore our range of high-quality, eco-friendly products organized into easy-to-browse categories.
          </p>
        </div>

        {/* ✅ If only 1 category, no slider — just show it */}
        {isSingleCategory ? (
          <div className="flex justify-center">
            {uniqueCategories.map((category: any) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug_name}`}
                className="block group flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300"
              >
                <div className="w-full max-w-[12rem] aspect-square mb-4 overflow-hidden rounded-full mx-auto shadow-lg border border-gray-200">
                  <img
                    src={category.image || fallbackImage}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <Slider {...settings}>
            {uniqueCategories.map((category: any) => (
              <div key={category?.slug_name} className="px-2">
                <Link
                  href={`/categories/${category?.slug_name}`}
                  className="block group flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300"
                >
                  <div className="w-full max-w-[12rem] aspect-square mb-4 overflow-hidden rounded-full mx-auto shadow-lg border border-gray-200">
                    <img
                      src={category.image || fallbackImage}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                </Link>
              </div>
            ))}
          </Slider>
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
