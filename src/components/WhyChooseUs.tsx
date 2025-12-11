import { FaRegGem } from "react-icons/fa"; // Premium Quality
import { CiDeliveryTruck } from "react-icons/ci"; // Fast Delivery
import { FaTags } from "react-icons/fa"; // Affordable Prices
import { MdOutlineHealthAndSafety } from "react-icons/md"; // Comfort Guarantee

export default function WhyChooseUs() {
  const features = [
    {
      title: "Premium Quality",
      desc: "High-quality slippers made with durable and premium materials.",
      icon: <FaRegGem size={40} color="#2563eb" />,
    },
    {
      title: "Fast Delivery",
      desc: "Quick and reliable delivery at your doorstep.",
      icon: <CiDeliveryTruck size={40} color="#2563eb" />,
    },
    {
      title: "Affordable Prices",
      desc: "Best prices with top-notch quality products.",
      icon: <FaTags size={40} color="#2563eb" />,
    },
    {
      title: "Comfort Guarantee",
      desc: "Designed to provide all-day softness and support for your feet.",
      icon: <MdOutlineHealthAndSafety size={40} color="#2563eb" />,
    },
  ];

  return (
    <section className="space-y-6 py-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-gray-700 font-bold">Why Choose Us</h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto mt-2 rounded"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-600/10">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-blue-600">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
