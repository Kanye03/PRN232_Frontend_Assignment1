'use client';

import { useState, useEffect } from 'react';
import { Product, ProductAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSubmit: () => void;
}

export function ProductForm({ product, onClose, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
      });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageFile: imageFile || undefined,
      };

      let response;
      if (isEditing && product) {
        response = await ProductAPI.updateProduct({
          ...productData,
          id: product.id,
        });
      } else {
        response = await ProductAPI.createProduct(productData);
      }

      if (response.success) {
        toast.success(isEditing ? 'Sản phẩm đã được cập nhật thành công!' : 'Sản phẩm đã được tạo thành công!');
        onSubmit();
      } else {
        setError(response.message || 'Failed to save product');
        toast.error(response.message || 'Có lỗi xảy ra khi lưu sản phẩm');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error('Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-6">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {isEditing ? 'Update product information' : 'Fill in the product details'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="px-3 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 sm:px-4 py-2 sm:py-3 rounded-none text-sm sm:text-base">
                {error}
              </div>
            )}

            {/* Product Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs sm:text-sm font-medium">
                Product Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
                minLength={2}
                maxLength={100}
                className="text-sm sm:text-base"
              />
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-xs sm:text-sm font-medium">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                required
                minLength={10}
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              />
            </div>

            {/* Product Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-xs sm:text-sm font-medium">
                Price *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                className="text-sm sm:text-base"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label htmlFor="image" className="text-xs sm:text-sm font-medium">
                Product Image
              </label>
              <div className="space-y-3 sm:space-y-4">
                {/* File Input */}
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image"
                    className={`flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isDragOver 
                        ? 'border-blue-500 bg-blue-50' 
                        : imageFile 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center pt-3 pb-4 sm:pt-5 sm:pb-6">
                      {imageFile ? (
                        <>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-green-600 flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-green-700 font-medium truncate max-w-full px-2">
                            ✓ {imageFile.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : isEditing && product?.image ? (
                        <>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-blue-600 flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-blue-700 font-medium text-center px-2">
                            📷 Ảnh hiện tại đang được sử dụng
                          </p>
                          <p className="text-xs text-blue-600 text-center px-2">
                            Chọn ảnh mới để thay thế
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4 text-gray-500" />
                          <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-500 text-center px-2">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 text-center px-2">PNG, JPG or GIF (MAX. 10MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto text-sm sm:text-base">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
