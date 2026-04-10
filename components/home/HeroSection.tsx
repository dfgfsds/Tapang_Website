'use client';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import ApiUrls from '@/api-endpoints/ApiUrls';
import { useVendor } from '@/context/VendorContext';

export default function HeroSection() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { vendorId } = useVendor();

  // 🧠 Fetch banners from API
  const bannerGetApi = async () => {
    try {
      const res = await axios.get(`${ApiUrls.banners}?vendorId=${vendorId}`);
      setBanners(res.data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    bannerGetApi();
  }, [vendorId]);

  // 📱 Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // 🌀 Auto slide every 5s
  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  // 🧭 Navigation buttons
  const nextSlide = () => {
    if (banners.length) {
      setCurrentIndex((current) => (current + 1) % banners.length);
    }
  };

  const prevSlide = () => {
    if (banners.length) {
      setCurrentIndex((current) => (current - 1 + banners.length) % banners.length);
    }
  };

  // We show a placeholder with the same aspect ratio if isMobile is still null (initial hydration)
  // This prevents the "white screen" flash by maintaining layout stability.
  const isLoading = isMobile === null || banners.length === 0;

  return (
    <div className="relative w-full">
      {/* Banner container */}
      <div className="relative w-full aspect-[16/6] overflow-hidden bg-[#dcd8c4]">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <Link
              key={banner.id}
              href={banner.target_url || "#"}
              className={`absolute inset-0 transition-opacity duration-1000
                ${index === currentIndex ? "opacity-100 z-20" : "opacity-0 z-10"}
              `}
            >
              <img
                src={banner.image_url}
                alt="Banner"
                className="w-full h-full object-contain object-center"
              />
            </Link>
          ))
        ) : (
          /* Placeholder / Skeleton while loading */
          <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
            <div className="text-gray-300">Loading Banners...</div>
          </div>
        )}
      </div>

      {/* Prev */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30"
        aria-label="Previous slide"
      >
        <span className="inline-flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-black/30 hover:bg-black/50 transition">
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </span>
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30"
        aria-label="Next slide"
      >
        <span className="inline-flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-black/30 hover:bg-black/50 transition">
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </span>
      </button>
    </div>
  );
}