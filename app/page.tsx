import { ProductGrid } from '@/components/products/product-grid';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Cửa hàng</h1>
          <p className="text-sm sm:text-base text-gray-600">Khám phá các sản phẩm tuyệt vời</p>
        </div>
        <ProductGrid showActions={false} showSearch={true} />
      </div>
    </div>
  );
}