// export const baseUrl = 'https://test-ecomapi.justvy.in';
export const baseUrl = 'https://ecomapi.ftdigitalsolutions.org';
// const baseUrl ='http://82.29.161.36'

const cartCreate = `${baseUrl}/api/carts/`;
const createUsers = `${baseUrl}/create_users/`;
const addresses = `${baseUrl}/addresses/`;
const cartItem = `${baseUrl}/api/cart_items/`;
const cartItems = `${baseUrl}/api/cart_items/carts`;
const cartItemsUpdate = `${baseUrl}/cart-item/update/`;

//const product = `${baseUrl}/api/products/`;
const product = `${baseUrl}/fetch-all-product-with-variant-size/`;

// const categories = `${baseUrl}/api/categories/`;
const categories=`${baseUrl}/categories-with-subcategories/`;
const signIn = `${baseUrl}/user_login/`;
const userCreate = `${baseUrl}/create_users/`;
const orderItem = `${baseUrl}/order-and-order-items/`;
const users = `${baseUrl}/users`;
const orderGet = `${baseUrl}/orders/user/`;
const applyCoupons = `${baseUrl}/apply_coupons/`;
const variants = `${baseUrl}/variants`;
const sizes = `${baseUrl}/sizes`;
const productVariantCart = `${baseUrl}/product-variant-cart-item/update/`;
const paymentApi = `${baseUrl}/prepaid-pay-now`;
const updateSelectedAddress = `${baseUrl}/update-selected-address`;
const fetchProductWithVariantSize = `${baseUrl}/fetch-product-with-variant-size/`;
const AllProductWithVariantSize = `${baseUrl}/fetch-all-product-with-variant-size/`;
const checkEmail = `${baseUrl}/user/get-by-email-or-contact-and-vendor/`;
const sendOtp = `${baseUrl}/send-email-opt/`;
const verifyOtp = `${baseUrl}/verify-email-opt-return-user/`;
const vendorOtherDetails = `${baseUrl}/vendor-other-details/`;
const vendorSitePolicies = `${baseUrl}/vendor-site-policies/`;
const vendorDetailsDelivery = `${baseUrl}/vendor-with-site-details/`
const sendSmsOtpUser = `${baseUrl}/send-sms-opt-user/`;
const otpVerify = `${baseUrl}/verify-sms-opt-return-user/`;
const userLogin =`${baseUrl}/user_login/`;
const paymentDeliveryPartner=`${baseUrl}/vendor-site-payment-delivery-partner-details/`;
const checkCourierCharge = `${baseUrl}/Check-Courier-Serviceability-delivery-charge/`;
const appliedCouponData = `${baseUrl}/get-applied-coupon-data/`;
const removeCoupon = `${baseUrl}/cart/`;
const coupons = `${baseUrl}/coupons/`;
const cartItemSizeVariants=`${baseUrl}/cart_with_cart_items_product_or_variant/`;
const cartItemProductSizeVariants=`${baseUrl}/cart_with_cart_items_product_or_variant_refined/`;

export default {
  cartCreate,
  createUsers,
  addresses,
  cartItem,
  cartItems,
  product,
  categories,
  signIn,
  userCreate,
  cartItemsUpdate,
  orderItem,
  users,
  orderGet,
  applyCoupons,
  variants,
  sizes,
  productVariantCart,
  paymentApi,
  updateSelectedAddress,
  fetchProductWithVariantSize,
  AllProductWithVariantSize,
  checkEmail,
  sendOtp,
  verifyOtp,
  vendorOtherDetails,
  vendorSitePolicies,
  vendorDetailsDelivery,
  sendSmsOtpUser,
  otpVerify,
  userLogin,
  paymentDeliveryPartner,
  checkCourierCharge,
  appliedCouponData,
  removeCoupon,
  coupons,
  cartItemSizeVariants,
  cartItemProductSizeVariants,
};
