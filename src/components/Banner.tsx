import React, { useEffect, useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import banner1 from "../../src/assets/image/banner-1-haya.png"
// import banner2 from "../../src/assets/image/banner-2-haya.jpeg"
// import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../api-endpoints/ApiUrls';

// const bannerImages = [
//   {
//     url: banner1,
//     title: 'Elegance Woven in Modesty',
//     subtitle: 'Timeless Hijabs for the Modern You'
//   },
//   {
//     url: banner2,
//     title: 'Style with Purpose, Grace with Abya',
//     subtitle: 'Where Fashion Meets Faith'
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1920&h=600',
//     title: 'Your Hijab. Your Style. Your Identity',
//     subtitle: 'Celebrate Modesty with Confidence'
//   }
// ];

export function Banner() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);

  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  // const router = useRouter();


  const filteredBanners = banners.filter(banner =>
    isMobile ? banner.type === 'Mobile View' : banner.type === 'Web View'
  );

  const length = filteredBanners.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 5000);
    return () => clearInterval(timer);
  }, [length]);

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % length);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  const bannerGetApi = async () => {
    try {
      const res = await axios.get(`${baseUrl}/banners/?vendorId=146`);
      if (res.data?.banners) {
        setBanners(res.data.banners);
      } else {
        console.warn('Unexpected API response:', res.data);
      }
    } catch (error) {
      // console.log('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    bannerGetApi();
  }, []);


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) return null;


  return (
    // <div className="relative h-[400px] overflow-hidden">
    //   {bannerImages.map((banner, index) => (
    //     <div
    //       key={index}
    //       className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
    //         }`}
    //     >
    //       <Link to='/shop'>
    //         <div
    //           className="absolute inset-0 bg-cover bg-center"
    //           style={{ backgroundImage: `url(${banner.url})` }}
    //         >
    //           <div className="absolute inset-0 bg-black bg-opacity-40" />
    //         </div>
    //         <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
    //           <h2 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h2>
    //           <p className="text-xl md:text-2xl">{banner.subtitle}</p>
    //         </div>
    //       </Link>
    //     </div>
    //   ))}

    //   <button
    //     onClick={prevSlide}
    //     className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
    //   >
    //     <ChevronLeft className="h-6 w-6 text-white" />
    //   </button>
    //   <button
    //     onClick={nextSlide}
    //     className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
    //   >
    //     <ChevronRight className="h-6 w-6 text-white" />
    //   </button>

    //   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
    //     {bannerImages.map((_, index) => (
    //       <button
    //         key={index}
    //         onClick={() => setCurrentIndex(index)}
    //         className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50'
    //           }`}
    //       />
    //     ))}
    //   </div>
    // </div>
    <div className="relative w-full">
      <div className="relative h-80 md:h-96 overflow-hidden">
        {filteredBanners.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100" : "opacity-0"
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img.image_url})` }}
            >
              <div className="absolute" />
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {filteredBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${index === current ? "bg-white" : "bg-gray-400"
              }`}
          ></button>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 6 10"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
          </svg>
        </span>
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer"
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 hover:bg-white/50">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 6 10"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 9l4-4-4-4" />
          </svg>
        </span>
      </button>
    </div>
  );
}