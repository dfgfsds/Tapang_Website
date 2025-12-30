interface SizeSelectorProps {
  sizes: any[];
  selectedSizeId: any;
  onSelect: (size: any) => void;
}

export function SizeSelector({ sizes, selectedSizeId, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      {sizes?.length > 0 && (
        <label className="text-lg font-bold text-black">Sizes</label>
      )}

      <div className="flex flex-wrap gap-2">
        {sizes?.filter((item: any) => item?.product_size_status === true)?.map((size) => {
          const isOutOfStock = Number(size?.product_size_stock_quantity) === 0;

          return (
            <button
              key={size?.id}
              onClick={() => onSelect(size)}
              // disabled={isOutOfStock}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all
                ${selectedSizeId?.id === size?.id
                  ? "bg-gray-900 text-white"
                  : isOutOfStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              {size?.product_size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
