// 'use client';

// import { useCategories } from "@/context/CategoriesContext";
// import { useProducts } from "@/context/ProductsContext";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { ArrowLeft } from "lucide-react";
// import { formatPrice } from "@/lib/utils";
// import emptyBox from "../../../public/img/empty-box.png";

// export default function CategoryPageClient({ id }: { id: string }) {
//   const { categories, isLoading }: any = useCategories();
//   const { products }: any = useProducts();
//   const router = useRouter();
// console.log(id)
//   // Find the category using slug_name or id
//   const findCategory = categories?.data?.find(
//     (item: any) =>
//       String(item?.slug_name) === String(id)
//   );

//   console.log(findCategory)
//   // Handle filtered products more robustly
//   const filteredProducts =
//     products?.data?.filter((item: any) => {
//       // Case 1: if category is a number ID
//       if (typeof item?.category === "number") {
//         return item?.category === Number(findCategory?.id);
//       }
//       // Case 2: if category is an object
//       if (typeof item?.category === "object" && item?.category?.id) {
//         return Number(item?.category?.id) === Number(findCategory?.id);
//       }
//       // Case 3: if category is a string (slug)
//       if (typeof item?.category === "string") {
//         return item?.category === findCategory?.slug_name;
//       }
//       return false;
//     }) || [];

//   console.log("Category:", findCategory?.id);
//   console.log("Filtered Products:", filteredProducts);
//   console.log("All Products:", products);

//   // 🔄 Loading skeleton
//   if (isLoading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
//           {Array.from({ length: 8 }).map((_, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-lg shadow-md h-60 animate-pulse"
//             >
//               <div className="h-40 bg-yellow-200"></div>
//               <div className="p-4 space-y-2">
//                 <div className="h-4 bg-yellow-200 w-3/4 rounded"></div>
//                 <div className="h-3 bg-yellow-200 w-1/2 rounded"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ❌ Empty state
//   if (!filteredProducts || filteredProducts.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20">
//         <Image
//           src={emptyBox}
//           alt="Empty"
//           width={200}
//           height={200}
//           className="mb-6"
//         />
//         <p className="text-lg font-semibold text-gray-600">
//           No products found in this category.
//         </p>
//         <button
//           onClick={() => router.back()}
//           className="mt-4 flex items-center gap-2 text-yellow-600 hover:text-yellow-800 transition"
//         >
//           <ArrowLeft size={18} />
//           Back
//         </button>
//       </div>
//     );
//   }

//   // ✅ Product Grid
//   return (
//     <div className="bg-yellow-50 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <button
//           className="flex items-center gap-2 text-gray-600 hover:text-yellow-700 transition mb-6"
//           onClick={() => router.back()}
//         >
//           <ArrowLeft />
//           <span>Back</span>
//         </button>

//         <h1 className="text-3xl font-bold text-center capitalize text-gray-900 mb-10">
//           {findCategory?.name || "Category Not Found"}
//         </h1>

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//           {filteredProducts.map((product: any) => (
//             <div
//               key={product.id}
//               onClick={() => router.push(`/products/${product.slug_name}`)}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
//             >
//               <div className="aspect-square relative overflow-hidden">
//                 <img
//                   src={
//                     product?.image_urls?.[0] ||
//                     "https://semantic-ui.com/images/wireframe/image.png"
//                   }
//                   alt={product?.name}
//                   className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                 />
//               </div>

//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-yellow-600 truncate uppercase">
//                   {product?.name}
//                 </h2>

//                 <div className="mt-2">
//                   <span className="text-yellow-600 font-medium">
//                     {formatPrice(product?.price)}
//                   </span>
//                   {product?.discount &&
//                     product?.discount !== product?.price && (
//                       <span className="ml-2 line-through text-gray-500 text-sm">
//                         {formatPrice(product?.discount)}
//                       </span>
//                     )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useCategories } from "@/context/CategoriesContext";
import { useProducts } from "@/context/ProductsContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import emptyBox from "../../../public/img/empty-box.png";
import Link from "next/link";


export default function CategoryPageClient({ id }: { id: string }) {
  const { categories, isLoading }: any = useCategories();
  const { products }: any = useProducts();
  const router = useRouter();
  const emptyImage = 'https://syria.adra.cloud/wp-content/plugins/elementor/assets/images/placeholder.png'
  const sub = categories?.data?.find(
    (item: any) => String(item?.slug_name) === String(id)
  );

  const subcategories = sub?.subcategories || [];

  const filteredProducts =
    products?.data?.filter((p: any) => {
      const cat = p.category;

      if (typeof cat === "number") return cat === Number(sub?.id);
      if (typeof cat === "string") return cat === sub?.slug_name;
      if (typeof cat === "object") return Number(cat?.id) === Number(sub?.id);

      return false;
    }) || [];
  console.log(subcategories, "filteredProducts")

  if (isLoading || !sub) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          {/* Spinner */}
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

          {/* Text */}
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black hover:text-black mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Category Name */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-10 capitalize">
          {sub?.name} {subcategories.length > 0 ? '' : 'Products'}
        </h1>

        {/* ⭐ SHOW SUBCATEGORIES ONLY IF THEY EXIST */}
        {subcategories.length > 0 && (
          <div className="mb-14">
            {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Subcategories
            </h2> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subcategories.map((sub: any) => (
                // <div
                //   key={sub.id}
                //   className="bg-black/20 shadow-sm rounded-lg overflow-hidden font-semibold cursor-pointer hover:shadow-md transition"
                //   onClick={() =>
                //     router.push(`/categories/${category.slug_name}/${sub.slug_name}`)
                //   }
                // >
                //   <img
                //     src={sub?.image_url ? sub?.image_url : emptyImage}
                //     alt={sub?.name}
                //     className="w-full h-36 object-cover"
                //   />

                //   <div className="p-3 text-center">
                //     <span className="font-medium text-gray-800 capitalize">
                //       {sub?.name}
                //     </span>
                //   </div>
                // </div>
                <Link
                  href={`/categories/${sub.slug_name}/${sub.slug_name}`}
                  key={sub.id}
                  className="group relative overflow-hidden rounded-xl bg-[#F8F7F2] transition-all duration-300 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={sub?.image_url ? sub?.image_url : emptyImage}
                      alt={sub?.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* STRONG GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

                  {/* TEXT */}
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-2xl font-bold text-white capitalize drop-shadow-lg">
                      {sub?.name}
                    </h3>
                    {sub?.description && (
                      <p className="mt-1 text-sm text-white/90 line-clamp-2 drop-shadow">
                        {sub?.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ⭐ SHOW PRODUCTS ONLY IF NO SUBCATEGORIES */}
        {filteredProducts.length > 0 && (
          <div>
            {/* <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
               {category?.name} Products Lists
            </h2> */}

            <h1 className="text-3xl font-bold text-gray-900 text-center mb-10 capitalize">
              {sub?.name} Products Lists
            </h1>

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
                      src={p.image_urls?.[0] ? p.image_urls[0] : emptyImage}
                      alt={p.name}
                      className="w-full h-44 object-cover"
                    />

                    <div className="p-4">
                      <h3 className="font-bold text-blue-500 truncate uppercase">
                        {p.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-blue-500 font-bold">
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
        )}
      </div>
    </div>

  );
}
