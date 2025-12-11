import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { LoadingButton } from '../components/LoadingButton';
import { CartItem } from '../types';
import { useLoadingState } from '../hooks/useLoadingState';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProductApi, getProductVariantCartItemUpdate, getProductWithVariantSizeApi } from '../api-endpoints/products';
import { VariantSelector } from '../components/product/VariantSelector';
import LoginModal from '../components/dialogs/LoginModal';
import { deleteCartitemsApi, getCartitemsApi, updateCartitemsApi } from '../api-endpoints/CartsApi';
import { useProducts } from '../context/ProductsContext';
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface ProductDetailsProps {
  cartItems: CartItem[];
  onAddToCart: (cartItem: CartItem) => void;
  vendorId: any;
}

export function ProductDetailsPage({ cartItems, onAddToCart, vendorId }: ProductDetailsProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const { id } = useParams();
  const { slug: slug_name } = useParams();
  // console.log(slug_name);
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>('');
  const getUserId = localStorage.getItem('userId');
  const getCartId = localStorage.getItem('cartId');
  const getUserName = localStorage.getItem('userName');
  const queryClient = useQueryClient();
  const { withLoading } = useLoadingState();
  const [signInmodal, setSignInModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const Allproducts: any = useQuery({
    queryKey: ['getProductData'],
    queryFn: () => getProductApi(`?vendor_id=${vendorId}`)
  });

  // console.log(Allproducts)
  const findproductId = Allproducts?.data?.data?.find((item: any) => item?.slug_name === slug_name)
  const productData: any = useQuery({
    queryKey: ['getProductData', findproductId?.id],
    queryFn: () => getProductWithVariantSizeApi(`${findproductId?.id}`),
  });

  const getCartitemsData = useQuery({
    queryKey: ['getCartitemsData', getCartId],
    queryFn: () => getCartitemsApi(`/${getCartId}`),
    enabled: !!getCartId,
  });

  // console.log(productData)

  const matchingData = getCartitemsData?.data?.data?.flatMap((item: any, index: number) => {
    const product = productData?.data?.data;
    const isProductMatch = product?.id === item?.product;

    const matchedProduct = isProductMatch ? product : null;

    const matchingVariant = product
      ? product?.variants?.find((variant: any) => variant?.id === item?.product_variant)
      : null;

    const matchingSize = product
      ? product?.variants
        ?.flatMap((variant: any) => variant?.sizes || [])
        ?.find((size: any) => size?.id === item?.product_size)
      : null;

    // 👉 If any match fails, return empty array to skip this entry
    if (!matchedProduct && !matchingVariant && !matchingSize) {
      return [];
    }

    return [{
      Aid: index,
      cartId: item?.id,
      cartQty: item?.quantity,
      ...matchedProduct,
      ...matchingVariant,
      ...matchingSize,
    }];
  });

  console.log(matchingData?.map((el: any) => el), "12345");



  const totalQty = matchingData?.reduce((sum: number, item: any) => sum + (item?.cartQty || 0), 0);

  // console.log(matchingData, "Matching Data");
  useEffect(() => {
    if (productData?.data?.data && !selectedVariant) {
      const firstVariant = productData?.data?.data?.variants[0];
      setSelectedVariant(firstVariant);
      setProduct(productData?.data?.data);
    }
  }, [productData?.data?.data, selectedVariant]);

  const cartItem: any = cartItems.find(
    (item) =>
      item.id === product?.id &&
      item.variantId === selectedVariant?.id &&
      item.sizeId === selectedSize?.id
  );

  // Determine if Add to Cart should be disabled
  const isAddToCartDisabled = (() => {
    if (!productData?.data?.data) return true; // product not loaded yet
    if (productData?.data?.data?.variants?.length === 0) {
      // No variants, only check stock
      return !productData?.data?.data?.stock_quantity || productData?.data?.data?.stock_quantity === 0;
    } else if (selectedVariant) {
      // Variant selected, check if size required
      if (selectedVariant?.sizes?.length > 0) {
        return !selectedSize; // disabled if size not selected
      }
      return false; // variant selected, no sizes
    } else {
      // No variant selected yet
      return true;
    }
  })();


  if (productData.isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex items-baseline gap-4">
              <div className="h-8 bg-gray-300 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="pt-6 border-t">
              <div className="h-12 bg-gray-300 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // const handleAddCart = async (id: any, qty: any) => {
  //   console.log('hgjhgjhgjhgjhg')
  //   const payload = {
  //     cart: getCartId,
  //     user: getUserId,
  //     vendor: vendorId,
  //     quantity: qty,
  //     product: id,
  //     created_by: getUserName ? getUserName : 'user',
  //     ...(selectedVariant?.id ? { product_variant: selectedVariant?.id } : ''),
  //     ...(selectedSize?.id ? { product_size: selectedSize?.id } : ''),
  //   };

  //   try {
  //     const response = await getProductVariantCartItemUpdate('', payload);
  //     if (response) {
  //       queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
  //     }
  //   } catch (error) { }
  // };

  const handleAddCart = async (id: any, qty: any) => {
    const payload: any = {
      cart: getCartId,
      user: getUserId,
      vendor: vendorId,
      quantity: qty,
      created_by: getUserName ? getUserName : 'user',
    };

    // First priority: selectedSize
    if (selectedSize?.id) {
      // payload.product = id;
      payload.product_size = selectedSize.id;
    }
    // Second priority: selectedVariant
    else if (selectedVariant?.id) {
      // payload.product = id;
      payload.product_variant = selectedVariant.id;
    }
    // Else: just product
    else {
      payload.product = id;
    }

    try {
      const response = await getProductVariantCartItemUpdate('', payload);
      if (response) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const newCartItem: CartItem = {
      id: product?.id,
      variantId: selectedVariant?.id,
      sizeId: selectedSize?.id || '',
      name: product?.name,
      variantName: selectedVariant?.product_variant_title,
      sizeName: selectedSize?.name || '',
      price: selectedVariant?.product_variant_price || product?.price,
      image: selectedVariant?.product_variant_image_urls[0] || product?.image_urls[0],
      quantity: 1,
    };
    onAddToCart(newCartItem);
  };

  // const handleUpdateCart = async (id: any, type: any, qty: any) => {
  //   try {
  //     if (qty === 1 && type === 'decrease') {
  //       const updateApi = await deleteCartitemsApi(`${id}`);
  //       if (updateApi) {
  //         queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
  //       }
  //     } else {
  //       if (!selectedVariant) {
  //         const response = await updateCartitemsApi(`${id}/${type}/`);
  //         if (response) {
  //           queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
  //         }
  //       } else {
  //         handleAddCart(id, 1);
  //       }
  //     }
  //   } catch (error) { }
  // };


  const handleUpdateCart = async (id: any, type: "increase" | "decrease", qty: number) => {
    try {
      const currentQty = Number(qty) || 0;

      // DELETE WHEN qty=1 & user clicks decrease
      if (type === "decrease" && currentQty <= 1) {
        const res = await deleteCartitemsApi(`${id}`);
        if (res) {
          // await queryClient.invalidateQueries(['getCartitemsData']);
          await queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);

        }
        return;
      }

      // UPDATE NORMAL CART
      if (type === "increase" || type === "decrease") {

        // If variant IS selected → always update normal API
        if (selectedVariant && selectedVariant !== "") {
          const res = await updateCartitemsApi(`${id}/${type}/`);
          if (res) {
            await queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);

          }
        }
        // If NO VARIANT → update directly
        else {
          const res = await updateCartitemsApi(`${id}/${type}/`);
          if (res) {
            await queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);

          }
        }
      }
    } catch (e) {
      console.error("Cart update error", e);
    }
  };


  const deleteCartItem = async (id: any) => {
    try {
      const updateApi = await deleteCartitemsApi(`${id}`);
      if (updateApi) {
        queryClient.invalidateQueries(['getCartitemsData'] as InvalidateQueryFilters);
      }
    } catch (error) { }
  };

  const { products }: any = useProducts();

  const relatedProducts = products?.data
    ?.filter((product: any) => product?.category === productData?.data?.data?.category)
    ?.slice(0, 4);

  // Derive color label from variant description
  const getColorLabel = (variant: any) => {
    const desc = variant?.product_variant_description || '';
    const colorMatch = desc.match(/(brown|black|gray|red|orange|pink|green|light green|purple|mauve)/gi);
    return colorMatch ? colorMatch.join('/').toUpperCase() : variant?.id;
  };

  return (
    <>
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover bg-center text-black">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="flex items-center gap-2  mb-6 text-black"
        >
          <ArrowLeft className="h-5 w-5 " />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-lg overflow-hidden">

            {selectedVariant?.product_variant_image_urls?.length === 1 ? (
              <Zoom>
                <img
                  src={selectedVariant.product_variant_image_urls[0]}
                  alt="Selected Variant"
                  className="w-full h-full object-cover"
                />
              </Zoom>
            ) : (
              <div className="relative w-full h-full">
                <Zoom>
                  <img
                    src={selectedVariant?.product_variant_image_urls?.[currentImageIndex] || product?.image_urls[0]}
                    alt={`Variant ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </Zoom>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0
                        ? selectedVariant?.product_variant_image_urls?.length - 1
                        : prev - 1
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-2 py-1 rounded-full"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === selectedVariant?.product_variant_image_urls?.length - 1
                        ? 0
                        : prev + 1
                    )
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-2 py-1 rounded-full"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div>
              <h1 className="text-3xl font-bold text-black capitalize">{productData?.data?.data?.name}</h1>
              {/* <p className="text-lg text-gray-400 mt-2">{productData?.data?.data?.brand_name}</p> */}
            </div>
            <div className="flex items-baseline gap-2 py-2">
              <span className="text-2xl font-bold text-black">
                ₹{selectedVariant?.product_variant_price || productData?.data?.data?.price}
              </span>
              {productData?.data?.data?.discount && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{productData?.data?.data?.discount}
                </span>
              )}
            </div>
            {/* <p className="text-black">{productData?.data?.data?.description}</p> */}
            <div dangerouslySetInnerHTML={{ __html: product?.description?.slice(0, 400) }} className="quill-content text-gray-600 py-2" />


            {/* Variant Selector for Colors */}
            <div className="space-y-4">
              {productData?.data?.data?.variants?.length > 0 &&
                <h3 className="text-lg font-semibold text-black">Select Variants</h3>
              }
              {/* <VariantSelector
                variants={productData?.data?.data?.variants}
                selectedVariantId={selectedVariant?.id}
                onSelect={(variant) => {
                  setSelectedVariant(variant);
                  setCurrentImageIndex(0); // Reset image index when variant changes
                  setSelectedSize(''); // Reset size when color changes
                }}
                sizekey={setSelectedSize}
                selectedSizeId={selectedSize}
                onSelectSize={setSelectedSize}
              /> */}
              <VariantSelector
                variants={productData?.data?.data?.variants}
                selectedVariantId={selectedVariant} // Pass the entire selectedVariant object
                onSelect={(variant) => {
                  setSelectedVariant(variant);
                  setCurrentImageIndex(0); // Reset image index when variant changes
                  setSelectedSize(''); // Reset size when color changes
                }}
                sizekey={setSelectedSize}
                selectedSizeId={selectedSize}
                onSelectSize={setSelectedSize}
              />
            </div>
            <div className="flex space-x-4">
              {matchingData?.map((item: any) => (
                <div key={item?.id} className="relative bg-white p-3 rounded-lg shadow-sm ">
                  <div className="absolute top-1 right-1 text-gray-600 hover:text-gray-800 cursor-pointer"
                    // onClick={()=>deleteCartItem(item?.cartId)}

                    onClick={() => {
                      console.log('Deleting:', item?.cartId); // Check this in console
                      deleteCartItem(item?.cartId);
                    }}

                  >
                    <X size={12} />
                  </div>
                  <div className="w-12 h-12 overflow-hidden ">
                    <img
                      className="w-full h-full object-cover"
                      src={item?.image_urls ? item?.image_urls[0] : "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="}
                      // src="https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
                      alt="Image"
                    />
                  </div>
                  <h1 className="text-xs font-semibold text-gray-800">
                    {item?.name || item?.product_variant_title || item?.product_size || 'No Name'}
                  </h1>
                  <p className="text-xs text-gray-600 mt-1">
                    ₹{item?.product_variant_price || item?.price || item?.product_size_price || 'N/A'} X {item?.cartQty}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t">
              {matchingData?.length && matchingData[0]?.cartQty > 0 ? (
                // <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                //   <button
                //     onClick={() =>
                //       handleUpdateCart(matchingData[0]?.cartId, 'decrease', matchingData[0]?.cartQty)
                //     }
                //     className="p-1 rounded-full hover:bg-gray-200"
                //   >
                //     <Minus className="h-4 w-4" />
                //   </button>
                //   <span>{totalQty ? totalQty : ''}</span>
                //   <button
                //     onClick={() => handleUpdateCart(matchingData[0]?.cartId, 'increase', '')}
                //     className="p-1 rounded-full hover:bg-gray-200"
                //   >
                //     <Plus className="h-4 w-4" />
                //   </button>
                // </div>

                // <div
                //   className="flex items-center gap-3 mt-2 p-2 rounded-full border border-gray-400 shadow-md w-max"
                //   onClick={(e) => e.stopPropagation()}
                // >
                //   <button
                //     onClick={() =>
                //       handleUpdateCart(matchingData[0]?.cartId, 'decrease', matchingData[0]?.cartQty)
                //     }
                //     className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transform hover:scale-110 transition-all"
                //   >
                //     <Minus className="h-5 w-5 text-gray-700" />
                //   </button>

                //   <span className="w-6 text-center font-semibold text-gray-800">
                //     {totalQty ? totalQty : '0'}
                //   </span>

                //   <button
                //     onClick={() => handleUpdateCart(matchingData[0]?.cartId, 'increase', '')}
                //     className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transform hover:scale-110 transition-all"
                //   >
                //     <Plus className="h-5 w-5 text-gray-700" />
                //   </button>
                // </div>

                <div
                  className="flex items-center mt-2 px-3 py-2 border border-gray-400 shadow-md rounded-xl bg-white w-max gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Decrease */}
                  <button
                    onClick={() =>
                      handleUpdateCart(matchingData[0]?.cartId, "decrease", matchingData[0]?.cartQty)
                    }
                    className="h-8 w-8 flex items-center justify-center  border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    <Minus className="h-4 w-4 text-gray-700" />
                  </button>

                  {/* Quantity */}
                  <span className="min-w-[28px] text-center text-lg font-semibold text-gray-800">
                    {totalQty ? totalQty : "0"}
                  </span>

                  {/* Increase */}
                  <button
                    onClick={() =>
                      handleUpdateCart(matchingData[0]?.cartId, "increase", 0)
                    }
                    className="h-8 w-8 flex items-center justify-center  border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    <Plus className="h-4 w-4 text-gray-700" />
                  </button>
                </div>

              ) : (
                // <LoadingButton
                //   disabled={!productData?.data?.data?.stock_quantity || productData?.data?.data?.stock_quantity === 0}
                //   className="px-8 py-3"
                //   onClick={(e) => {
                //     handleAddToCart();
                //     e.stopPropagation();
                //     if (getUserId) {
                //       withLoading(() => {
                //         onAddToCart({
                //           id: productData?.data?.data?.id,
                //           variantId: selectedVariant?.id,
                //           sizeId: selectedSize?.id || '',
                //           name: productData?.data?.data?.name,
                //           variantName: selectedVariant?.product_variant_title,
                //           sizeName: selectedSize?.name || '',
                //           price: selectedVariant?.product_variant_price || productData?.data?.data?.price,
                //           image: selectedVariant?.product_variant_image_urls[0] || productData?.data?.data?.image_urls[0],
                //           quantity: 1,
                //         });
                //         handleAddCart(productData?.data?.data?.id, 1);
                //       });
                //     } else {
                //       setSignInModal(true);
                //     }
                //   }}
                // >
                //   <Plus className="h-5 w-5" />
                //   {product?.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                // </LoadingButton>

                <LoadingButton
                  disabled={isAddToCartDisabled}
                  className="px-8 py-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!getUserId) {
                      setSignInModal(true);
                      return;
                    }

                    handleAddToCart();
                    withLoading(() => {
                      onAddToCart({
                        id: productData?.data?.data?.id,
                        variantId: selectedVariant?.id,
                        sizeId: selectedSize?.id || '',
                        name: productData?.data?.data?.name,
                        variantName: selectedVariant?.product_variant_title,
                        sizeName: selectedSize?.name || '',
                        price: selectedVariant?.product_variant_price || productData?.data?.data?.price,
                        image: selectedVariant?.product_variant_image_urls[0] || productData?.data?.data?.image_urls[0],
                        quantity: 1,
                      });
                      handleAddCart(productData?.data?.data?.id, 1);
                    });
                  }}
                >
                  <Plus className="h-5 w-5" />
                  {product?.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </LoadingButton>


              )}
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-border pt-12 m-4">
        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts?.map((product: any) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden">
                <Link to={`/products/${product.slug_name}`}>
                  <img
                    src={
                      product?.image_urls[0]
                        ? product?.image_urls[0]
                        : 'https://semantic-ui.com/images/wireframe/image.png'
                    }
                    alt={product?.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={300}
                    height={300}
                  />
                </Link>
              </div>
              <div className="p-4">
                <Link to={`/products/${product?.slug_name}`}>
                  <h3 className="font-medium text-lg mb-1 transition-colors group-hover:text-[#4D8B31]">
                    {product?.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold">₹{product?.price}</span>
                  {product?.cartId ? (
                    <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleUpdateCart(product?.cartId, 'decrease', product?.cartQty)}
                        className="p-1 rounded-full hover:bg-gray-200"
                        disabled={product?.cartQty <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span>{product?.cartQty}</span>
                      <button
                        onClick={() => handleUpdateCart(product?.cartId, 'increase', 0)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={product?.stock_quantity === 0 || product?.status === false}
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
                      <span className="sm:inline">
                        {product?.stock_quantity === 0 || product?.status === false ? (
                          'Out of Stock'
                        ) : (
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LoginModal open={signInmodal} handleClose={() => setSignInModal(false)} vendorId={vendorId} />
    </>
  );
}