'use client';
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams } from 'next/navigation';
import { getOrderItemApi } from "@/api-endpoints/CartsApi";
// import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { useVendor } from "@/context/VendorContext";
import { useEffect, useState } from "react";
import { formatDate, formatPrice } from "@/lib/utils";

function OrderSingleView() {
    const params = useParams();
    const id = params.id;
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const { vendorId } = useVendor();

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        setUserId(storedId);
    }, []);

    const { data }: any = useQuery({
        queryKey: ['getOrderSingle', vendorId],
        queryFn: () => getOrderItemApi(`?user_id=${userId}&vendor_id=${vendorId}&order_id=${id}`)
    });

    return (
        <div className="bg-blue-50 min-h-screen">
            <div className="container mx-auto px-4 py-12 ">
                <button
                    onClick={() => {
                        router.back();
                    }}
                    className="cursor-pointer mb-5 font-bold flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                </button>
                <div className="">
                    <h1 className="text-2xl font-extrabold mb-2">Order Details</h1>
                    <div className="border shadow-xl p-5 bg-white mb-10">
                        <div className="flex justify-between flex-wrap ">
                            <div className="text-slate-500 font-medium">
                                <div className="mb-2">
                                    Order Date:<span className="ml-1 text-slate-700 font-bold">{data?.data?.created_at ? formatDate(data?.data?.created_at) : ''} </span>
                                </div>
                                <div>
                                    Total Amount:<span className="ml-1 text-slate-700 font-bold">{formatPrice(data?.data?.total_amount)}</span>
                                </div>
                            </div>

                            <div className="text-slate-500 font-medium">
                                <div className="mb-2">
                                    Ship to:<span className="ml-1 text-slate-700 font-bold">{data?.data?.consumer_address?.address_type} </span>
                                </div>
                                <div>
                                    Status:<span className="ml-1 text-slate-700 font-bold">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${data?.data?.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                data?.data?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {data?.data?.status?.charAt(0).toUpperCase() + data?.data?.status?.slice(1)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold my-3">Items in Order:</h1>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {data?.data?.order_items?.map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="box border bg-slate-100 flex gap-5 p-3 rounded-md"
                                    >
                                        <img
                                            className="h-20 w-20 rounded object-cover"
                                            src={
                                                item?.product_details?.image_urls?.[0] ||
                                                "https://semantic-ui.com/images/wireframe/image.png"
                                            }
                                            alt={item?.product_details?.name}
                                        />

                                        <div className="flex flex-col justify-center">
                                            <h1 className="text-lg font-semibold">
                                                {item?.product_details?.name}
                                            </h1>
                                            <p>
                                                Quantity:
                                                <span className="ml-1 font-medium">{item?.quantity}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSingleView;