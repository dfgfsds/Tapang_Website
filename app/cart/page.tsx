"use client";

import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import { useQuery } from '@tanstack/react-query';
import { getSizesApi, getVariantsProductApi } from '@/api-endpoints/products';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCartItemsProductSizesWithVariantsApi } from '@/api-endpoints/CartsApi';
import { useVendor } from '@/context/VendorContext';


export default function CartPage() {
  // For demo purposes, we'll use the first 3 products as cart items
  const { cartItem }: any = useCartItem();
  const { products }: any = useProducts();
  const router = useRouter();
  const [triggerKey, setTriggerKey] = useState(0); // 🔑 Key to trigger refresh
  const [userId, setUserId] = useState<string | null>(null);
  const { vendorId } = useVendor();

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    setUserId(storedId);
  }, []);

  const handleRefreshTrigger = () => {
    setTriggerKey((prev) => prev + 1); // 🔄 Every update/remove increases key
  };

  const VariantData: any = useQuery({
    queryKey: ['VariantData'],
    queryFn: () => getVariantsProductApi(``),
  });

  const sizesData: any = useQuery({
    queryKey: ['getSizesData'],
    queryFn: () => getSizesApi(``),
  });

  const getCartItemsProductSizesWithVariantsData: any = useQuery({
    queryKey: ['getCartItemsProductSizesWithVariantsData', userId, vendorId],
    queryFn: () => getCartItemsProductSizesWithVariantsApi(`?user_id=${userId}&vendor_id=${vendorId}`),
    enabled: !!vendorId && !!userId
  });


  const matchingProductsArray = cartItem?.data?.map((item: any, index: number) => {
    const matchingProduct = products?.data?.find((product: any) => product.id === item.product);
    const matchingVariant = VariantData?.data?.data?.message?.find((variant: any) => variant.id === item.product_variant);
    const matchingSize = sizesData?.data?.data?.message?.find((size: any) => size.id === item.product_size);

    return {
      Aid: index,
      cartId: item?.id,
      cartQty: item?.quantity,
      ...matchingProduct,
      ...matchingVariant,
      ...matchingSize,
    };
  });

  const totalAmount = matchingProductsArray?.reduce((acc: number, item: any) => {
    const price =
      item.price ??
      item?.product_variant_price ??
      item?.product_size_price ??
      0;
    return acc + price * (item.cartQty || 1);
  }, 0);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        {matchingProductsArray?.length === 0 ? (
          // <div className="flex flex-col items-center justify-center h-64">
          //   <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
          //   <p className="text-gray-600">Your cart is empty</p>
          //   <Link href="/products" className="mt-4 text-[#D9951A] hover:underline flex">
          //     Start Shopping 
          //     <ArrowRight className="ml-2 h-4 w-4 my-auto" />

          //   </Link>
          // </div>

          <div className="flex flex-col items-center justify-center h-max  text-gray-800 animate-fadeIn">
            <div className="text-6xl text-gray-400 animate-float">
              <ShoppingBag className="h-16 w-16 text-[#B69339] mb-4" />
            </div>
            <h1 className="text-3xl font-bold mt-0 animate-slideInUp">
              Your cart is empty.
            </h1>
            <p className="mt-2 text-gray-600 animate-fadeIn delay-200">
              {/* Looks like you haven't added anything to your cart yet. */}
              Start Shopping
            </p>

            <button
              className="mt-8 px-6 py-3 bg-[#B69339] text-white rounded-full shadow-md hover:bg-[#A37F30] transform transition hover:scale-105 animate-bounce"
              onClick={() => router.push('/products')}
            >
              Return To Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#F8F7F2] rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Cart Items {cartItem?.length}</h2>
                    <Link href="/products" className="text-[#B69339] hover:underline text-sm flex items-center">
                      Continue Shopping
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>

                  <div className="space-y-6">
                    {[...getCartItemsProductSizesWithVariantsData?.data?.data?.cart_items || []]
                      ?.map((item: any) => ({
                        ...item,
                        sortName: (item?.name || "").toLowerCase(),
                      }))
                      ?.sort((a: any, b: any) => a?.sortName?.localeCompare(b?.sortName))
                      ?.map((product: any, index: any) => (
                        <CartItem key={product.id} product={product} quantity={index + 1}
                          onChange={handleRefreshTrigger}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CartSummary totalAmount={totalAmount} triggerKey={triggerKey} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}