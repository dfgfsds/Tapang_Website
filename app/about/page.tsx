import React from "react";

export default function AboutPage() {
  return (
    <div className="w-full bg-white flex justify-center pt-10 pb-16 md:pt-14 md:pb-20 px-4 md:px-10 lg:px-16">
      <div className="max-w-5xl text-black leading-relaxed">

        {/* TITLE */}
        <h1 className="text-center font-sans text-[32px] md:text-[40px] font-semibold mb-5">
          About Us
        </h1>

        {/* INTRO */}
        <p className="text-[18.5px] md:text-[19px] mb-5">
          Welcome to <span className="font-semibold">Tapang Thalaivare</span>, your trusted destination for stylish,
          durable, and comfortable slippers for everyday wear. Our collection is crafted to bring together
          comfort, quality, and modern designs — ensuring your feet feel as good as they look.
        </p>

        <p className="text-[18.5px] md:text-[19px] mb-11 md:mb-14">
          What started as a simple idea — providing high-quality footwear at affordable prices — has now grown
          into a trusted name for slippers that perfectly blend style and comfort. Whether you're looking for
          daily-wear slippers, soft-sole comfort pairs, or trendy designs for outings,
          <span className="font-semibold"> Tapang Thalaivare </span> offers something for everyone.
        </p>

        {/* DIVIDER */}
        <div className="w-full flex justify-center mb-10">
          <div className="h-[4px] w-[130px] bg-black rounded-full"></div>
        </div>

        {/* OUR BRAND */}
        <div className="mb-11 md:mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[22px]">✨</span>
            <h2 className="text-[26px] md:text-[28px] font-semibold">Our Brand</h2>
          </div>

          <p className="text-[18.5px] md:text-[19px] mb-5">
            <span className="font-semibold">Tapang Thalaivare</span> stands for comfort, durability, and everyday style.
            Every pair is thoughtfully selected with high-quality materials to ensure long-lasting wear,
            smooth cushioning, and a premium feel — without the premium price.
          </p>

          <ul className="list-disc ml-6 space-y-[10px] text-[18.5px] md:text-[19px] mb-5">
            <li>
              <span className="font-semibold">Men’s Slippers:</span> Strong, stylish, and built for daily comfort.
            </li>
            <li>
              <span className="font-semibold">Women’s Slippers:</span> Elegant, lightweight, and crafted to match every outfit.
            </li>
            <li>
              <span className="font-semibold">Kid’s Slippers:</span> Soft, safe, and fun designs your little ones will love.
            </li>
          </ul>

          <p className="text-[18.5px] md:text-[19px]">
            Our mission is simple — to make comfort affordable. At
            <span className="font-semibold"> Tapang Thalaivare </span>
            we don’t just sell slippers. We deliver quality, durability,
            and the promise of comfort in every step.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="w-full flex justify-center mb-10">
          <div className="h-[4px] w-[130px] bg-black rounded-full"></div>
        </div>

        {/* OUR PROMISE */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[24px]">💎</span>
            <h2 className="text-[26px] md:text-[28px] font-semibold">Our Promise</h2>
          </div>

          <ul className="ml-[22px] space-y-[8px] text-[18.5px] md:text-[19px]">
            <li>✔ Premium comfort and long-lasting quality</li>
            <li>✔ Affordable pricing for all age groups</li>
            <li>✔ Soft, skin-friendly, and durable materials</li>
            <li>✔ Designed with care — delivered with comfort</li>
          </ul>
        </div>

        {/* CTA */}
      </div>
    </div>
  );
}
