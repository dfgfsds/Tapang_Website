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
  const { vendorId } = useVendor();

  // 🧠 Fetch banners from API
  useEffect(() => {
    if (!vendorId) return;
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${ApiUrls.banners}?vendorId=${vendorId}`);
        setBanners(res.data.banners || []);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    fetchBanners();
  }, [vendorId]);

  // 🌀 Auto slide every 5s
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  // 🧭 Navigation buttons
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="hero-slider-wrapper">
      {/* 🖼 Slider container — bg-black prevents white flash if image not loaded yet */}
      <div className="hero-slider-track">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <Link
              key={banner.id}
              href={banner.target_url || '#'}
              className={`hero-slide ${index === currentIndex ? 'hero-slide--active' : ''}`}
            >
              <img
                src={banner.image_url}
                alt="Banner"
                loading="eager"
                className="hero-slide-img"
              />
            </Link>
          ))
        ) : (
          <div className="hero-slide-skeleton" />
        )}

        {/* Dots */}
        {banners.length > 1 && (
          <div className="hero-dots">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`hero-dot ${i === currentIndex ? 'hero-dot--active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ◀ Prev */}
      {banners.length > 1 && (
        <>
          <button onClick={prevSlide} className="hero-btn hero-btn--prev" aria-label="Previous slide">
            <ChevronLeft className="hero-btn-icon" />
          </button>

          {/* ▶ Next */}
          <button onClick={nextSlide} className="hero-btn hero-btn--next" aria-label="Next slide">
            <ChevronRight className="hero-btn-icon" />
          </button>
        </>
      )}
    </div>
  );
}