import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCartitemsApi } from '../api-endpoints/CartsApi';
import { useUser } from '../context/UserContext';
import Icon from '../assets/image/icon.jpg'
// import OmLogo from '../assets/image/logo_wobg.png'
interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Navbar({
  // cartItemCount
  onCartClick }: NavbarProps) {
  const [isSticky, setIsSticky] = useState(false);

  // const userName: any = localStorage.getItem('userName');
  const getCartId = localStorage.getItem('cartId');

  const { user }: any = useUser();
  // console.log(user?.data?.id)
  const getCartitemsData = useQuery({
    queryKey: ['getCartitemsData', getCartId],
    queryFn: () => getCartitemsApi(`/${getCartId}`),
    enabled: !!getCartId,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // <nav className={`${isSticky ? 'fixed top-0 left-0 shadow-lg z-20' : 'relative'} bg-white w-full z-10 transition-all duration-300`}>
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     <div className="flex justify-between h-16 items-center">
    //       <Link to="/" className="flex-shrink-0 flex">
    //         <img className="h-16 w-16" src={Icon} />
    //         <span className='m-4 text-2xl font-bold'>Tapang Thalaivare</span>
    //         {/* <h1 className="text-xl font-bold text-gray-800">SimpleShop</h1> */}
    //       </Link>

    //       <div className="flex items-center gap-4">
    //         <Link
    //           to={user?.data?.id ? "/profile" : "/login"}
    //           className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
    //         >
    //           <User className="h-5 w-5" />
    //           <span>{user?.data?.id ? user?.data?.name?.split(" ")[0] || "user" : "Sign in"}</span>
    //         </Link>

    //         <button
    //           onClick={onCartClick}
    //           className="relative p-2 text-gray-600 hover:text-gray-900"
    //         >
    //           <ShoppingCart className="h-6 w-6" />
    //           {getCartitemsData?.data?.data?.length > 0 && (
    //             <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
    //               {getCartitemsData?.data?.data?.length}
    //             </span>
    //           )}
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </nav>

    // <nav
    //   className={`${isSticky
    //     ? 'fixed top-0 left-0 shadow-lg z-20'
    //     : 'relative'
    //     } bg-white w-full z-10 transition-all duration-300`}
    // >
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-5">
    //     <div className="flex justify-between items-center h-16 w-full mt-0.5">

    //       {/* Logo + Title */}
    //       <Link
    //         to="/"
    //         className="flex items-center justify-center gap-3 flex-shrink-0"
    //       >
    //         <img
    //           className="h-14 w-14 object-contain"
    //           src={Icon}
    //           alt="Logo"
    //         />

    //         <span
    //           className="text-base md:text-xl font-bold leading-tight tracking-wide font-serif text-center"
    //         >
    //           Tapang <br /> Thalaivare
    //         </span>
    //       </Link>


    //       {/* Profile + Cart */}
    //       <div className="flex items-center gap-5">
    //         <Link
    //           to={user?.data?.id ? "/profile" : "/login"}
    //           className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900"
    //         >
    //           <User className="h-5 w-5" />
    //           {/* <span>{user?.data?.name?.trim()?.split(" ")[0] || "User"}</span> */}
    //         </Link>

    //         <button
    //           onClick={onCartClick}
    //           className="relative p-2 text-gray-600 hover:text-gray-900"
    //         >
    //           <ShoppingCart className="h-6 w-6" />
    //           {getCartitemsData?.data?.data?.length > 0 && (
    //             <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
    //               {getCartitemsData?.data?.data?.length}
    //             </span>
    //           )}
    //         </button>
    //       </div>

    //     </div>
    //   </div>
    // </nav>

    <nav
      className={`${isSticky
        ? 'fixed top-0 left-0 shadow-lg z-20'
        : 'relative'
        } bg-white w-full z-10 transition-all duration-300`}
    >
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          {/* Logo + Text */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              className="h-14 w-14 object-contain"
              src={Icon}
              alt="Logo"
            />

            <span className="text-base md:text-xl font-bold leading-tight tracking-wide  text-center">
              Tapang <br /> Thalaivare
            </span>
          </Link>

          {/* Profile + Cart */}
          <div className="flex items-center gap-5">
            <Link
              to={user?.data?.id ? "/profile" : "/login"}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartitemsData?.data?.data?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                  {getCartitemsData?.data?.data?.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>

  );
}


// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ShoppingCart, User, Menu, X } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { getCartitemsApi } from "../api-endpoints/CartsApi";
// import { useUser } from "../context/UserContext";
// import Icon from "../assets/image/icon.jpg";

// interface NavbarProps {
//   onCartClick: () => void;
// }

// export function Navbar({ onCartClick }: NavbarProps) {
//   const [isSticky, setIsSticky] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const getCartId = localStorage.getItem("cartId");
//   const { user }: any = useUser();

//   const getCartitemsData = useQuery({
//     queryKey: ["getCartitemsData", getCartId],
//     queryFn: () => getCartitemsApi(`/${getCartId}`),
//     enabled: !!getCartId,
//   });

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsSticky(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <>
//       <nav
//         className={`${
//           isSticky ? "fixed top-0 left-0 shadow-lg" : "relative"
//         } bg-white w-full z-20 transition-all duration-300`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">

//             {/* Logo */}
//             <Link to="/" className="flex items-center gap-2">
//               <img className="h-14 w-14" src={Icon} alt="Logo" />
//               <span className="text-2xl font-bold">Tapang Thalaivare</span>
//             </Link>

//             {/* Desktop Menu */}
//             <div className="hidden md:flex items-center gap-4">
//               <Link
//                 to={user?.data?.id ? "/profile" : "/login"}
//                 className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
//               >
//                 <User className="h-5 w-5" />
//                 <span>{user?.data?.id ? user?.data?.name?.split(" ")[0] || "user" : "Sign in"}</span>
//               </Link>

//               <button
//                 onClick={onCartClick}
//                 className="relative p-2 text-gray-600 hover:text-gray-900"
//               >
//                 <ShoppingCart className="h-6 w-6" />
//                 {getCartitemsData?.data?.data?.length > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
//                     {getCartitemsData?.data?.data?.length}
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* Mobile Menu Icon */}
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="md:hidden p-2 text-gray-700"
//             >
//               <Menu className="h-8 w-8" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ${
//           isSidebarOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex justify-between items-center p-4 border-b">
//           <h3 className="text-lg font-bold">Menu</h3>
//           <button onClick={() => setIsSidebarOpen(false)}>
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <div className="flex flex-col p-4 gap-4 text-gray-700">
//           <Link
//             to="/"
//             onClick={() => setIsSidebarOpen(false)}
//             className="hover:text-blue-600"
//           >
//             Home
//           </Link>

//           <Link
//             to={user?.data?.id ? "/profile" : "/login"}
//             onClick={() => setIsSidebarOpen(false)}
//             className="hover:text-blue-600 flex items-center gap-2"
//           >
//             <User />
//             {user?.data?.id ? "Profile" : "Login"}
//           </Link>

//           <div
//             onClick={() => {
//               onCartClick();
//               setIsSidebarOpen(false);
//             }}
//             className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
//           >
//             <ShoppingCart />
//             <span>Cart</span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
