"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useVendor } from "@/context/VendorContext";
import ApiUrls from "../../api-endpoints/ApiUrls";
import { formatDate } from "@/lib/utils";

export default function CustomerReviews() {
  const { vendorId } = useVendor();
  const [reviews, setReviews] = useState<any[]>([]);

  const staticImages = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
    "https://randomuser.me/api/portraits/men/55.jpg",
    "https://randomuser.me/api/portraits/women/12.jpg",
    "https://randomuser.me/api/portraits/men/41.jpg",
    "https://randomuser.me/api/portraits/women/70.jpg",
    "https://randomuser.me/api/portraits/men/85.jpg",
  ];

  const reviewsGetApi = async () => {
    try {
      const res = await axios.get(`${ApiUrls?.testimonial}?vendor_id=${vendorId}`);
      if (res.data?.testimonials) {
        const reviewsWithImages = res.data.testimonials.map((review: any, index: number) => ({
          ...review,
          img: staticImages[index % staticImages.length],
        }));
        setReviews(reviewsWithImages);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    if (vendorId) {
      reviewsGetApi();
    }
  }, [vendorId]);

  const verifiedReviews = useMemo(() =>
    reviews.filter((review: any) => review?.verified_status === true),
    [reviews]
  );

  // Repeat the list 6 times to ensure it fills the screen even with few reviews
  const infiniteReviews = useMemo(() =>
    [...verifiedReviews, ...verifiedReviews, ...verifiedReviews, ...verifiedReviews, ...verifiedReviews, ...verifiedReviews],
    [verifiedReviews]
  );

  if (verifiedReviews.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50 bg-cusBgImage bg-cover bg-center bg-no-repeat overflow-hidden" style={{ minHeight: '400px' }}>
      <div className="container mx-auto px-4 mb-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto italic">
            "Discover what our customers love about our trendy collections, premium quality, and comfortable fashion made just for you."
          </p>
        </div>
      </div>

      {/* Reviews Marquee — Centered Infinity Method */}
      <div className="review-marquee review-marquee--centered">
        <div className="review-marquee-track">
          {infiniteReviews.map((review: any, idx: number) => (
            <div
              key={`${review.id}-${idx}`}
              className="review-marquee-item"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg h-full border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{review?.title}</h4>
                  </div>
                  <div className="flex gap-0.5 text-orange-400">
                    {[...Array(3)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-base mb-6 flex-grow leading-relaxed">
                  "{review?.description || "Great experience shopping here! Highly recommended for anyone looking for quality."}"
                </p>
                <div className="pt-4 border-t border-gray-50 flex justify-between items-center mt-auto">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{formatDate(review?.created_at)}</span>
                  <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-md font-medium">Verified Purchase</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
