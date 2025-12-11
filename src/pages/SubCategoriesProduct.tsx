import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus } from "lucide-react";
import { useCategories } from "../context/CategoriesContext";
import { useProducts } from "../context/ProductsContext";
import {
    postCartitemApi,
    deleteCartitemsApi,
    updateCartitemsApi,
    getCartitemsApi,
} from "../api-endpoints/CartsApi";
import { InvalidateQueryFilters, useQuery, useQueryClient } from "@tanstack/react-query";
import { useVendor } from "../context/VendorContext";
import LoginModal from "../components/dialogs/LoginModal";

export default function SubCategoriesProducts() {
    const { slug, subcategory } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const getUserId = localStorage.getItem('userId');
    const getCartId = localStorage.getItem('cartId');
    const getUserName = localStorage.getItem('userName');
    const [signInmodal, setSignInModal] = useState(false);
    const { categories, isLoading } = useCategories();
    const { products }: any = useProducts();
    const { vendorId } = useVendor();

    const getCartitemsData = useQuery({
        queryKey: ['getCartitemsData', getCartId],
        queryFn: () => getCartitemsApi(`/${getCartId}`),
        enabled: !!getCartId
    })


    // 👉 Find Category
    const category = categories?.data?.find(
        (c: any) => String(slug) === String(c.slug_name)
    );

    // 👉 Find SubCategory
    const subCat = category?.subcategories?.find(
        (s: any) => String(subcategory) === String(s.slug_name)
    );

    // 👉 Filter Products
    const filteredProducts =
        products?.data?.filter((p: any) => {
            return (
                Number(p.category?.id || p.category) === Number(category?.id) &&
                Number(p.subcategory?.id || p.subcategory) === Number(subCat?.id)
            );
        }) || [];

    const matchingProductsArray = filteredProducts?.map((product: any, index: number) => {
        const matchingCartItem = getCartitemsData?.data?.data?.find(
            (item: any) => item.product === product.id
        );

        if (matchingCartItem) {
            return {
                ...product,
                Aid: index,
                cartId: matchingCartItem.id,
                cartQty: matchingCartItem.quantity,
            };
        }
        return product;
    });

    // 🌟 Loader
    if (isLoading || !category || !subCat) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    const handleAddCart = async (id: any, qty: any) => {
        const payload = {
            cart: getCartId,
            product: id,
            user: getUserId,
            vendor: vendorId,
            quantity: qty,
            created_by: getUserName ? getUserName : 'user'
        }
        try {
            const response = await postCartitemApi(``, payload)
            if (response) {
                queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
            }
        } catch (error) {

        }
    }


    const handleUpdateCart = async (id: any, type: any, qty: any) => {
        try {
            if (qty === 1) {
                const updateApi = await deleteCartitemsApi(`${id}`)
                if (updateApi) {
                    queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
                }
            } else {
                const response = await updateCartitemsApi(`${id}/${type}/`)
                if (response) {
                    queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
                }
            }

        } catch (error) {

        }
    }
    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
                >
                    <ArrowLeft size={20} /> <span>Back</span>
                </button>

                {/* Title */}
                <h1 className="text-3xl font-bold text-center mb-10 capitalize">
                    {subCat?.name}
                </h1>

                {/* Product Grid */}
                {matchingProductsArray?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full py-20">
                        <div className="bg-gray-100 p-6 rounded-2xl shadow-md flex flex-col items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-12 h-12 text-gray-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 13h6m2 0a8 8 0 11-16 0 8 8 0 0116 0zm-8-4h.01m-.01 8h.01"
                                />
                            </svg>

                            <p className="text-gray-500 mt-3 text-center text-sm sm:text-base font-medium">
                                No products found in this Subcategory
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {matchingProductsArray?.map((product: any) => (
                            <div
                                onClick={() => navigate(`/product/${product.slug_name}`)}
                                className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <div className="aspect-square overflow-hidden relative group">
                                    <img
                                        src={product?.image_urls[0] ? product?.image_urls[0] : "https://semantic-ui.com/images/wireframe/image.png"}
                                        className="w-full h-full object-cover absolute top-0 left-0 transition-transform duration-500 ease-in-out group-hover:-translate-x-full"
                                        alt="Product Image"
                                    />
                                    {product?.image_urls[1] && (
                                        <img
                                            src={product?.image_urls[1]}
                                            className="w-full h-full object-cover absolute top-0 left-full transition-transform duration-500 ease-in-out group-hover:translate-x-[-100%]"
                                            alt="Hover Image"
                                        />
                                    )}
                                    {/* {discountPercentage !== 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium z-10">
                                            {Math.abs(discountPercentage)}%
                                        </div>
                                    )} */}
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <h2 className="text-sm capitalize sm:text-base font-semibold text-gray-800 line-clamp-1">
                                        {product?.name}
                                    </h2>
                                    <h2 className="text-sm sm:text-base font-semibold text-gray-600 line-clamp-1">
                                        {/* {product?.weight} g */}
                                        {/* {product?.brand_name} */}
                                    </h2>
                                    {/* <p className="text-sm text-gray-600 mt-1">
                                    {product?.description?.slice(0, 80)}..
                                </p> */}
                                    <div dangerouslySetInnerHTML={{ __html: product?.description?.slice(0, 50) }} className=" text-gray-600 py-2" />


                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm sm:text-lg font-bold text-gray-900">
                                                ₹{product?.price}
                                            </span>
                                            {product?.discount && (
                                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                                    ₹{product?.discount}
                                                </span>
                                            )}
                                        </div>

                                        {product?.cartId ? (
                                            <div
                                                className="flex items-center gap-2 mt-2"
                                                onClick={(e) => e.stopPropagation()} // 🛑 Prevents navigation
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)
                                                    }
                                                    className="p-1 rounded-full hover:bg-gray-200"
                                                // disabled={product?.cartQty <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>

                                                <span>{product?.cartQty}</span>

                                                <button
                                                    onClick={() => handleUpdateCart(product?.cartId, 'increase', '')}
                                                    className="p-1 rounded-full hover:bg-gray-200"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                // disabled={selectedVariant?.stock === 0 || selectedVariant?.status === false}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (getUserId) {
                                                        handleAddCart(product.id, 1);
                                                    } else {
                                                        setSignInModal(true);
                                                    }
                                                }}
                                                className="bg-blue-600 text-white p-2 rounded-lg flex items-center gap-1 hover:bg-blue-700 transition-colors text-xs sm:text-sm disabled:opacity-50"
                                            >
                                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                                {/* <span className="hidden sm:inline">
                                                    {selectedVariant?.stock === 0 || selectedVariant?.status === false ? 'Out of Stock' : 'Add'}
                                                </span> */}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />

        </div>
    );
}
