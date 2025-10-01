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

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async (productId: string) => {
    try {
      const response = await ProductAPI.deleteProduct(productId);
      if (response.success) {
        // Close dialog first
        setShowDeleteDialog(false);
        // Navigate to products page (reset to page 1)
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
    // Refresh the product data
    const response = await ProductAPI.getProductById(productId);
    if (response.success) {
      setProduct(response.data);
    }
  };



  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
            <Skeleton className="h-6 w-32 sm:h-8 sm:w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <Skeleton className="h-64 sm:h-80 lg:h-96 w-full" />
            <div className="space-y-3 sm:space-y-4">
              <Skeleton className="h-6 sm:h-8 w-3/4" />
              <Skeleton className="h-4 sm:h-6 w-1/2" />
              <Skeleton className="h-24 sm:h-32 w-full" />
              <Skeleton className="h-8 sm:h-10 w-20 sm:w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="text-center py-8 sm:py-12">
          <h1 className="text-xl sm:text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">{error || 'Product not found'}</p>
          <Button onClick={() => router.push('/')} className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      width={600}
                      height={800}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <p className="text-lg">Không có hình ảnh</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Product Title */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex-1">{product.name}</h1>
                </div>
                
                <div className="text-xs sm:text-sm text-gray-500">
                  SKU: {product.id}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-2xl sm:text-3xl font-bold text-green-600">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </span>
                </div>
              </div>


              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Nội dung</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
              </div>


              {/* Admin Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(true)}
                  className="flex items-center justify-center gap-2 px-3 text-blue-600 border-blue-600 hover:bg-blue-50 w-full sm:w-auto"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Chỉnh sửa
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeleteClick}
                  className="flex items-center justify-center gap-2 px-3 text-red-600 border-red-600 hover:bg-red-50 w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa sản phẩm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={product}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteProductDialog
        product={product}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
