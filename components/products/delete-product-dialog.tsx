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

export function DeleteProductDialog({ 
  product, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset loading state when dialog is closed
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
      // Success - dialog will be closed by parent component
      toast.success('Sản phẩm đã được xóa thành công!');
      // Reset loading state after successful deletion
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
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Xóa sản phẩm
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogDescription className="text-left space-y-3">
          <p>
            Bạn có chắc chắn muốn xóa sản phẩm <strong>&ldquo;{product.name}&rdquo;</strong> không?
          </p>
          <p className="text-sm text-muted-foreground">
            Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </p>
        </AlertDialogDescription>
        
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground flex-1 sm:flex-none"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa sản phẩm
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
