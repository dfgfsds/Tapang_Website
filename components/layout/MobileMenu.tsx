"use client"

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // 👈 ADD
  const { user }: any = useUser();
  const isLoggedIn = Boolean(user?.data?.id);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="text-xl font-bold">
              <span className="text-[#B69339]">Shany </span>
              <span className="text-[#B69339]">Fashion</span>
            </span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col mt-8 space-y-4">
          <MobileLink href="/" setOpen={setOpen}>Home</MobileLink>
          <MobileLink href="/products" setOpen={setOpen}>Shop</MobileLink>
          <MobileLink href="/categories" setOpen={setOpen}>Categories</MobileLink>
          <MobileLink href="/about" setOpen={setOpen}>About Us</MobileLink>
          <MobileLink href="/contact" setOpen={setOpen}>Contact</MobileLink>
          <MobileLink href="/blog" setOpen={setOpen}>Blog</MobileLink>

          {isLoggedIn && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLogout()}
              className="
      flex items-center gap-2
      text-white
      bg-red-600
      hover:bg-red-500 hover:text-white
      transition-all duration-200
      px-3 py-2
      rounded-md
    "
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MobileLink({
  href,
  children,
  setOpen
}: {
  href: string;
  children: React.ReactNode;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="block py-2 text-lg font-medium hover:text-[#B69339] transition-colors"
    >
      {children}
    </Link>
  );
}
