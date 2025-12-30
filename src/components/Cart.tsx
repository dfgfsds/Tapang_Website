import { useEffect, useState } from 'react';
import { X, Minus, Plus, Loader2 } from 'lucide-react';
import { CartItem } from '../types';
import { AppliedCoupon } from '../types/coupon';
import { useCheckout } from '../hooks/useCheckout';
import { AddressSelector } from './cart/AddressSelector';
import { CouponForm } from './cart/CouponForm';
import { DeliverySelector } from './cart/DeliverySelector';
// import { getAvailableDeliveryOptions } from '../utils/delivery';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCartitemsApi, getAddressApi, getAppliedCouponDataApi, getCartApi, getCartitemsApi, getCartItemsProductSizesWithVariantsApi, getCartItemsSizesWithVariantsApi, postPaymentApi, updateCartitemsApi } from '../api-endpoints/CartsApi';
import { useProducts } from '../context/ProductsContext';
import { useUser } from '../context/UserContext';
import { getSizesApi, getVariantsProductApi } from '../api-endpoints/products';
import { AddressForm } from './profile/AddressForm';
import { toast } from 'react-toastify';
import { getDeliveryChargeApi, getPaymentDeliveryPartnerApi, getVendorDeliveryDetailsApi } from '../api-endpoints/authendication';
import { baseUrl } from '../api-endpoints/ApiUrls';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/date';


interface CartProps {
  items: CartItem[];
  onClose: () => void;
  vendorId: any

}

export function Cart({ items, onClose, vendorId

}: CartProps) {
  const { isProcessing } = useCheckout();
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon>();
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<any>('free');
  const { user }: any = useUser();
  const [loading, setLoading] = useState(false)

  const userId = localStorage.getItem('userId')
  const [openModal, setOpenMoadl] = useState(false)
  const discount = appliedCoupon?.discountAmount || 0;
  const getCartId = localStorage.getItem('cartId')
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<any>()
  const [addressError, setAddressError] = useState<any>('');
  const [cartItems, setCartItem] = useState<any>()
  const [paymentValue, setPaymentValue] = useState('')
  const [DeliveryChargeValue, setDeliveryChargeValue] = useState<any>();
  const navigate = useNavigate();

  const [triggerKey, setTriggerKey] = useState(0);
  const handleRefreshTrigger = () => {
    setTriggerKey((prev) => prev + 1);
  };

  const paymentMethod = [
    { value: "", label: "Pay Online" },
    { value: "cod", label: "Cash on Delivery" }
  ]

  const handlePaymentMethod = (value: string) => {
    setPaymentValue(value)
  }

  const { data }: any = useQuery({
    queryKey: ['getAddressData'],
    queryFn: () => getAddressApi(`user/${userId}`)
  })

  // getPaymentDeliveryPartnerApi
  const getPaymentDeliveryPartnerData: any = useQuery({
    queryKey: ['getAppliedCouponDataData', vendorId],
    queryFn: () => getPaymentDeliveryPartnerApi(`${vendorId}`),
    enabled: !!vendorId
  });


  // getCartItemsProductSizesWithVariantsApi
  const getCartItemsProductSizesWithVariantsData: any = useQuery({
    queryKey: ['getCartItemsProductSizesWithVariantsData', userId, vendorId],
    queryFn: () => getCartItemsProductSizesWithVariantsApi(`?user_id=${userId}&vendor_id=${vendorId}`),
    enabled: !!vendorId && !!userId
  });

  const getAppliedCouponData: any = useQuery({
    queryKey: ['getAppliedCouponDataData', userId],
    queryFn: () => getAppliedCouponDataApi(`?user_id=${userId}`),
    enabled: !!userId
  })


  const fetchCartAndDeliveryCharge = async () => {
    try {
      // 1. Fetch cart data
      const cartResponse: any = await getCartApi(getCartId);
      if (cartResponse) {
        setCartItem(cartResponse);
      }

      // 2. Fetch delivery charge
      if (
        user?.data?.contact_number &&
        userId &&
        vendorId &&
        getPaymentDeliveryPartnerData?.data?.data[0]?.delivery_partner !== "own_delivery"
      ) {
        const deliveryResponse: any = await getDeliveryChargeApi('', {
          user_id: userId,
          vendor_id: vendorId,
          payment_mode: paymentValue,
          customer_phone: user?.data?.contact_number,
        });
        if (deliveryResponse) {
          setDeliveryChargeValue(deliveryResponse?.data);
          setAddressError(null)
        }
      }
    } catch (error: any) {
      setAddressError(error?.response?.data?.error || "Something went wrong ,Please try again later");
    }
  };

  useEffect(() => {

    if (getCartId) {
      fetchCartAndDeliveryCharge();
    }
  }, [getCartId, userId, vendorId, user?.data?.contact_number, paymentValue, triggerKey]);

  const getCartitemsData = useQuery({
    queryKey: ['getCartitemsData', getCartId],
    queryFn: () => getCartitemsApi(`/${getCartId}`),
    enabled: !!getCartId
  })

  // console.log(matchingProductsArray)
  const handleUpdateCart = async (id: any, type: any, qty: any) => {
    try {
      if (qty === 1) {
        const updateApi = await deleteCartitemsApi(`${id}`)
        if (updateApi) {
          queryClient.invalidateQueries(['getCartItemsProductSizesWithVariantsData'] as InvalidateQueryFilters);
        }
      } else {
        const response = await updateCartitemsApi(`${id}/${type}/`)
        if (response) {
          queryClient.invalidateQueries(['getCartItemsProductSizesWithVariantsData'] as InvalidateQueryFilters);
        }
      }

    } catch (error) {

    }
  }



  const RAZOR_PAY_KEY = 'rzp_live_Rn5Eb2XmecwaQN';

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const userId = user?.data?.id;
      if (!userId) throw new Error("User ID not found");
      if (!selectedAddressId) throw new Error("No address selected");

      const payload = {
        user_id: parseInt(userId),
        vendor_id: vendorId,
        customer_phone: user?.data?.contact_number,
      };

      if (paymentValue === "cod") {
        const response = await axios.post(`${baseUrl}/cod-pay-now/`, payload);
        // console.log("COD Order placed:", response.data);
        // refetchCart();
        // setShowSuccessModal(true);

        setTimeout(() => {
          onClose();
          //             window.location.reload();
          navigate("profile");
        }, 5000);
      } else {
        const response = await axios.post(`${baseUrl}/prepaid-pay-now/`, payload);
        const { payment_order_id, final_price } = response.data;

        const options = {
          key: RAZOR_PAY_KEY,
          amount: final_price * 100,
          currency: "INR",
          name: "Tapang Thalaivare",
          description: "Order Payment",
          order_id: payment_order_id,
          handler: function (response: any) {
            // console.log("Payment Success:", response);
            // refetchCart();
            // setShowSuccessModal(true);
            onClose();
            // setTimeout(() => {
            //   onClose();
            //   setLoading(false);
            //   // setShowSuccessModal(false);
            //   navigate("/profile");
            // }, 5000);
            setTimeout(() => {
              setLoading(false);
              onClose();
              navigate("/profile");
              window.location.reload();
            }, 2000);
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.contact_number,
          },
          notes: {
            address: "Selected Address",
          },
          theme: {
            color: "#2563eb",
          },
        };

        const razor = new (window as any).Razorpay(options);
        razor.open();
      }
    } catch (error: any) {
      // console.error("Error placing order:ghfhgf", error);
      toast.error(error?.response?.data?.error || "something")
      // onClose();
      setLoading(false);
      // setShowFailureModal(true);
      // setTimeout(() => {
      //   onClose();
      //   navigate("/profile");
      // }, 5000);
    }
  };
  const totalAmount = getCartItemsProductSizesWithVariantsData?.data?.data?.cart_items?.filter((item: any) => item?.product_details?.status === true && item?.product_details?.quantity > 0)?.reduce((acc: number, item: any) => {
    const price =
      item?.product_details?.price ?? 0;
    return acc + price * (item?.quantity || 1);
  }, 0);

  useEffect(() => {
    if (data?.data?.length) {
      const selected = data?.data?.find((address: any) => address?.selected_address === true);
      if (selected) {
        setSelectedAddressId(String(selected?.id));
      }
    }
  }, [data]);

  const cartItemss = getCartItemsProductSizesWithVariantsData?.data?.data?.cart_items;

  useEffect(() => {
    if (cartItemss?.length === 0) {
      window?.location?.reload();
    }
  }, [cartItemss]);

  if (!cartItemss || cartItemss?.length === 0) {
    return (
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl p-6 z-30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-500 text-center">Your cart is empty</p>
      </div>
    );
  }




  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col z-30">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>
      {getCartItemsProductSizesWithVariantsData?.data?.data?.cart_items?.length ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="space-y-4">

              {[...getCartItemsProductSizesWithVariantsData?.data?.data?.cart_items]
                ?.map((item: any) => ({
                  ...item,
                  sortName: (item?.product_details?.name || "").toLowerCase(),
                }))
                ?.sort((a, b) => a.sortName.localeCompare(b.sortName))
                ?.map((item: any) => {
                  // ✅ AVAILABILITY LOGIC
                  const isAvailable =
                    item?.product_details?.status === true &&
                    Number(item?.quantity) > 0;

                  return (
                    <div
                      key={item?.Aid}
                      className={`flex justify-between p-4 rounded-lg relative transition
          ${isAvailable
                          ? "bg-gray-50"
                          : "bg-gray-200 opacity-60 pointer-events-none"
                        }
        `}
                    >
                      <div className="flex items-center gap-4 w-full">

                        {/* IMAGE + NOT AVAILABLE OVERLAY */}
                        <div className="relative">
                          <img
                            src={
                              item?.product_details?.image_urls?.[0] ??
                              "https://semantic-ui.com/images/wireframe/image.png"
                            }
                            className="w-20 h-20 object-cover rounded"
                            alt="product"
                          />

                          {!isAvailable && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                              <span className="text-white text-xs font-semibold">
                                Not Available
                              </span>
                            </div>
                          )}
                        </div>

                        {/* PRODUCT INFO */}
                        <div className="flex-1">
                          <h3 className="font-semibold capitalize">
                            {item?.product_details?.name || ""}
                          </h3>

                          <p className="text-gray-600 py-1 font-bold">
                            ₹{item?.product_details?.price || ""}
                          </p>

                          {/* STATUS TEXT */}
                          <p
                            className={`text-xs font-medium
                ${isAvailable ? "text-green-600" : "text-red-500"}
              `}
                          >
                            {isAvailable ? "" : "Not Available"}
                          </p>

                          {/* QTY CONTROLS */}
                          <div className="mt-2">
                            <div className="flex items-center justify-between w-[110px] px-3 py-1.5 border border-gray-300 rounded-xl shadow-sm bg-white">

                              <button
                                disabled={!isAvailable}
                                onClick={() =>
                                  handleUpdateCart(item?.id, "decrease", item?.quantity)
                                }
                                className={`p-1 rounded-lg transition
                    ${isAvailable
                                    ? "hover:bg-gray-100"
                                    : "opacity-40 cursor-not-allowed"
                                  }
                  `}
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="text-base font-semibold w-6 text-center">
                                {item?.quantity}
                              </span>

                              <button
                                disabled={!isAvailable}
                                onClick={() =>
                                  handleUpdateCart(item?.id, "increase", "")
                                }
                                className={`p-1 rounded-lg transition
                    ${isAvailable
                                    ? "hover:bg-gray-100"
                                    : "opacity-40 cursor-not-allowed"
                                  }
                  `}
                              >
                                <Plus className="h-4 w-4" />
                              </button>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}


            </div>

            <div className="border-t pt-6">
              <AddressSelector
                selectedAddressId={selectedAddressId}
                onSelect={setSelectedAddressId}
                data={data}
                onClose={onClose}
              />
            </div>

            {/* <div className="border-t pt-6">
              <DeliverySelector
                options={options}
                selectedOptionId={selectedDeliveryId}
                onSelect={setSelectedDeliveryId}
              />
            </div> */}

            <div className="border-t pt-6">
              <CouponForm
                items={items}
                onApply={setAppliedCoupon}
                appliedCoupon={appliedCoupon}
                onChange={handleRefreshTrigger}
              />
            </div>

            <div>
              <label className='text-xl font-semibold mb-6'>Payment Method</label>
              {paymentMethod?.map((item: any, i: any) => (
                <label
                  key={i}
                  className={`flex items-start mt-2 mb-2 p-3 rounded-lg border cursor-pointer
          ${paymentValue === item?.value ? 'border-[#13cea1] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={item?.value}
                    checked={paymentValue === String(item?.value)}
                    onChange={() => { handlePaymentMethod(item?.value) }}
                    className="mt-1 h-4 w-4 text-[#13cea1] border-gray-300 focus:ring-blue-700"
                  />
                  <div className="ml-3">
                    <p className="text-sm  text-black font-bold">
                      {item?.label}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl p-6 z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-500 text-center">Your cart is empty</p>
        </div>
      )}


      <div className="space-y-4 font-bold !text-gray-600 p-6 border-t bg-gray-50">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{(Number(totalAmount || 0))}</span>
        </div>

        {/* Delivery Charge - OWN DELIVERY */}
        {getPaymentDeliveryPartnerData?.data?.data[0]?.delivery_partner === "own_delivery" ? (
          <>
            <div className="flex justify-between text-gray-600">
              <span className="text-muted-foreground">Delivery Charge</span>
              <span>
                {paymentValue === "cod"
                  ? (
                    Number(getPaymentDeliveryPartnerData?.data?.data[0]?.own_delivery_charge || 0) +
                    Number(getPaymentDeliveryPartnerData?.data?.data[0]?.own_cod_delivery_charge || 0)
                  )
                  : (
                    Number(getPaymentDeliveryPartnerData?.data?.data[0]?.own_delivery_charge || 0)
                  )}
              </span>
            </div>

            {getAppliedCouponData?.data?.data?.total_discount ? (
              <div className="flex justify-between text-gray-600">
                <span className="text-muted-foreground">Discount</span>
                <span>
                  {Number(getAppliedCouponData?.data?.data?.total_discount || 0)}
                </span>
              </div>
            ) : ''}

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Total</span>
              <span>
                {paymentValue === "cod"
                  ? (
                    Number(totalAmount || 0) +
                    Number(getPaymentDeliveryPartnerData?.data?.data[0]?.own_delivery_charge || 0) +
                    Number(getPaymentDeliveryPartnerData?.data?.data[0]?.own_cod_delivery_charge || 0) -
                    Number(getAppliedCouponData?.data?.data?.total_discount || 0)
                  )
                  : (
                    Number(totalAmount || 0) +
                    Number(getPaymentDeliveryPartnerData?.data?.data[0]?.own_delivery_charge || 0) -
                    Number(getAppliedCouponData?.data?.data?.total_discount || 0)
                  )}
              </span>
              {/* <span>
                {(() => {
                  const baseAmount = Number(totalAmount || 0);
                  const discount = Number(getAppliedCouponData?.data?.data?.total_discount || 0);
                  const deliveryCharge =
                    paymentValue === "cod"
                      ? Number(getPaymentDeliveryPartnerData?.data?.data?.[0]?.own_cod_delivery_charge || 0)
                      : Number(getPaymentDeliveryPartnerData?.data?.data?.[0]?.own_delivery_charge || 0);

                  const finalTotal = (baseAmount + deliveryCharge - discount) - getAppliedCouponData?.data?.data?.applied_coupons[0]?.discount;

                  return formatPrice(finalTotal > 0 ? finalTotal : 0);
                })()}
              </span> */}
            </div>
          </>
        ) : (
          <>
            {/* Delivery Charge VIA PARTNER */}
            {addressError ? (
              <span className="mt-4 p-2 text-red-600">{addressError}</span>
            ) : (
              <>
                <div className="flex justify-between text-gray-600">
                  <span className="text-muted-foreground">
                    Delivery Charge (incl. transaction charges)
                  </span>
                  <span>
                    {(Number(DeliveryChargeValue?.final_delivery_charge || 0))}
                  </span>
                </div>

                {getAppliedCouponData?.data?.data?.total_discount ? (
                  <div className="flex justify-between text-gray-600">
                    <span className="text-muted-foreground">Discount</span>
                    <span>
                      {Number(getAppliedCouponData?.data?.data?.total_discount || 0)}
                    </span>
                  </div>
                ) : ''}

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>
                    {(
                      Number(DeliveryChargeValue?.final_price_including_delivery || 0)
                    )}
                  </span>
                </div>
              </>
            )}
          </>
        )}
        {data?.data?.length ? (
          <>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <button
              onClick={handleCheckout}
              disabled={isProcessing || !selectedAddressId}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </>
        ) : (
          <button
            onClick={() => setOpenMoadl(!openModal)}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Add Address
          </button>
        )}

      </div>

      <AddressForm
        openModal={openModal}
        handleClose={() => setOpenMoadl(!openModal)}
        editData={''}
      />
    </div>
  );
}