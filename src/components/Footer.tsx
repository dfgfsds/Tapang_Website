import { Link, useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, LinkedinIcon } from 'lucide-react';
import { useCategories } from '../context/CategoriesContext';
import { useQuery } from '@tanstack/react-query';
import { useVendor } from '../context/VendorContext';
import { getVendorDeliveryDetailsApi } from '../api-endpoints/authendication';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../api-endpoints/ApiUrls';
import { useUser } from '../context/UserContext';

export function Footer() {
  const { categories }: any = useCategories();
  const { vendorId } = useVendor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' })
  const [submitted, setSubmitted] = useState(false);
  const { user, setUser }: any = useUser();
  const navigate = useNavigate();
  const [testimonialData, setTestimonialData] = useState<any>()
  const [getUserId, setUserId] = useState<string | null>(null);
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
      await axios.post(`${baseUrl}/testimonial/`, { ...form, vendor: vendorId, verified_status: false, created_by: user?.data?.name ? user?.data?.name : 'user', user: getUserId })
      setSubmitted(true)
      setTimeout(() => {
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
      const res: any = await axios.get(`${baseUrl}/testimonial/?user_id=${user?.data?.id}&vendor_id=${vendorId}`);
      if (res?.data) {
        setTestimonialData(res?.data?.testimonials);
      } else {
        console.warn('Unexpected API response:', res.data);
      }
    } catch (error) {
      // console.log('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    testimonialGetApi();
  }, [user?.data?.id]);



  return (
    <>
      {!testimonialData?.length && (
        <section className="bg-gray-100 py-16 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">What Our Customers Say!</h2>
            <p className="text-gray-600 mb-8">
              We love to hear from our customers. Share your experience with us!
            </p>

            <button
              // onClick={() => {
              //   getUserId ?
              //     setIsModalOpen(true)
              //     :
              //     navigate('/login');
              // }}
              onClick={() => {
                if (getUserId) {
                  setIsModalOpen(true);
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate('/login');
                }
              }}

              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-900 transition mb-6"
            >
              Write a Testimonial
            </button>
          </div>
        </section>
      )}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">

            {/* About Section */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
              <p className="text-sm leading-relaxed">
                Tapang Thalaivare brings you comfortable, stylish, and high-quality slippers at affordable prices.
                We focus on great designs, long-lasting comfort, and a smooth shopping experience.
              </p>
              <div className="flex gap-4 mt-6">
                {socialMediaData?.facebook?.url && socialMediaData?.facebook?.status === true && (
                  <a
                    href={socialMediaData?.facebook?.url}
                    target='_blank'
                    className="hover:text-white transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socialMediaData?.twitter?.url && socialMediaData?.twitter?.status === true && (
                  <a
                    href={socialMediaData?.twitter?.url}
                    target='_blank'
                    className="hover:text-white transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {socialMediaData?.instagram?.url && socialMediaData?.instagram?.status === true && (
                  <a
                    href={socialMediaData?.instagram?.url}
                    target='_blank'
                    className="hover:text-white transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {socialMediaData?.youtube?.url && socialMediaData?.youtube?.status === true && (
                  <a
                    href={socialMediaData?.youtube?.url}
                    target='_blank'
                    className="hover:text-white transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                )}

                {socialMediaData?.linkedin?.url && socialMediaData?.linkedin?.status === true && (
                  <a
                    href={socialMediaData?.linkedin?.url}
                    target='_blank'
                    className="hover:text-white transition-colors">
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">My Account</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link to="/terms-conditions" className="hover:text-white transition-colors">Terms And Conditions</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
                <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              </ul>
            </div>

            {/* Categories */}
            {/* <div className="map-container">
            <iframe
              title="Haya Fashion Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.922005971965!2d80.11145947391385!3d13.040636387281083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5261000b4308d1%3A0xf5b5c13b268e275a!2sTAPANG%20TAPANG%20FOOTWEAR!5e0!3m2!1sen!2sin!4v1764227769381!5m2!1sen!2sin"
              width="300"
              height="200"
              loading="lazy"
              style={{ border: 0 }}
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div> */}

            {/* Contact Us */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>9591662899</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>mohammedsulthan037@gmail.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                  {/* <span>No.30/2, Fine Centre, East Street, Near Ambiga Collage, Anna Nagar, Madurai. 625020</span> */}
                  <span>
                    No 1 mettu street, kumachavadi main road, mangadu, Chennai, Tamil Nadu 600122
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <div className="map-container">
                    <iframe
                      // title="Haya Fashion Location"
                      src="https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1764743258548!5m2!1sen!2sin!6m8!1m7!1soIArH6BffkF7fBfZFSRZhA!2m2!1d13.03975499251976!2d80.13280048028312!3f315.1336914968661!4f-0.19815630195851952!5f1.0195941158950304"
                      // width="300"
                      // height="100"
                      className="w-full h-32 sm:h-40 md:h-48 lg:h-56"
                      loading="lazy"
                      style={{ border: 0 }}
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="border-t border-gray-800 mt-12 pt-8 ">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm">© {new Date().getFullYear()} Tapang Thalaivare. All rights reserved.</p>
              <div className="flex gap-6 text-sm">
                <Link to="/privacy-policy" className="hover:text-white transition-colors ">Privacy Policy</Link>
                <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-[9999] overflow-auto">
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
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Write your testimonial..."
                  rows={4}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-900 transition">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
