'use client';

import { useState } from 'react';
import { Product } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string) => Promise<void>;
}

export function DeleteProductDialog({ product, isOpen, onClose, onConfirm }: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    if (!isDeleting) {
      setIsDeleting(false);
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!product || isDeleting) return;
    try {
      setIsDeleting(true);
      await onConfirm(product.id);
      toast.success('Sản phẩm đã được xóa thành công!');
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
      setIsDeleting(false);
    }
  };

  if (!product) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-md rounded-lg shadow-lg border border-gray-200">
        <AlertDialogHeader className="flex items-center gap-3 pb-2 border-b border-gray-200">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-lg font-semibold text-gray-900">
            Xóa sản phẩm
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="py-4 text-gray-700 space-y-2">
          <p>
            Bạn có chắc chắn muốn xóa sản phẩm <strong>{product.name}</strong> không?
          </p>
          <p className="text-sm text-gray-500">
            Hành động này không thể hoàn tác và sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </p>
        </AlertDialogDescription>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end sm:items-center pt-2">
          <AlertDialogCancel
            onClick={handleClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 transition"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Xóa sản phẩm
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
