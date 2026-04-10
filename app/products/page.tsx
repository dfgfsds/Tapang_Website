"use client";

import { Suspense, useState, useMemo, useRef } from 'react';
import ProductsGrid from '@/components/products/ProductsGrid';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsSidebar from '@/components/products/ProductsSidebar';
import ProductsLoading from '@/components/products/ProductsLoading';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import { Pagination } from '@/components/Pagination';
import Image from 'next/image';
import emptyBox from '../../public/img/empty-box.png';

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const { cartItem }: any = useCartItem();
  const { products, isAuthenticated, isLoading }: any = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  // 🧠 Cache last valid results to prevent flash during hydration/loading
  const lastValidData = useRef<any>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const finalQuery = (e.target as HTMLInputElement).value.trim();
      setSearchQuery(finalQuery);
      setCurrentPage(1);
    }
  };

  // 🔍 Calculate filtered and sorted products
  const { sortedProducts, totalProducts } = useMemo(() => {
    const rawData = products?.data || lastValidData.current?.data || [];
    
    const filtered = rawData.filter((item: any) => {
      return (
        (!selectedCategory || item?.category === selectedCategory) &&
        (!searchQuery || item?.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });

    const sorted = [...filtered].sort((a: any, b: any) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      return 0;
    });

    if (products?.data) {
      lastValidData.current = products;
    }

    return { 
      sortedProducts: sorted, 
      totalProducts: sorted.length 
    };
  }, [products, selectedCategory, searchQuery, sortOption]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const paginatedItems = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const matchingProductsArray = useMemo(() => {
    return paginatedItems.map((product: any, index: number) => {
      const matchingCartItem = cartItem?.data?.find(
        (item: any) => item?.product === product?.id
      );

      if (matchingCartItem) {
        return {
          ...product,
          Aid: index,
          cartQty: matchingCartItem?.quantity,
          cartId: matchingCartItem.id,
        };
      }
      return product;
    });
  }, [paginatedItems, cartItem]);

  // Determine when to show the "Not Found" state
  const showNotFound = !isLoading && totalProducts === 0 && (products?.data || lastValidData.current);

  return (
    <div className="bg-blue-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-muted-foreground">
            Explore all our latest styles and wardrobe essentials in one place.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4">
            <ProductsSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={(cat: string) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="w-full lg:w-3/4">
            <ProductsHeader 
              value={searchQuery} 
              onChange={handleSearch} 
              onKeyDown={handleSearchKeyDown}
              sortOption={sortOption}
              setSortOption={(opt: string) => {
                setSortOption(opt);
                setCurrentPage(1);
              }}
            />

            {totalProducts > 0 || isLoading ? (
              <div style={{ minHeight: '600px' }}>
                <Suspense fallback={<ProductsLoading />}>
                  <ProductsGrid products={matchingProductsArray} isLoading={isLoading && totalProducts === 0} />
                </Suspense>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            ) : showNotFound ? (
              <div className="py-12 flex flex-col items-center">
                <Image
                  src={emptyBox ?? "https://semantic-ui.com/images/wireframe/image.png"}
                  alt="Empty"
                  className='size-24 opacity-50 mb-4'
                  width={96}
                  height={96}
                />
                <div className='text-center text-gray-500 font-medium'>No products found. Try adjusting your search or filters.</div>
              </div>
            ) : (
                <ProductsLoading />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}