'use client';

import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import emptyBox from "../../../../public/img/empty-box.png";

export default function SubCategoryPageClient({
    categorySlug,
    subSlug,
}: {
    categorySlug: string;
    subSlug: string;
}) {
    const { categories, isLoading }: any = useCategories();
    const { products }: any = useProducts();
    const router = useRouter();

    const category = categories?.data?.find(
        (c: any) => String(c.slug_name) === String(categorySlug)
    );

    const subcategory = category?.subcategories?.find(
        (sub: any) => String(sub?.slug_name) === String(subSlug)
    );

    const filteredProducts =
        products?.data?.filter((p: any) => {
            const productCatId =
                typeof p.category === "object"
                    ? p.category?.id
                    : Number(p.category);

            const productSubId =
                typeof p.subcategory === "object"
                    ? p.subcategory?.id
                    : Number(p.subcategory);

            return (
                Number(productCatId) === Number(category?.id) &&
                Number(productSubId) === Number(subcategory?.id)
            );
        }) || [];

    // 4️⃣ Loader UI
    if (isLoading || !category || !subcategory) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="flex flex-col items-center">
                    <svg
                        className="animate-spin h-10 w-10 text-yellow-600 mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>

                    <p className="text-gray-700 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                {/* Page Title */}
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-10 capitalize">
                    {subcategory?.name}
                </h1>

                {/* Product List */}
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center py-20">
                        <Image src={emptyBox} width={180} height={180} alt="empty" />
                        <p className="text-gray-500 mt-4">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredProducts.map((p: any) => (
                            <div
                                key={p.id}
                                onClick={() => router.push(`/products/${p.slug_name}`)}
                                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                <img
                                    src={p.image_urls?.[0]}
                                    alt={p.name}
                                    className="w-full h-44 object-cover"
                                />

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 truncate uppercase">
                                        {p.name}
                                    </h3>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-yellow-600 font-bold">
                                            {formatPrice(p.price)}
                                        </span>

                                        {p.discount && p.discount !== p.price && (
                                            <span className="line-through text-gray-400 text-sm">
                                                {formatPrice(p.discount)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
