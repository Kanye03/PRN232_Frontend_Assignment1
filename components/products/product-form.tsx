'use client';

import { useState, useEffect } from 'react';
import { Product, ProductAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSubmit: () => void;
}

export function ProductForm({ product, onClose, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({ name: product.name, description: product.description, price: product.price.toString() });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) setImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) setImageFile(file);
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

      const response = isEditing && product
        ? await ProductAPI.updateProduct({ ...productData, id: product.id })
        : await ProductAPI.createProduct(productData);

      if (response.success) {
        toast.success(isEditing ? 'Cập nhật sản phẩm thành công!' : 'Tạo sản phẩm thành công!');
        onSubmit();
      } else {
        setError(response.message || 'Failed to save product');
        toast.error(response.message || 'Có lỗi xảy ra khi lưu sản phẩm');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Có lỗi xảy ra khi lưu sản phẩm');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-lg border border-orange-200 bg-orange-50 shadow-md">
        <CardHeader className="flex justify-between items-center pb-3 sm:pb-6">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl text-orange-700">
              {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              {isEditing ? 'Cập nhật thông tin sản phẩm' : 'Điền đầy đủ thông tin sản phẩm'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4 text-orange-700" /></Button>
        </CardHeader>

        <CardContent className="px-3 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-xs sm:text-sm font-medium text-orange-700">Tên sản phẩm *</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên sản phẩm"
                required
                minLength={2}
                maxLength={100}
                className="text-sm sm:text-base border-blue-200 focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-xs sm:text-sm font-medium text-orange-700">Mô tả *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả sản phẩm"
                required
                minLength={10}
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="text-xs sm:text-sm font-medium text-orange-700">Giá *</label>
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
                className="text-sm sm:text-base border-blue-200 focus:ring-blue-300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-xs sm:text-sm font-medium text-orange-700">Ảnh sản phẩm</label>
              <label
                htmlFor="image"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${isDragOver ? 'border-blue-300 bg-blue-50' : imageFile || (isEditing && product?.image) ? 'border-blue-300 bg-blue-50' : 'border-blue-200 bg-white hover:bg-blue-50'}`}
              >
                {imageFile ? (
                  <p className="text-blue-600 font-medium text-sm sm:text-base truncate">✓ {imageFile.name}</p>
                ) : isEditing && product?.image ? (
                  <p className="text-blue-600 font-medium text-sm sm:text-base text-center">📷 Ảnh hiện tại đang được sử dụng</p>
                ) : (
                  <>
                    <Upload className="w-6 h-6 sm:w-8 mb-1 text-blue-400"/>
                    <p className="text-xs sm:text-sm text-gray-500 text-center">Click hoặc kéo thả ảnh (PNG, JPG, GIF, max 10MB)</p>
                  </>
                )}
                <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto border-blue-300 text-blue-600 hover:bg-blue-50 text-sm sm:text-base">Hủy</Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base">
                {loading ? 'Đang lưu...' : isEditing ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
