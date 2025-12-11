// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { Eye, EyeOff, Lock, Mail, Smartphone, KeyRound, X, Loader2 } from "lucide-react";
// import { getCartApi } from "../../api-endpoints/CartsApi";
// import { postSendSmsOtpUserApi, postVerifySmsOtpApi } from "../../api-endpoints/authendication";
// // import { postSendSmsOtpUserApi, postVerifySmsOtpApi } from "../../api-endpoints/authendication";
// import ApiUrls from "../../api-endpoints/ApiUrls";
// interface LoginModalProps {
//   open: boolean;
//   handleClose: () => void;
//   vendorId: any;
// }

// interface FormData {
//   email?: string;
//   password?: string;
//   mobile?: string;
//   otp?: string;
// }

// const LoginModal: React.FC<LoginModalProps> = ({ open, handleClose, vendorId }) => {
//   if (!open) return null;

//   const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("mobile");
//   const [passwordShow, setPasswordShow] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [token, setToken] = useState("");
//   const [resendTimer, setResendTimer] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     setValue,
//     reset,
//   } = useForm<FormData>();

//   // Handle email login
//   const handleEmailLogin = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const response: any = await axios.post(
//         // "https://ecomapi.ftdigitalsolutions.org/user_login/",
//         ApiUrls?.userLogin,
//         { ...data, vendor_id: vendorId }
//       );
//       if (response?.data?.user_id) {
//         localStorage.setItem("userId", response.data.user_id);

//         const cartResponse = await getCartApi(`user/${response.data.user_id}`);
//         localStorage.setItem("cartId", cartResponse?.data[0]?.id);

//         handleClose();
//         window.location.reload();
//       }
//     } catch {
//       setError("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send OTP API
//   const sendOtp = async (data: FormData) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res: any = await postSendSmsOtpUserApi({
//         contact_number: data.mobile,
//         vendor_id: vendorId,
//       });

//       if (res?.data?.token) {
//         setToken(res.data.token);
//         setOtpSent(true);
//         setResendTimer(60);
//       }
//     } catch {
//       setError("Failed to send OTP. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // OTP Countdown
//   useEffect(() => {
//     let timer: any;
//     if (resendTimer > 0) {
//       timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
//     }
//     return () => clearInterval(timer);
//   }, [resendTimer]);

//   // Verify OTP
//   const verifyOtp = async (data: FormData) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res: any = await postVerifySmsOtpApi({
//         otp: data.otp,
//         token,
//         login_type: "user",
//         vendor_id: vendorId,
//       });

//       if (res?.data?.user_id) {
//         localStorage.setItem("userId", res?.data?.user_id);

//         const cartResponse = await getCartApi(`user/${res?.data?.user_id}`);
//         localStorage.setItem("cartId", cartResponse?.data[0]?.id);

//         handleClose();
//         window.location.reload();
//       }
//     } catch {
//       setError("Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Sign in</h2>
//           <X className="cursor-pointer" onClick={handleClose} />
//         </div>

//         {/* Toggle Buttons */}
//         <div className="flex mt-4 mb-6 bg-gray-100 rounded-full overflow-hidden">
//           <button
//             onClick={() => {
//               reset();
//               setLoginMethod("mobile");
//               setOtpSent(false);
//             }}
//             className={`w-1/2 py-2 font-medium ${
//               loginMethod === "mobile" ? "bg-blue-600 text-white" : "text-gray-600"
//             }`}
//           >
//             Mobile Login
//           </button>
//              <button
//             onClick={() => {
//               reset();
//               setLoginMethod("email");
//               setOtpSent(false);
//             }}
//             className={`w-1/2 py-2 font-medium ${
//               loginMethod === "email" ? "bg-blue-600 text-white" : "text-gray-600"
//             }`}
//           >
//             Email Login
//           </button>
//         </div>

//         {/** ===================== EMAIL LOGIN ===================== */}
//         {loginMethod === "email" && (
//           <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-6">

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="email"
//                   {...register("email", { required: "Email is required" })}
//                   className="pl-10 w-full border rounded-md p-2"
//                 />
//               </div>
//               {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type={passwordShow ? "text" : "password"}
//                   {...register("password", { required: "Password is required" })}
//                   className="pl-10 pr-10 w-full border rounded-md p-2"
//                 />
//                 {passwordShow ? (
//                   <EyeOff
//                     className="absolute right-3 top-3 cursor-pointer"
//                     onClick={() => setPasswordShow(false)}
//                   />
//                 ) : (
//                   <Eye
//                     className="absolute right-3 top-3 cursor-pointer"
//                     onClick={() => setPasswordShow(true)}
//                   />
//                 )}
//               </div>
//               {errors.password && <p className="text-red-500">{errors.password.message}</p>}
//             </div>

//             {error && <p className="text-red-500 text-center">{error}</p>}

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center"
//             >
//               {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
//             </button>

//             <p className="text-center text-sm mt-2">
//               Don't have an account?{" "}
//               <Link to="/register" className="text-blue-600">Create one</Link>
//             </p>
//           </form>
//         )}

//         {/** ===================== MOBILE LOGIN ===================== */}
//         {loginMethod === "mobile" && (
//           <form
//             onSubmit={handleSubmit(otpSent ? verifyOtp : sendOtp)}
//             className="space-y-6"
//           >
//             {/* Mobile Field */}
//             {!otpSent && (
//               <div>
//                 <label className="block text-sm font-medium">Mobile Number</label>
//                 <div className="relative">
//                   <Smartphone className="absolute left-3 top-3 text-gray-400" />
//                   <input
//                     type="text"
//                     {...register("mobile", {
//                       required: "Mobile number is required",
//                       pattern: { value: /^[6-9]\d{9}$/, message: "Enter valid mobile number" },
//                     })}
//                     className="pl-10 w-full border rounded-md p-2"
//                   />
//                 </div>
//                 {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}
//               </div>
//             )}

//             {/* OTP Field */}
//             {otpSent && (
//               <div>
//                 <label className="block text-sm font-medium">Enter OTP</label>
//                 <div className="relative">
//                   <KeyRound className="absolute left-3 top-3 text-gray-400" />
//                   <input
//                     type="text"
//                     maxLength={6}
//                     {...register("otp", {
//                       required: "OTP is required",
//                       pattern: { value: /^\d{6}$/, message: "Enter 6-digit OTP" },
//                     })}
//                     className="pl-10 w-full border rounded-md p-2 text-center tracking-widest"
//                   />
//                 </div>

//                 <div className="flex justify-between text-sm mt-2">
//                   <button
//                     type="button"
//                     disabled={resendTimer > 0}
//                     onClick={() => sendOtp({ mobile: watch("mobile") })}
//                     className={`${resendTimer > 0 ? "text-gray-400" : "text-blue-600"}`}
//                   >
//                     {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setOtpSent(false);
//                       setValue("otp", "");
//                     }}
//                     className="text-red-500"
//                   >
//                     Change Number
//                   </button>
//                 </div>
//               </div>
//             )}

//             {error && <p className="text-red-500 text-center">{error}</p>}

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center"
//             >
//               {loading ? <Loader2 className="animate-spin" /> : otpSent ? "Verify OTP" : "Send OTP"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginModal;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Smartphone,
  KeyRound,
  X,
  Loader2,
} from "lucide-react";
import { getCartApi } from "../../api-endpoints/CartsApi";
import {
  postSendSmsOtpUserApi,
  postVerifySmsOtpApi,
} from "../../api-endpoints/authendication";
import ApiUrls from "../../api-endpoints/ApiUrls";

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
  vendorId: any;
}

interface FormData {
  email?: string;
  password?: string;
  mobile?: string;
  otp?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  open,
  handleClose,
  vendorId,
}) => {
  if (!open) return null;

  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("mobile");
  const [passwordShow, setPasswordShow] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [token, setToken] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
    clearErrors,
    setValue,
    reset,
  } = useForm<FormData>();

  // ===================== EMAIL VALIDATION =====================
  const handleEmailChange = (value: string) => {
    setValue("email", value);

    // EMAIL REGEX EXACT EXPECTED
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(value)) {
      setFormError("email", { message: "Enter valid email address" });
    } else {
      clearErrors("email");
    }
  };

  // ===================== MOBILE VALIDATION =====================
  const handleMobileChange = (value: string) => {
    const clean = value.replace(/\D/g, "");
    setValue("mobile", clean);

    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(clean)) {
      setFormError("mobile", { message: "Enter valid 10-digit mobile" });
    } else {
      clearErrors("mobile");
    }
  };

  // Handle email login
  const handleEmailLogin = async (data: FormData) => {
    setLoading(true);
    try {
      const response: any = await axios.post(ApiUrls?.userLogin, {
        ...data,
        vendor_id: vendorId,
      });

      if (response?.data?.user_id) {
        localStorage.setItem("userId", response.data.user_id);

        const cartResponse = await getCartApi(
          `user/${response.data.user_id}`
        );
        localStorage.setItem("cartId", cartResponse?.data[0]?.id);

        handleClose();
        window.location.reload();
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP API
  const sendOtp = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res: any = await postSendSmsOtpUserApi({
        contact_number: data.mobile,
        vendor_id: vendorId,
      });

      if (res?.data?.token) {
        setToken(res.data.token);
        setOtpSent(true);
        setResendTimer(60);
      }
    } catch {
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Countdown
  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Verify OTP
  const verifyOtp = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res: any = await postVerifySmsOtpApi({
        otp: data.otp,
        token,
        login_type: "user",
        vendor_id: vendorId,
      });

      if (res?.data?.user_id) {
        localStorage.setItem("userId", res?.data?.user_id);

        const cartResponse = await getCartApi(
          `user/${res?.data?.user_id}`
        );
        localStorage.setItem("cartId", cartResponse?.data[0]?.id);

        handleClose();
        window.location.reload();
      }
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Sign in</h2>
          <X className="cursor-pointer" onClick={handleClose} />
        </div>

        {/* Toggle Buttons */}
        <div className="flex mt-4 mb-6 bg-gray-100 rounded-full overflow-hidden">
          <button
            onClick={() => {
              reset();
              setLoginMethod("mobile");
              setOtpSent(false);
            }}
            className={`w-1/2 py-2 font-medium ${
              loginMethod === "mobile"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Mobile Login
          </button>

          <button
            onClick={() => {
              reset();
              setLoginMethod("email");
              setOtpSent(false);
            }}
            className={`w-1/2 py-2 font-medium ${
              loginMethod === "email"
                ? "bg-blue-600 text-white"
                : "text-gray-600"
            }`}
          >
            Email Login
          </button>
        </div>

        {/* ===================== EMAIL LOGIN ===================== */}
        {loginMethod === "email" && (
          <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`pl-10 w-full border rounded-md p-2 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={passwordShow ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="pl-10 pr-10 w-full border rounded-md p-2"
                />
                {passwordShow ? (
                  <EyeOff
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setPasswordShow(false)}
                  />
                ) : (
                  <Eye
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setPasswordShow(true)}
                  />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>

            <p className="text-center text-sm mt-2">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600">
                Create one
              </Link>
            </p>
          </form>
        )}

        {/* ===================== MOBILE LOGIN ===================== */}
        {loginMethod === "mobile" && (
          <form
            onSubmit={handleSubmit(otpSent ? verifyOtp : sendOtp)}
            className="space-y-6"
          >
            {/* Mobile Field */}
            {!otpSent && (
              <div>
                <label className="block text-sm font-medium">
                  Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    maxLength={10}
                    onChange={(e) => handleMobileChange(e.target.value)}
                    className={`pl-10 w-full border rounded-md p-2 ${
                      errors.mobile ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-500">{errors.mobile.message}</p>
                )}
              </div>
            )}

            {/* OTP Field */}
            {otpSent && (
              <div>
                <label className="block text-sm font-medium">Enter OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    maxLength={6}
                    {...register("otp", {
                      required: "OTP is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Enter 6-digit OTP",
                      },
                    })}
                    className="pl-10 w-full border rounded-md p-2 text-center tracking-widest"
                  />
                </div>

                <div className="flex justify-between text-sm mt-2">
                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={() => sendOtp({ mobile: watch("mobile") })}
                    className={`${
                      resendTimer > 0 ? "text-gray-400" : "text-blue-600"
                    }`}
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setValue("otp", "");
                    }}
                    className="text-red-500"
                  >
                    Change Number
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md flex justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : otpSent ? (
                "Verify OTP"
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

