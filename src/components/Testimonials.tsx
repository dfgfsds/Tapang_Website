"use client";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { useVendor } from "../context/VendorContext";
import { baseUrl } from "../api-endpoints/ApiUrls";

export default function Testimonials() {
  const { vendorId } = useVendor();
  const [reviews, setReviews] = useState<any[]>([]);

  // Static images array
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
      const res = await axios.get(`${baseUrl}/testimonial/?vendor_id=${vendorId}`);
      if (res.data?.testimonials) {
        // Map over the testimonials and add a random static image to each one
        const reviewsWithImages = res.data.testimonials.map((review: any, index: any) => ({
          ...review,
          img: staticImages[index % staticImages.length], // Assign a static image
        }));
        setReviews(reviewsWithImages);
      } else {
        console.warn('Unexpected API response:', res.data);
      }
    } catch (error) {
      // console.log('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    reviewsGetApi();
  }, [vendorId]);

  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<any>(null);

  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 5;
      if (window.innerWidth >= 1024) return 5;
      if (window.innerWidth >= 768) return 2;
    }
    return 1;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = reviews.length > 0 ? reviews.length - itemsPerSlide : 0;

  // Auto-scroll (1 card at a time)
  useEffect(() => {
    if (reviews.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 4000);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [current, maxIndex, reviews.length]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1)),
    onSwipedRight: () =>
      setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1)),
    trackMouse: true,
  });

  return (
    <section className="space-y-6 py-5">
      {/* <h2 className="text-3xl font-bold text-center mb-12">
        What Our Customers Say
      </h2> */}

      {reviews
        ?.filter((review: any) => review?.verified_status === true)?.length > 0 && (
          <div className="text-center mb-12">
            <h2 className="text-2xl text-gray-700  font-bold">What Our Customers Say</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-2 rounded"></div>
          </div>
        )}

      <div className="relative overflow-hidden" {...handlers}>
        <div
          className="flex transition-transform duration-500 gap-6"
          style={{
            transform: `translateX(-${(100 / itemsPerSlide) * current}%)`,
          }}
        >
          {reviews
            ?.filter((review: any) => review?.verified_status === true) // Only verified ones
            ?.map((review, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/5 xl:w-1/5 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
              >
                <img
                  src={review.img}
                  alt={review.title}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-gray-100 shadow-sm"
                />
                <p className="text-gray-600 text-sm mb-4 italic">
                  "{review.description}"
                </p>
                <h3 className="font-semibold text-gray-800">{review.title}</h3>
              </div>
            ))}

        </div>

        {/* Dots */}
        {reviews.length > 0 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full ${idx === current ? "bg-gray-800" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}