'use client';

import { useState, useEffect } from 'react';
import { Product, ProductAPI, PaginatedResponse, SearchParams } from '@/lib/api';
import { ProductCard } from './product-card';
import { ProductSearch } from './product-search';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { ProductForm } from './product-form';

interface ProductGridProps {
  showActions?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  showSearch?: boolean;
}

export function ProductGrid({ showActions = false, onEdit, onDelete, showSearch = true }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [isSearching, setIsSearching] = useState(false);

  const fetchProducts = async (page = 1, params?: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      let response;

      if (params && Object.keys(params).length > 0) {
        response = await ProductAPI.searchProducts({ ...params, page, pageSize: 5 });
        setIsSearching(true);
      } else {
        response = await ProductAPI.getProducts(page, 5);
        setIsSearching(false);
      }

      if (response.success) {
        const data = response.data as PaginatedResponse<Product>;
        setProducts(data.data);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await ProductAPI.deleteProduct(id);
      if (response.success) {
        await fetchProducts(currentPage, isSearching ? searchParams : undefined);
      } else {
        setError(response.message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingProduct(null);
    await fetchProducts(currentPage);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setCurrentPage(1);
    fetchProducts(1, params);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page, isSearching ? searchParams : undefined);
  };

  return (
    <div className="space-y-6">
      {loading && products.length === 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 sm:h-10 w-48" />
            {showActions && <Skeleton className="h-8 sm:h-10 w-24 sm:w-32" />}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2 sm:space-y-3">
                <Skeleton className="h-32 sm:h-40 md:h-48 w-full rounded-lg" />
                <Skeleton className="h-3 sm:h-4 w-3/4 rounded" />
                <Skeleton className="h-2 sm:h-3 w-1/2 rounded" />
                <Skeleton className="h-6 sm:h-8 w-16 sm:w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          {showActions && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Quản lý danh sách sản phẩm trong hệ thống</p>
              </div>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Thêm sản phẩm</span>
                <span className="sm:hidden">Thêm</span>
              </Button>
            </div>
          )}

          {/* Search */}
          {showSearch && <ProductSearch onSearch={handleSearch} loading={loading} showAdvanced={true} />}

          {/* Error */}
          {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">{error}</div>}

          {/* Empty state */}
          {products.length === 0 && !loading ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-muted-foreground text-base sm:text-lg">Không có sản phẩm</p>
              {showActions && (
                <Button onClick={() => setShowForm(true)} className="mt-4 w-full sm:w-auto">Thêm sản phẩm</Button>
              )}
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showActions={showActions}
                    clickable={!showActions}
                    onEdit={onEdit || handleEdit}
                    onDelete={onDelete || handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button variant="outline" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-4 py-2">Trước</Button>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">Trang {currentPage} / {totalPages}</span>
                  <Button variant="outline" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-4 py-2">Sau</Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
