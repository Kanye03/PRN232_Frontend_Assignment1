'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, ProductAPI } from '@/lib/api';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { ProductForm } from '@/components/products/product-form';
import { DeleteProductDialog } from '@/components/products/delete-product-dialog';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const productId = params.id as string;

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ProductAPI.getProductById(productId);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError(response.message || 'Product not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleDeleteConfirm = async (id: string) => {
    try {
      const response = await ProductAPI.deleteProduct(id);
      if (response.success) {
        setShowDeleteDialog(false);
        router.push('/products');
      } else {
        setError(response.message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    // Refresh product data
    if (!productId) return;
    const response = await ProductAPI.getProductById(productId);
    if (response.success) setProduct(response.data);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 sm:h-80 lg:h-96 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    );
  }

  // Error / Not found
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-destructive mb-4">Error</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">{error || 'Product not found'}</p>
        <Button onClick={() => router.push('/products')} className="w-full sm:w-auto flex items-center gap-2 justify-center">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Back Button */}
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </Button>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Image */}
          <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shadow">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={800}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <div className="w-full h-80 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="text-6xl mb-2">📚</div>
                <span>Không có hình ảnh</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{product.name}</h1>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">SKU: {product.id}</div>

            {/* Price */}
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-1">Nội dung</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                <Edit className="h-4 w-4" /> Chỉnh sửa
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" /> Xóa sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showForm && <ProductForm product={product} onClose={() => setShowForm(false)} onSubmit={handleFormSubmit} />}
      <DeleteProductDialog
        product={product}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
