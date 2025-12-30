import { SizeSelector } from "./SizeSelector";

interface VariantSelectorProps {
  variants: any[];
  selectedVariantId: any;
  onSelect: (variant: any) => void;
  sizekey: any;
  selectedSizeId: any;
  onSelectSize: (size: any) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
  sizekey,
  selectedSizeId,
  onSelectSize
}: VariantSelectorProps) {
  const emptyImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE=';

  // Find the selected variant to pass its sizes to SizeSelector
  const selectedVariant = variants?.find((variant) => variant.id === selectedVariantId?.id);
  console.log(variants)
  return (
    <div className="space-y-3">

      {variants?.length > 0 && (
        <>
          {/* <label className="block text-sm font-medium text-gray-700">variants</label> */}
          <span className="flex gap-4 flex-wrap">
            {variants?.filter((item: any) => item?.product_variant_status === true)?.map((variant) => (
              <div
                key={variant?.id}
                className="flex flex-col items-center gap-1"
              >
                <button
                  onClick={() => {
                    onSelect(variant);
                    sizekey('');
                  }}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
          ${selectedVariantId?.id === variant?.id
                      ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <img
                    src={
                      variant?.product_variant_image_urls?.[0] || emptyImage
                    }
                    alt={variant?.product_variant_title}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* ✅ TITLE */}
                <span
                  className={`text-xs font-medium text-center capitalize
          ${selectedVariantId?.id === variant?.id
                      ? 'text-blue-600'
                      : 'text-gray-700'
                    }`}
                >
                  {variant?.product_variant_title}
                </span>
              </div>
            ))}
          </span>

        </>
      )}
      <SizeSelector
        sizes={selectedVariant?.sizes || []}
        selectedSizeId={selectedSizeId}
        onSelect={onSelectSize}
      />
    </div>
  );
}