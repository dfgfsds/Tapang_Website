'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import logo from '../../public/img/logo.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ApiUrls from '@/api-endpoints/ApiUrls';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import { useUser } from '@/context/UserContext';
import { useQuery } from '@tanstack/react-query';
import { getVendorDeliveryDetailsApi } from '@/api-endpoints/authendication';
import { FaLinkedin } from 'react-icons/fa';

export default function Footer() {

  const [testimonialData, setTestimonialData] = useState<any>()
  const [getUserId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' })
  const { vendorId } = useVendor();
  const [submitted, setSubmitted] = useState(false);
  const { user, setUser }: any = useUser();

  const getVendorDeliveryDetailsData: any = useQuery({
    queryKey: ['getVendorDeliveryDetailsData', vendorId],
    queryFn: () => getVendorDeliveryDetailsApi(`${vendorId}`),
    enabled: !!vendorId
  })
  const socialMediaData = getVendorDeliveryDetailsData?.data?.data?.vendor_site_details?.social_media_icon;

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  const handleFormChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      await axios.post(`${ApiUrls?.testimonial}`, { ...form, vendor: vendorId, verified_status: false, created_by: user?.data?.name ? user?.data?.name : 'user', user: getUserId })
      setSubmitted(true)
      setTimeout(() => {
        testimonialGetApi();
        setIsModalOpen(false)
        setForm({ title: '', description: '' })
        setSubmitted(false)
      }, 1500)
    } catch (err) {
      console.error(err)
      alert('Error submitting testimonial')
    }
  }

  const testimonialGetApi = async () => {
    try {
      const res: any = await axios.get(`${ApiUrls?.testimonial}?user_id=${user?.data?.id}&vendor_id=${vendorId}`);
      if (res?.data) {
        setTestimonialData(res?.data?.testimonials);
      } else {
        console.warn('Unexpected API response:', res.data);
      }
    } catch (error) {
      console.log('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    testimonialGetApi();
  }, [user?.data?.id]);

  return (
    <footer className="relative bg-green-100 border-t border-border overflow-hidden">
      {!testimonialData?.length && (
        <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold  mb-4">    What Our Customers Say!</h2>
            <p className="text-gray-600 mb-8">
              We love to hear from our customers. Share your experience with us!
            </p>

            <button
              onClick={() => {
                getUserId ?
                  setIsModalOpen(true)
                  :
                  router.push('/auth/login');
              }}
              className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-500 transition mb-6"
            >
              Write a Testimonial
            </button>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              {/* <span className="text-[#D9951A]">La </span>
              <span className="text-[#8BC34A]">Athulyam</span> */}
              <Image src={logo} height={150} width={150} alt='Chettinad Palakaaram logo' />
            </h3>
            {/*
            <p className="text-muted-foreground">
              "Pure taste. Real tradition. Freshly made Chettinad snacks, every time."
            </p>
            */}

            <div className="flex space-x-6">
              {socialMediaData?.facebook?.url && socialMediaData?.facebook?.status === true && (
                <a
                  href={socialMediaData?.facebook?.url}
                  target='_blank' className="bg-slate-100 p-2 hover:scale-110 transition-transform rounded-full text-[#000] ">
                  <Facebook size={16} />
                </a>
              )}
              {socialMediaData?.twitter?.url && socialMediaData?.twitter?.status === true && (
                <a
                  href={socialMediaData?.twitter?.url}
                  target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                  <Twitter size={16} />
                </a>
              )}
              {socialMediaData?.youtube?.url && socialMediaData?.youtube?.status === true && (
                <a
                  href={socialMediaData?.youtube?.url}
                  target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                  <Youtube size={16} />
                </a>
              )}
              {socialMediaData?.instagram?.url && socialMediaData?.instagram?.status === true && (
                <a
                  href={socialMediaData?.instagram?.url}
                  target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                  <Instagram size={16} />
                </a>
              )}
              {socialMediaData?.linkedin?.url && socialMediaData?.linkedin?.status === true && (
                <a
                  href={socialMediaData?.linkedin?.url}
                  target='_blank' className="bg-slate-100 p-2 rounded-full text-[#000] hover:scale-110 transition-transform">
                  <FaLinkedin size={16} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-muted-foreground hover:text-blue-500">All Products</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-blue-500">Categories</Link></li>
              {/* <li><Link href="/bestsellers" className="text-muted-foreground hover:text-[#D9951A]">Best Sellers</Link></li>
              <li><Link href="/new" className="text-muted-foreground hover:text-[#D9951A]">New Arrivals</Link></li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-blue-500">Our Story</Link></li>
              {/* <li><Link href="/sustainability" className="text-muted-foreground hover:text-[#D9951A]">Sustainability</Link></li> */}
              {/* <li><Link href="/blog" className="text-muted-foreground hover:text-blue-500">Blog</Link></li> */}
              <li><Link href="/contact" className="text-muted-foreground hover:text-blue-500">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Policy Pages</h4>
            <ul className="space-y-2">
              <li><Link href="/shipping-policy" className="text-muted-foreground hover:text-blue-500">Shipping & Delivery</Link></li>
              <li><Link href="/cancellation-policy" className="text-muted-foreground hover:text-blue-500">Cancellation & Refund</Link></li>
              <li><Link href="/terms-conditions" className="text-muted-foreground hover:text-blue-500"> Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-blue-500">Privacy Policy</Link></li>
              {/* <li><Link href="/shipping-policy" className="text-muted-foreground hover:text-[#d5a773]">Shipping Policy</Link></li> */}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center relative z-10">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tapang Thalaivare. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/visa.svg" alt="Visa" className="h-6 w-auto opacity-70" />
            <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mastercard.svg" alt="Mastercard" className="h-6 w-auto opacity-70" />
            <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/paypal.svg" alt="PayPal" className="h-6 w-auto opacity-70" />
            <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/applepay.svg" alt="Apple Pay" className="h-6 w-auto opacity-70" />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[9999] overflow-auto ">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mt-24 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h3 className="text-2xl font-semibold mb-4 text-center">Share Your Feedback</h3>

            {submitted ? (
              <div className="text-center text-green-600 font-medium py-6">
                ✅ Thank you for your feedback!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="Your Name"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Write your testimonial..."
                  rows={4}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                />
                <button type="submit" className="w-full py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
