// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { getCartApi } from '../api-endpoints/CartsApi';
// import { logEvent } from 'firebase/analytics';
// import { analytics } from './firebase-Analytics/firebaseAnalytics';
// import url from '../api-endpoints/ApiUrls'
// interface FormData {
//   email: string;
//   password: string;
// }

// export function LoginForm({vendorId}:any) {
//   const [error, setError] = useState('');

//   const navigate = useNavigate();
//   const [passwordShow, setPasswordShow] = useState(false);
//   const [loading,setLoading]=useState(false);

//   const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     logEvent(analytics, 'login', {
//       method: 'email_password', 
//       email:data?.email,
//     });
//     try {
//       const response: any = await axios.post(url.signIn,
//          {...data,  vendor_id: vendorId
//       })
//       if (response) {
//         localStorage.setItem('userId', response?.data?.user_id)
//         const updateApi = await getCartApi(`user/${response?.data?.user_id}`);
//         if (updateApi) {
//           localStorage.setItem('cartId', updateApi?.data[0]?.id);
//           navigate('/');
//           setLoading(false);
//           window.location.reload();
//         }

//       }
//     } catch (err:any) {
//       setLoading(false);
//       setError(err?.response?.data?.error || 'something went wrong, try again later');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div>
//         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//           Email
//         </label>
//         <div className="mt-1 relative">
//           <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           <input
//             id="email"
//             type="email"
//             {...register('email', { required: 'Email is required' })}
//             className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//         {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//       </div>

//       <div>
//         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//           Password
//         </label>
//         <div className="mt-1 relative">
//           <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           <input
//             id="password"
//             type={`${passwordShow ? 'text' : 'password'}`}
//             {...register('password', { required: 'Password is required' })}
//             className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//           {passwordShow ? (
//             <EyeOff onClick={() => setPasswordShow(false)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           ) : (
//             <Eye onClick={() => setPasswordShow(true)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           )}
//         </div>
//         {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="text-sm">
//           <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
//             Forgot your password?
//           </Link>
//         </div>
//       </div>

//       {error && (
//         <p className="text-red-500 text-sm">{error}</p>
//       )}

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full flex gap-2 mt-auto mb-auto justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//       >
//         Sign in {loading && <Loader className='animate-spin' />} 
//       </button>

//       <p className="text-sm text-gray-600 text-center">
//         Don't have an account?{' '}
//         <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
//           Create one
//         </Link>
//       </p>
//     </form>
//   );
// }

// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff, Loader, Smartphone } from 'lucide-react';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { getCartApi } from '../api-endpoints/CartsApi';
// import { logEvent } from 'firebase/analytics';
// import { analytics } from './firebase-Analytics/firebaseAnalytics';
// import url from '../api-endpoints/ApiUrls';

// interface FormData {
//   email?: string;
//   password?: string;
//   mobile?: string;
//   otp?: string;
// }

// export function LoginForm({ vendorId }: any) {
//   const [error, setError] = useState('');
//   const [passwordShow, setPasswordShow] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isOtpMode, setIsOtpMode] = useState(true); // Toggle Email / Mobile Login
//   const [otpSent, setOtpSent] = useState(false);

//   const navigate = useNavigate();
//   const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

//   // Send OTP API
//   const sendOtp = async (mobile: string) => {
//     setLoading(true);
//     try {
//       await axios.post(url.sendOtp, { mobile, vendor_id: vendorId, });
//       setOtpSent(true);
//     } catch (err: any) {
//       setError(err?.response?.data?.error || 'Failed to send OTP');
//     }
//     setLoading(false);
//   };

//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       let response: any;

//       if (isOtpMode) {
//         // Mobile OTP Login
//         response = await axios.post(url.verifyOtp, {
//           mobile: data?.mobile,
//           otp: data?.otp,
//           vendor_id: vendorId,
//         });
//       } else {
//         // Email Password Login
//         logEvent(analytics, 'login', {
//           method: 'email_password',
//           email: data?.email,
//         });

//         response = await axios.post(url.signIn, {
//           ...data,
//           vendor_id: vendorId,
//         });
//       }

//       if (response) {
//         localStorage.setItem('userId', response?.data?.user_id);
//         const updateApi = await getCartApi(`user/${response?.data?.user_id}`);
//         if (updateApi) {
//           localStorage.setItem('cartId', updateApi?.data[0]?.id);
//           navigate('/');
//           window.location.reload();
//         }
//       }
//     } catch (err: any) {
//       setError(err?.response?.data?.error || 'Something went wrong, try again later');
//     }
//     setLoading(false);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       {/* Toggle Button */}
//       <div className="flex justify-center gap-4 mb-4">
//         <button
//           type="button"
//           onClick={() => setIsOtpMode(true)}
//           className={`px-4 py-1 rounded-md ${isOtpMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         >
//           Mobile Login
//         </button>
//           <button
//           type="button"
//           onClick={() => setIsOtpMode(false)}
//           className={`px-4 py-1 rounded-md ${!isOtpMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//         >
//           Email Login
//         </button>
//       </div>

//       {/* Email Login */}
//       {!isOtpMode && (
//         <>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <div className="mt-1 relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="email"
//                 {...register('email', { required: 'Email is required' })}
//                 className="pl-10 w-full rounded-md border-gray-300 shadow-sm"
//               />
//             </div>
//             {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <div className="mt-1 relative">
//               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type={passwordShow ? 'text' : 'password'}
//                 {...register('password', { required: 'Password is required' })}
//                 className="pl-10 w-full rounded-md border-gray-300 shadow-sm"
//               />
//               {passwordShow ? (
//                 <EyeOff onClick={() => setPasswordShow(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" />
//               ) : (
//                 <Eye onClick={() => setPasswordShow(true)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" />
//               )}
//             </div>
//             {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//           </div>
//         </>
//       )}

//       {/* Mobile Login */}
//       {isOtpMode && (
//         <>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
//             <div className="mt-1 relative">
//               <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="tel"
//                 {...register('mobile', { required: 'Mobile number is required' })}
//                 className="pl-10 w-full rounded-md border-gray-300 shadow-sm"
//               />
//             </div>
//             {/* {otpSent && ( */}
//               <button type="button" onClick={() => sendOtp(String((document.querySelector('[name="mobile"]') as HTMLInputElement)?.value))} className="mt-2 text-blue-600 text-sm">
//                 Send OTP
//               </button>
//             {/* )} */}
//           </div>

//           {otpSent && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
//               <input
//                 type="text"
//                 {...register('otp', { required: 'OTP is required' })}
//                 className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
//               />
//             </div>
//           )}
//         </>
//       )}

//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full flex justify-center gap-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600"
//       >
//         {isOtpMode ? 'Verify & Login' : 'Sign in'} {loading && <Loader className="animate-spin" />}
//       </button>

//       {!isOtpMode && (
//         <p className="text-sm text-gray-600 text-center">
//           Don't have an account? <Link to="/register" className="text-blue-600">Create one</Link>
//         </p>
//       )}
//     </form>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';
import { useVendor } from '../context/VendorContext';
import axios from 'axios';
import { getCartApi } from '../api-endpoints/CartsApi';
import { postSendSmsOtpUserApi, postVerifySmsOtpApi } from '../api-endpoints/authendication';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../api-endpoints/ApiUrls';
import ApiUrls from '../api-endpoints/ApiUrls';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const { vendorId } = useVendor();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'email' | 'otp'>('otp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [timer, setTimer] = useState(0); // 🔹 For resend timer

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', mobile: '', otp: '' });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      navigate("/profile"); // 👈 correct redirect
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);

  // 🔹 Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Handle Email/Password Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) newErrors.email = 'Please enter a valid email';
      else newErrors.email = '';
    }

    setFormData({ ...formData, [name]: value });
    setErrors(newErrors);
  };

  // ✅ Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = {
      email: formData.email ? '' : 'Email is required',
      password: formData.password ? '' : 'Password is required',
      mobile: '',
      otp: '',
    };
    setErrors(validationErrors);

    const hasError = Object.values(validationErrors).some((msg) => msg !== '');
    if (hasError) return;

    try {
      setLoading(true);
      const response = await axios.post(ApiUrls.signIn, {
        ...formData,
        vendor_id: vendorId,
      });

      if (response?.data?.user_id) {
        localStorage.setItem('userId', response.data.user_id);

        const updateApi = await getCartApi(`user/${response.data.user_id}`);
        if (updateApi?.data?.length > 0) {
          localStorage.setItem('cartId', updateApi.data[0].id);
        }

        navigate('/products');
        window.location.reload();
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      setErrors({ ...errors, mobile: 'Enter a valid 10-digit mobile number' });
      return;
    }

    setLoading(true);
    try {
      const res = await postSendSmsOtpUserApi({
        contact_number: mobile,
        vendor_id: vendorId,
      });
      if (res?.data?.token) {
        setOtpSent(true);
        setToken(res.data.token);
        setTimer(30); // 🔹 Start 30-sec cooldown
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrors({ ...errors, otp: 'OTP is required' });
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await postVerifySmsOtpApi({
        otp: otp,
        token: token,
        login_type: 'user',
        vendor_id: vendorId,
      });

      const userId = res?.data?.user_id;
      if (userId) {
        localStorage.setItem('userId', userId);
        const cartRes = await getCartApi(`user/${userId}`);
        if (cartRes?.data?.length > 0) {
          localStorage.setItem('cartId', cartRes.data[0].id);
        }
        window.location.reload();
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset OTP Flow if Mobile Number Changes
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setMobile(value);
      setErrors({ ...errors, mobile: '' });
      setOtpSent(false); // Reset OTP flow if user changes mobile number
      setOtp('');
      setToken(null);
      setTimer(0);
    }
  };

  return (
    <div className=" flex items-center justify-center  px-4">
      <div className=" p-2 w-full max-w-md">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('otp')}
            className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'otp' ? 'border--green-900 text--green-900' : 'text-gray-600 border-transparent'
              }`}
          >
            OTP Login
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'email' ? 'border--green-900 text--green-900' : 'text-gray-600 border-transparent'
              }`}
          >
            Email Login
          </button>
        </div>

        {/* EMAIL LOGIN */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-900 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* OTP LOGIN */}
        {activeTab === 'otp' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={mobile}
                onChange={handleMobileChange}
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter 10-digit mobile number"
              />
              {errors.mobile && <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>}
              {mobile && mobile.length < 10 && (
                <p className="text-sm text-red-600 mt-1">
                  Mobile number must be 10 digits
                </p>
              )}

            </div>

            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                disabled={loading || mobile.length !== 10}
                className={`w-full py-2 rounded transition ${mobile.length === 10
                  ? 'bg-blue-600 text-white hover:bg-blue-900'
                  : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium">Enter OTP</label>
                  <input
                    required
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setOtp(value);
                      setErrors({ ...errors, otp: '' });
                    }}
                    className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.otp ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter the OTP"
                  />
                  {errors.otp && <p className="text-sm text-red-500 mt-1">{errors.otp}</p>}
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-900 transition"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>

                {/* 🔹 Resend OTP Button */}
                <div className="text-center mt-3">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-500">Resend OTP in {timer}s</p>
                  ) : (
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-blue-900 text-sm hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <p className="text-sm text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-blue-900 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginForm;
