import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderItemApi } from "../api-endpoints/CartsApi";
import { formatDate } from "../utils/date";

function OrderSingleView({ vendorId }: any) {
    const navigate = useNavigate();
    const { id } = useParams();
    const userId = localStorage.getItem('userId')

    const { data }: any = useQuery({
        queryKey: ['getOrderSingle', vendorId],
        queryFn: () => getOrderItemApi(`?user_id=${userId}&vendor_id=${vendorId}&order_id=${id}`)
    });
    return (
        <>
            {/* Back Button */}
            <div className="p-5">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-700 hover:text-black"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                </button>
            </div>

            <div className="lg:px-5 px-5 pb-0">
                <h1 className="text-3xl font-extrabold mb-4">Order Details</h1>

                {/* Order Summary Card */}
                <div className="border rounded-xl shadow-lg p-6 bg-white">
                    <div className="flex flex-col md:flex-row justify-between gap-5">

                        {/* Left */}
                        <div className="text-slate-600 font-medium space-y-2">
                            <p>
                                Order Date:
                                <span className="ml-2 text-slate-900 font-semibold">
                                    {data?.data?.created_at ? formatDate(data?.data?.created_at) : ""}
                                </span>
                            </p>

                            <p>
                                Total Amount:
                                <span className="ml-2 text-slate-900 font-semibold">
                                    ₹{data?.data?.total_amount}
                                </span>
                            </p>
                        </div>

                        {/* Right */}
                        <div className="text-slate-600 font-medium space-y-2">
                            <p>
                                Ship to:
                                <span className="ml-2 text-slate-900 font-semibold">
                                    {data?.data?.consumer_address?.address_type}
                                </span>
                            </p>

                            <p className="flex items-center gap-2">
                                Status:
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold
              ${data?.data?.status === "Delivered"
                                            ? "bg-green-100 text-green-700"
                                            : data?.data?.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : data?.data?.status === "Processing"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : data?.data?.status === "Shipped"
                                                        ? "bg-indigo-100 text-indigo-700"
                                                        : data?.data?.status === "Cancelled"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {data?.data?.status?.charAt(0).toUpperCase() +
                                        data?.data?.status?.slice(1)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Items Section */}
                    <h2 className="text-xl font-bold mt-8 mb-3">Items in Order</h2>

                    <div className="space-y-4">
                        {data?.data?.order_items?.map((item: any) => (
                            <div
                                key={item?.id}
                                className="border bg-gray-50 rounded-xl p-4 flex gap-5 items-center shadow-sm hover:shadow-md transition"
                            >
                                <img
                                    className="h-24 w-24 rounded-lg object-cover border"
                                    src={
                                        item?.product_details?.image_urls[0]
                                            ? item?.product_details?.image_urls[0]
                                            : "https://cdn.shopify.com/s/files/1/2303/2711/files/2_e822dae0-14df-4cb8-b145-ea4dc0966b34.jpg?v=1617059123"
                                    }
                                />

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {item?.product_details?.name}
                                    </h3>

                                    <p className="text-sm text-gray-600 mt-1">
                                        Quantity:
                                        <span className="ml-1 text-gray-800 font-medium">
                                            {item?.quantity}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        Price:
                                        <span className="ml-1 text-gray-800 font-medium">
                                            ₹{item?.product_details?.price}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    )
}

export default OrderSingleView;