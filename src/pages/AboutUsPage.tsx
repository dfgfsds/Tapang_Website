import React from "react";


function AboutUsPage() {
  return (
    <div className="w-full bg-white flex justify-center pt-10 pb-16 md:pt-14 md:pb-20 px-4 md:px-10 lg:px-16">
      <div className="max-w-5xl text-black leading-relaxed">
        <h1 className="text-center font-sans text-[32px] md:text-[40px] font-semibold text-black mb-5">
          About Us
        </h1>

        <p className="text-[18.5px] tracking-wide md:tracking-normal md:text-[19px] text-black mb-5">
          Welcome to <span className="font-semibold">Tapang Thalaivare</span>,  your trusted destination for stylish, 
          durable, and comfortable slippers for everyday wear. Our collection is crafted to bring together 
          comfort, quality, and modern designs — ensuring your feet feel as good as they look.
        </p>

        <p className="text-[18.5px] md:text-[19px] text-black mb-11 md:mb-14">
           What started as a simple idea — providing high-quality footwear at affordable prices — has now grown 
           into a trusted name for slippers that perfectly blend style and comfort. Whether you're looking for 
           daily-wear slippers, soft-sole comfort pairs, or trendy designs for outings, <span className="font-semibold"> Tapang Thalaivare </span>  
           offers something for everyone.
        </p>

        <div className="w-full flex justify-center mb-10">
          <div className="h-[4px] w-[130px] bg-black rounded-full"></div>
        </div>

        <div className="mb-11 md:mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[22px]">✨</span>
            <h2 className="text-[26px] md:text-[28px] font-semibold text-black">Our Brand</h2>
          </div>

          <p className="text-[18.5px] md:text-[19px] text-black mb-5">
            <span className="font-semibold">Tapang Thalaivare</span> stands for comfort, durability, and everyday style. 
            Every pair is thoughtfully selected with high-quality materials to ensure long-lasting wear, smooth 
            cushioning, and a premium feel — without the premium price.
          </p>

          <ul className="list-disc ml-6 space-y-[10px] text-[18.5px] md:text-[19px] text-black mb-5">
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

          <p className="text-[18.5px] md:text-[19px] text-black">
            Our mission is simple — to make comfort affordable. At  <span className="font-semibold">Tapang Thalaivare</span> we 
            don’t just sell slippers. We deliver quality, durability, and the promise of comfort in every step.
          </p>
        </div>

        <div className="w-full flex justify-center mb-10">
          <div className="h-[4px] w-[130px] bg-black rounded-full"></div>
        </div>

        <div className="mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[24px]">💎</span>
            <h2 className="text-[26px] md:text-[28px] font-semibold text-black">Our Promise</h2>
          </div>

          <ul className="ml-[22px] space-y-[8px] text-[18.5px] md:text-[19px] text-black mb-5">
            <li>
              <span className="text-[18px] md:text-[20px] text-black mr-1">✔</span>
              <span>Premium comfort and long-lasting quality</span>
            </li>

            <li>
              <span className="text-[18px] md:text-[20px] text-black mr-1">✔</span>
              <span>Affordable pricing for all age groups</span>
            </li>

            <li>
              <span className="text-[18px] md:text-[20px] text-black mr-1">✔</span>
              <span>Soft, skin-friendly, and durable materials</span>
            </li>

            <li>
              <span className="text-[18px] md:text-[20px] text-black mr-1">✔</span>
              <span>Designed with care — delivered with comfort</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <h2 className="text-[32px] font-semibold text-black mb-3">
            What Our Customers Say!
          </h2>

          <p className="text-[17.5px] text-black mb-6">
            We love to hear from our customers. Share your experience with us!
          </p>

          <button
            className="bg-black text-white px-8 py-3 rounded-lg text-[16px] font-medium hover:bg-[#16307a] transition"
          >
            Write a Testimonial
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;