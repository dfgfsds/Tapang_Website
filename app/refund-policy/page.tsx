"use client";
import { usePolicy } from "@/context/PolicyContext";

function RefundPolicy() {
  const { policy, isLoading }: any = usePolicy();

  if (isLoading) {

    return (
      <div className="bg-white p-5 shadow-md rounded-lg lg:p-20 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>

        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4"></div>
        </div>
      </div>
    );
  }

  function injectPlaceholders(content: string, replacements: Record<string, string>) {
    let updated = content;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      const regex = new RegExp(placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi'); // escape special characters
      updated = updated.replace(regex, value);
    });
    return updated;
  }

  const companyData = {
    "[Insert Date]":"10 June 2025",
    "FT Digital Computer": "Brilliant Memory Computers",
    "[your email address]": "Info@brilliantmemorycomputers.in",
    "[your phone number]": "+91-7788996684",
    "[your business address]": "Shop No 2, GF 1/L, Blackers Road Gaiety Palace, Anna Salai, Chennai – 600002 (Near Casino Theatre, Next to Ola Electric Store)",
  };

  const htmlContent = injectPlaceholders(
    policy?.data?.refund_and_cancellation_policy || "",
    companyData
  );


  return (
    <div className="bg-white p-5 lg:p-20 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Refund Policy</h1>
      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

export default RefundPolicy;