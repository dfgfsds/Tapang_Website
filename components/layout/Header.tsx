"use client";
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, User, LogOut, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileMenu from './MobileMenu';
import logo from '../../public/img/logo.png';
import { useEffect, useState } from 'react';
import { useCartItem } from '@/context/CartItemContext';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function Header() {
  const [getUserId, setUserId] = useState<string | null>(null);
  const { cartItem }: any = useCartItem();
  const pathname = usePathname();
  const router = useRouter();
  const { user }: any = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    router.push('/auth/login');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };


  const isLoggedIn = Boolean(user?.data?.id);

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">

            {/* LEFT : LOGO + NAV */}
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center">
                <Image
                  src={logo}
                  height={60}
                  width={60}
                  alt="Shany Fashion logo"
                  className="object-contain"
                />
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/products', label: 'Shop' },
                  { href: '/categories', label: 'Categories' },
                  { href: '/about', label: 'About Us' },
                  // { href: '/blog', label: 'Blogs' },
                  { href: '/contact', label: 'Contact' },
                ].map(({ href, label }) => {
                  const isActive =
                    pathname === href ||
                    (href !== '/' && pathname.startsWith(href));

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`
                  text-sm font-medium transition-colors
                  ${isActive
                          ? 'text-blue-700 font-semibold'
                          : 'text-gray-700 hover:text-blue-500'
                        }
                `}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* RIGHT : CART + USER */}
            <div className="flex items-center gap-4">

              {/* CART */}
              <Link href={getUserId ? '/cart' : '/auth/login'}>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItem?.data?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-700 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                      {cartItem.data.length}
                    </span>
                  )}
                </Button>
              </Link>

              {/* USER */}
              <Link
                href={isLoggedIn ? '/profile' : '/auth/login'}
                className={`
             sm:flex items-center gap-2 text-sm font-medium
            ${pathname === '/profile'
                    ? 'text-blue-700 font-semibold'
                    : 'text-gray-700 hover:text-blue-500'
                  }
          `}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-gray-200"
                >
                  <User className="h-5 w-5" />
                </Button>
                {isLoggedIn && <span>{user?.data?.name}</span>}
              </Link>

              {/* LOGOUT */}
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLogoutModal(true)}
                  className="
              hidden lg:flex
              items-center gap-1
              text-blue-700
              hover:bg-blue-700 hover:text-white
              transition-all duration-200
            "
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}

              {/* MOBILE MENU */}
              <div className="md:hidden">
                <MobileMenu />
              </div>

            </div>
          </div>
        </div>
      </header>


      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6 text-center relative">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Logout
            </h2>
            <p className="text-gray-500 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setShowLogoutModal(false)}
                variant="outline"
                className="px-5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5"
              >
                Yes, Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
