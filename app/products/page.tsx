'use client';

import { useState, useEffect } from 'react';
import { Product, ProductAPI, PaginatedResponse, SearchParams } from '@/lib/api';
import { ProductTable } from '@/components/admin/product-table';
import { ProductSearch } from '@/components/products/product-search';
import { DeleteProductDialog } from '@/components/products/delete-product-dialog';
import { ProductForm } from '@/components/products/product-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page: number = 1, searchParams?: SearchParams) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (searchParams && Object.keys(searchParams).length > 0) {
        response = await ProductAPI.searchProducts({ ...searchParams, page, pageSize: 5 });
        setIsSearching(true);
      } else {
        response = await ProductAPI.getProducts(page, 5);
        setIsSearching(false);
      }

      if (response.success) {
        const paginatedData = response.data as PaginatedResponse<Product>;
        setProducts(paginatedData.data);
        setCurrentPage(paginatedData.currentPage);
        setTotalPages(paginatedData.totalPages);
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      const response = await ProductAPI.deleteProduct(id);
      if (response.success) {
        setShowDeleteDialog(false);
        setProductToDelete(null);
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
    await fetchProducts(currentPage, isSearching ? searchParams : undefined);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
      {/* Header */}
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

      {/* Search */}
      <ProductSearch onSearch={handleSearch} loading={loading} showAdvanced />

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-none">
          {error}
        </div>
      )}

      {/* Product Table */}
      <ProductTable
        data={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(id) => {
          const product = products.find(p => p.id === id);
          if (product) handleDelete(product);
          }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />


      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Dialog */}
      <DeleteProductDialog
        product={productToDelete}
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
