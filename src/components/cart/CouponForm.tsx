import React, { useState } from 'react';
import { Tag, Loader2 } from 'lucide-react';
import { validateCoupon, calculateDiscount } from '../../utils/coupon';
import { coupons } from '../../data/coupons';
import { CartItem } from '../../types';
import { AppliedCoupon } from '../../types/coupon';
import { deleteCouponApi, getAllCouponsApi, getAppliedCouponDataApi, postApplyCouponApi } from '../../api-endpoints/CartsApi';
import { toast } from 'react-toastify';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { useVendor } from '../../context/VendorContext';

interface CouponFormProps {
  items: CartItem[];
  onApply: (coupon: AppliedCoupon) => void;
  appliedCoupon?: AppliedCoupon;
}

export function CouponForm({ items, onApply, appliedCoupon,onChange }: any) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const getCartId = localStorage.getItem('cartId');
  const getUserName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId')


  const [couponLoader, setCouponloader] = useState(false);
  const queryClient = useQueryClient();
  const { vendorId } = useVendor()


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setIsChecking(true);

  //   // try {
  //   //   await new Promise(resolve => setTimeout(resolve, 500));

  //   //   const coupon = validateCoupon(code, coupons);
  //   //   if (!coupon) {
  //   //     setError('Invalid coupon code');
  //   //     return;
  //   //   }

  //   //   const appliedDiscount = calculateDiscount(coupon, items);
  //   //   if (!appliedDiscount) {
  //   //     setError(`Minimum purchase of $${coupon.minAmount} required`);
  //   //     return;
  //   //   }

  //   //   onApply(appliedDiscount);
  //   //   setCode('');
  //   // } finally {
  //   //   setIsChecking(false);
  //   // }
  //   const payload = {
  //     user_id: Number(userId),
  //     coupon_id: code,
  //     vendor_id: 27,
  //     updated_by: getUserName ? getUserName : 'user'

  //   }
  //   // try {
  //   //   const updateApi=await postApplyCouponApi('',payload)
  //   //   console.log(updateApi)
  //   //   if(updateApi?.status === 400){
  //   //     setError('Invalid coupon code');
  //   //     setIsChecking(false);
  //   //     return;
  //   //   }
  //   // } catch (error) {

  //   // }

  //   try {
  //     const updateApi = await postApplyCouponApi("", payload);
  //     console.log(updateApi);

  //     // Check the response status properly
  //     if (updateApi?.status === 400) {
  //       setError("Invalid coupon code");
  //     } else if (updateApi?.status === 200) {
  //       toast.success("Coupon applied successfully!");
  //     } else {
  //       setError("Something went wrong. Please try again.");
  //     }
  //   } catch (error: any) {
  //     setError("Failed to apply coupon. Please try again.");
  //   } finally {
  //     setIsChecking(false);
  //   }

  // };

  const getAppliedCouponData: any = useQuery({
    queryKey: ['getAppliedCouponDataData', userId],
    queryFn: () => getAppliedCouponDataApi(`?user_id=${userId}`),
    enabled: !!userId
  })

  // getAllCouponsData
  const getAllCouponsData: any = useQuery({
    queryKey: ['getAllCouponsData', vendorId],
    queryFn: () => getAllCouponsApi(`?vendor_id=${vendorId}`),
    // enabled: !!vendorId
  })
  const availableCoupons = getAllCouponsData?.data?.data?.data

  const handleRemoveCoupon = async () => {
    setCouponloader(true);
    try {
      const updateAPi = await deleteCouponApi(`${getCartId}/coupon/${getAppliedCouponData?.data?.data?.applied_coupons[0]?.coupon_id}/remove/`, { updated_by: getUserName ? getUserName : 'user' })
      if (updateAPi) {
        // fetchCartAndDeliveryCharge();
        setCouponloader(false);
        queryClient.invalidateQueries(['getAppliedCouponDataData'] as InvalidateQueryFilters);
        setError('');
        setCode('');
      }
    } catch (error) {

    }
  }

  const handleCouponSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setIsChecking(true);

    const payload = {
      user_id: Number(userId),
      coupon_code: code,
      vendor_id: vendorId,
      updated_by: getUserName || 'user'
    };

    try {
      const updateApi = await postApplyCouponApi("", payload);
      if (updateApi) {
        // fetchCartAndDeliveryCharge();
        // getDeliveryCharge();
               onChange();
        queryClient.invalidateQueries(['getAllCouponsData'] as InvalidateQueryFilters);
      }
    } catch (error: any) {
      setError(error?.response?.data?.error || "Failed to apply coupon. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };


  if (appliedCoupon) {
    return (
      <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">
              Coupon applied: {appliedCoupon.code}
            </p>
            <p className="text-xs text-green-600">
              You saved ${appliedCoupon.discountAmount.toFixed(2)}
            </p>
          </div>
        </div>
        <button
          onClick={() => onApply('')}
          className="text-sm text-green-600 hover:text-green-700"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    // <form onSubmit={handleSubmit} className="space-y-2">
    //   <div className="flex gap-2">
    //     <div className="flex-1">
    //       <input
    //         type="text"
    //         value={code}
    //         onChange={(e) => setCode(e.target.value.toUpperCase())}
    //         placeholder="Enter coupon code"
    //         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
    //       />
    //     </div>
    //     <button
    //       type="submit"
    //       disabled={!code || isChecking}
    //       className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
    //     >
    //       {isChecking ? (
    //         <Loader2 className="h-4 w-4 animate-spin" />
    //       ) : (
    //         'Apply'
    //       )}
    //     </button>
    //   </div>
    //   {error && (
    //     <p className="text-sm text-red-600">{error}</p>
    //   )}
    // </form>
    <>

      {getAppliedCouponData?.data?.data?.applied_coupons?.length ? (
        <>
          <div className="bg-green-50 p-4 rounded-lg space-y-2 flex justify-between">
            <div className=''>
              <p className="text-sm text-green-700 font-bold mb-2">
                Applied Coupon: {getAppliedCouponData?.data?.data?.data[0]?.code}
              </p>

              <p className="text-sm text-green-700 font-bold">
                Discount Amount: ₹{getAppliedCouponData?.data?.data?.applied_coupons[0]?.discount || 0}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-[#a5291b] border-red-300 hover:bg-red-50"
            >
              Remove Coupon
            </button>
          </div>
        </>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-1">Coupon</h2>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Discount code"
              className={`bg-white w-full p-2 ${error ? 'border-[#a5291b] shadow-md border-2 rounded-md' : 'border-gray-300'}`}
              value={code}
              onChange={(e: any) => setCode(e.target.value.toUpperCase())}
            />
            <button disabled={!code || isChecking} onClick={handleCouponSubmit} className="whitespace-nowrap bg-green-600 hover:bg-green-900 p-2 rounded-md text-white font-bold ">

              {isChecking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </button>
          </div>
          {error && (
            <p className="text-sm text-[#a5291b]">{error ? error : 'Coupon not found!'}</p>
          )}

          {availableCoupons
            ?.filter((coupon: any) => {
              if (!coupon?.allowed_users?.length) return true;
              return coupon?.allowed_users?.includes(userId);
            })
            ?.map((coupon: any) => (
              <div
                key={coupon.id}
                onClick={() => {
                  setCode(coupon?.code);
                  // handleSelectCoupon(coupon?.code); // ✅ auto apply on click
                }}
                className="cursor-pointer border mb-1 border-gray-200 bg-white rounded-lg p-3 hover:bg-gray-50 transition-all"
              >
                <div className="flex justify-between">
                  <span className="font-bold text-[#b39e49]">{coupon?.code}</span>
                  <span className="text-sm text-gray-600">
                    {coupon?.discount_type === "percentage"
                      ? `${coupon?.discount_value}% OFF`
                      : `₹${coupon?.flat_discount} OFF`}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{coupon?.description}</p>
              </div>
            ))}
        </div>
      )}

    </>
  );
}