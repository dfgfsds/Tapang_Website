"use client";

import { useCategories } from '@/context/CategoriesContext';
import { Leaf, Flower, Home, Utensils, Heart } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesPage() {
  const icons = {
    'Fruit': Leaf,
    'Flower': Flower,
    'Home': Home,
    'Utensils': Utensils,
    'Leaf': Leaf,
    'Heart': Heart
  };

  const { isAuthenticated, isLoading, categories }: any = useCategories();

  return (
    <div className="bg-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Shop by Category</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse stylish looks across all your favorite fashion categories.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories?.data?.map((category:any) => {
            const IconComponent = icons[category.icon as keyof typeof icons] || Leaf;
            
            return (
              <Link 
                href={`/categories/${category?.slug_name}`} 
                key={category?.id}
                className="group relative overflow-hidden rounded-xl bg-[#F8F7F2] transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img 
                  src={category?.image || "https://semantic-ui.com/images/wireframe/image.png"}
                  alt={category?.name || "Category"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 transition-opacity group-hover:opacity-80" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">

                  <h3 className="text-2xl font-bold mb-2 text-blue-700 capitalize">{category?.name}</h3>
                  <p className="text-blue-700">{category?.description}</p>
                </div>
              </Link>
            );
          })}
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories?.data?.map((category: any) => (
            <Link
              href={`/categories/${category?.slug_name}`}
              key={category?.id}
              className="group relative overflow-hidden rounded-xl bg-[#F8F7F2] transition-all duration-300 hover:shadow-xl"
            >
              {/* Image */}
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img
                  src={category?.image || "https://semantic-ui.com/images/wireframe/image.png"}
                  alt={category?.name || "Category"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* STRONG GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

              {/* TEXT */}
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 className="text-2xl font-bold text-white capitalize drop-shadow-lg">
                  {category?.name}
                </h3>
                {category?.description && (
                  <p className="mt-1 text-sm text-white/90 line-clamp-2 drop-shadow">
                    {category?.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}