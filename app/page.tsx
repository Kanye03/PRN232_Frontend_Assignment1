import { ProductGrid } from '@/components/products/product-grid';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">Chào mừng đến cửa hàng</h1>
        <p className="text-gray-700">Khám phá những sản phẩm tốt nhất của chúng tôi</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl shadow-inner">
        <ProductGrid showActions={false} showSearch />
      </div>
    </div>
  );
}
