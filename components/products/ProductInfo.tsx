"use client"

import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingBag, Heart, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import { getProductVariantCartItemUpdate } from '@/api-endpoints/products';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import { useVendor } from '@/context/VendorContext';
import { deleteCartitemsApi, updateCartitemsApi } from '@/api-endpoints/CartsApi';
import LoginModal from '@/app/auth/LoginModal/page';

export default function ProductInfo({ product, cartDetails, getUserId, getCartId, getUserName, totalQty, cartItem }: any) {
  const queryClient = useQueryClient();
  const { vendorId } = useVendor();
  const [signInmodal, setSignInModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [selectedSize, setSelectedSize] = useState<any | null>(null);

  const hasVariants = product?.variants?.length > 0;
  const hasSizes = selectedVariant?.sizes?.length > 0;

  const disableBuyButton =
    (hasVariants && !selectedVariant) ||
    (hasVariants && hasSizes && !selectedSize);


  const getProductPayloadKey = () => {
    if (selectedSize?.id) return { product_size: selectedSize?.id };
    if (selectedVariant?.id) return { product_variant: selectedVariant?.id };
    return { product: product?.id };
  };

  const getMatchingCartItem = () => {
    if (!cartItem?.length) return null;
    if (selectedSize?.id) {
      return cartItem?.find((item: any) => item?.product_size === selectedSize?.id);
    }
    if (selectedVariant?.id) {
      return cartItem?.find((item: any) => item?.product_variant === selectedVariant?.id);
    }
    if (!hasVariants) {
      return cartItem?.find((item: any) => item?.product === product?.id);
    }

    return null;
  };

  const getDisplayPrice = () => {
    if (selectedSize?.product_size_price) {
      return selectedSize.product_size_price;
    }
    if (selectedVariant?.product_variant_price) {
      return selectedVariant.product_variant_price;
    }
    return product?.price;
  };


  const matchedCartItem = getMatchingCartItem();
  const currentQty = matchedCartItem?.quantity || 0;


  const handleAddCart = async (id: any, qty: any) => {
    const payload = {
      // product: id,
      cart: getCartId,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : 'user',
      ...getProductPayloadKey(),
      // ...(selectedVariant?.product_variant_title ? { product_variant: selectedVariant?.id } : selectedVariant?.product_size ? { product_size: selectedVariant?.id }
      //   : selectedVariant?.id ? { product: selectedVariant?.id } : ''),
    };

    try {
      const response = await getProductVariantCartItemUpdate('', payload)
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {
    }
  }

  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1 && type === 'decrease') {
        const updateApi = await deleteCartitemsApi(`${id}`)
        if (updateApi) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
      } else {
        // if (!selectedVariant) {
        const response = await updateCartitemsApi(`${id}/${type}/`)
        if (response) {
          queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
        }
        // } else {
        //   handleAddCart(id, 1)
        // }
      }
    } catch (error) {

    }
  }


  const isButtonDisabled =
    disableBuyButton ||
    product?.stock_quantity === 0 ||
    product?.status === false ||
    selectedVariant?.product_variant_status === false ||
    selectedVariant?.product_variant_stock_quantity === 0 ||
    selectedSize?.product_size_status === false ||
    selectedSize?.product_size_stock_quantity === 0;

  const getButtonText = () => {
    if (product?.status === false) return "Not Available";
    if (product?.stock_quantity === 0) return "Out of Stock";
    if (selectedVariant && selectedVariant?.product_variant_status === false)
      return "Variant Not Available";
    if (selectedSize && selectedSize?.product_size_status === false)
      return "Size Not Available";
    if (disableBuyButton) return "Select Variant / Size";
    return "Add to Cart";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-[#B69339] uppercase">{product?.name}</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground !text-red-600">
            {product?.brand_name}
          </span>
        </div>
      </div>
      <div className='flex gap-5'>
        {/* <div className="text-2xl font-bold text-[#B69339]">{formatPrice(product?.price)}</div> */}
        <div className="text-2xl font-bold text-red-600">
          {formatPrice(getDisplayPrice())}
        </div>
        {product?.price === product?.discount || product?.discount === 0 || product?.discount === '' ?
          ('') : (
            <>
              <span className="font-semibold text-2xl line-through text-gray-500">{formatPrice(product?.discount)}</span>

            </>
          )}

      </div>


      {/* <p className="text-muted-foreground">{product?.description}</p> */}
      <div dangerouslySetInnerHTML={{ __html: product?.description }} className="quill-content" />

      {product?.variants?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-extrabold mb-3 text-gray-800">
            Variants
          </h2>

          <div className="flex gap-4 flex-wrap">
            {product?.variants?.
              filter((item: any) => item?.product_variant_status === true)
              ?.map((variant: any) => {
                const active = selectedVariant?.id === variant?.id;

                return (
                  <div
                    key={variant?.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setSelectedSize(null);
                    }}
                    className={`
              cursor-pointer
              w-[96px]
              p-2
              rounded-xl
              border
              text-center
              transition-all
              duration-200
              ${active
                        ? "border-red-500 bg-red-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
                      }
            `}
                  >
                    <div className="w-full h-[72px] flex items-center justify-center bg-white rounded-md mb-2">
                      <img
                        src={variant?.product_variant_image_urls?.[0]}
                        alt={variant?.product_variant_title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    <p
                      className={`text-base font-bold capitalize truncate ${active ? "text-red-600" : "text-gray-700"
                        }`}
                    >
                      {variant?.product_variant_title}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {selectedVariant?.sizes?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-extrabold mb-3 text-gray-800">
            Select Size
          </h2>

          <div className="flex gap-3 flex-wrap">
            {selectedVariant?.sizes
              ?.filter((item: any) => item?.product_size_status === true)
              ?.map((size: any) => {
                const active = selectedSize?.id === size?.id;

                return (
                  <button
                    key={size?.id}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`
              px-4 py-2
              rounded-full
              text-lg
              font-semibold
              border
              transition-all
              duration-200
              ${active
                        ? "bg-red-500 text-white border-red-500 shadow"
                        : "bg-white text-gray-800 border-gray-300 hover:border-red-400 hover:text-red-600"
                      }
            `}
                  >
                    {size?.product_size}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {currentQty > 0 ? (
        <div>
          <label className="text-sm font-medium mb-2 block">Quantity</label>

          <div className="flex items-center w-full md:w-[180px] border-2 border-white rounded-lg">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                handleUpdateCart(matchedCartItem?.id, "decrease", currentQty)
              }
            >
              <Minus />
            </Button>

            <div className="flex-1 text-center font-semibold">
              {currentQty}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                handleUpdateCart(matchedCartItem?.id, "increase", currentQty)
              }
            >
              <Plus />
            </Button>
          </div>
        </div>
      ) : (
        <button
          disabled={isButtonDisabled}
          className={`
    relative
    mt-8
    w-full
    flex items-center justify-center gap-2
    px-6 py-3
    rounded-full
    font-semibold
    overflow-hidden
    transition-all
    duration-300
    ${isButtonDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white shadow-md"
            }
  `}
          onClick={(e) => {
            e.stopPropagation();
            if (isButtonDisabled) return;

            if (!getUserId) {
              setSignInModal(true);
              return;
            }

            handleAddCart(
              selectedSize?.id ||
              selectedVariant?.id ||
              product?.id,
              1
            );
          }}
        >

          <span className="relative z-10 flex items-center gap-2">
            {!isButtonDisabled && <ShoppingBag className="h-5 w-5" />}
            {getButtonText()}
          </span>

          {!isButtonDisabled && (
            <span
              className="
        absolute
        inset-0
        w-1/3
        bg-gradient-to-l
        from-white/60
        to-transparent
        opacity-40
        skew-x-[-30deg]
        animate-shine
      "
            />
          )}
        </button>


      )}

      {signInmodal && (
        <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />

      )}
    </div>
  );
}