'use client';

import { useState } from 'react';
import { Product } from '@/lib/api';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DeleteProductDialog } from './delete-product-dialog';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  clickable?: boolean;
}

export function ProductCard({ product, onEdit, onDelete, showActions = true, clickable = true }: ProductCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);


  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async (productId: string) => {
    if (onDelete) {
      await onDelete(productId);
    }
  };

  const cardContent = (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            width={300}
            height={300}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">📚</div>
              <p className="text-xs sm:text-sm">Không có hình ảnh</p>
            </div>
          </div>
        )}
        
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Quick actions overlay */}
        {showActions && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-1 sm:gap-2">
              <Link href={`/products/${product.id}`} onClick={(e) => e.stopPropagation()}>
                <Button size="sm" variant="secondary" className="h-6 w-6 sm:h-8 sm:w-8 p-0 shadow-lg">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </Link>
              {onEdit && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(product);
                  }}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 shadow-lg"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 shadow-lg"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-2 sm:p-3 lg:p-4">
        <div className="space-y-2 sm:space-y-3">
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors leading-tight h-8 sm:h-10 lg:h-12 overflow-hidden">
            <span className="block line-clamp-2 text-xs sm:text-sm lg:text-base">
              {product.name}
            </span>
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-lg lg:text-xl font-bold text-green-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (clickable && !showActions) {
    return (
      <>
        <Link href={`/products/${product.id}`} className="block">
          {cardContent}
        </Link>
        <DeleteProductDialog
          product={product}
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteConfirm}
        />
      </>
    );
  }

  return (
    <>
      {cardContent}
      <DeleteProductDialog
        product={product}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
