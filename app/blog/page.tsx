"use client";
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getBlogsApi } from '@/api-endpoints/authendication';
import { useVendor } from '@/context/VendorContext';
import EmptyImage from '../../public/img/emptyImage.jpg';
export default function BlogPage() {
  const { vendorId } = useVendor();

  const getBlogsData: any = useQuery({
    queryKey: ['getBlogsData', vendorId],
    queryFn: () => getBlogsApi(`?vendor_id=${vendorId}`)
  })


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/5748679/pexels-photo-5748679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Blog
            </h1>
            {/* <p className="text-xl text-white/90">
              Insights on sustainable living and eco-friendly practices
            </p> */}
            <p className="text-xl text-white/90">
              Discover thoughtful gifting ideas, trends, and inspirations to make every occasion memorable with Shany Fashion.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getBlogsData?.data?.data?.blogs?.map((post: any) => (
            <Link
              key={post?.id}
              href={`/blog/${post?.id}`}
              className="group block bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={post?.banner_url ? post?.banner_url : EmptyImage}
                  alt={post?.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-[#B69339]">
                    {post?.title}

                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post?.created_at)}
                  </span>
                </div>

                <h2 className="text-xl font-semibold mb-2 group-hover:text-[#B69339] transition-colors">
                  {post?.subtitle}

                </h2>

                <p className="text-muted-foreground mb-4">
                  {post?.content
                    ? `${post.content.replace(/<[^>]+>/g, '').slice(0, 70)}...`
                    : ''}
                </p>

                <div className="flex items-center">
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2 "
                    alt={post?.author}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <span className="text-sm font-medium">
                    {post?.author}
                  </span>
                </div>
                {/* <div className="flex items-center mt-4">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${post?.author || "A"}`}
                    alt={post?.author}
                    className="w-6 h-6 rounded-full mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">{post?.author}</span>
                </div> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}