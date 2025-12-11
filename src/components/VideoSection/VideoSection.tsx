"use client";
import React, { useEffect, useRef, useState } from "react";
import ProductVideoModal from "./ProductVideoModal";
import axios from "axios";
import { useVendor } from "../../context/VendorContext";
import { baseUrl } from "../../api-endpoints/ApiUrls";

export default function VideoSection() {
  const [videoList, setVideoList] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { vendorId } = useVendor();
  // console.log(videoList)
  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${baseUrl}/videos/vendor/${vendorId}/`);
      setVideoList(res.data.videos || []);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [vendorId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;
    setIsDragging(true);
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  // ✅ Convert YouTube / Shorts to embeddable link
  const getVideoEmbed = (url: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "www.youtube.com/embed/");
    if (url.includes("youtube.com/shorts/")) return url.replace("shorts/", "embed/");
    return null;
  };

  // ✅ Don't render if there are no videos
  if (!videoList.length) return null;

  return (
    <div className="space-y-6 py-5">
      {/* Section Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold  text-gray-800">Shop By Videos</h2>
        <div className="mx-auto mt-2 h-[3px] w-20 bg-blue-600 rounded-full"></div>
      </div>

      {/* Video Scroller */}
   <div
  ref={scrollRef}
  className="flex overflow-x-auto gap-6 pb-4 px-4 cursor-grab active:cursor-grabbing scrollbar-hide"
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={stopDragging}
  onMouseLeave={stopDragging}
>


{videoList.map((video, index) => {
  const embedUrl = getVideoEmbed(video.thumbnail_url);

  return (
    <div
      key={index}
      className="min-w-[230px] max-w-[230px] bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-gray-200 cursor-pointer"
      onClick={() => setSelectedIndex(index)}
    >

      {/* Image / Video Section (Same style as uploaded UI) */}
      <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full object-cover"
            allow="autoplay; encrypted-media"
          ></iframe>
        ) : (
          <video
            src={video.thumbnail_url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        {/* Bottom Gradient Shadow (same as uploaded design) */}
        <div className="absolute bottom-0 left-0 w-full h-[90px] bg-gradient-to-t from-black/90 to-transparent px-3 py-2">
          <p className="text-white font-semibold text-sm leading-tight truncate capitalize">
            {video.title}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-white font-bold text-base">
              ₹{video?.product_details?.price}
            </span>

            {video.originalPrice &&
              video.originalPrice !== video.price && (
                <span className="text-gray-300 line-through text-sm">
                  ₹{video.originalPrice}
                </span>
              )}
          </div>
        </div>
      </div>

    </div>
  );
})}

      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <ProductVideoModal
          videoList={videoList}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );

}
