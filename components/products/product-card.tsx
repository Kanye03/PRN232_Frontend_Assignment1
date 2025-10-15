'use client';

import { useState } from 'react';
import { Product, ProductAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { DeleteProductDialog } from './delete-product-dialog';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  clickable?: boolean;
}

export function ProductCard({ product, onEdit, onDelete, showActions = true, clickable = true }: ProductCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async (productId: string) => {
    if (onDelete) await onDelete(productId);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    setAddingToCart(true);
    try {
      await ProductAPI.addToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const cardContent = (
    <Card className="group overflow-hidden border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 bg-white">
      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-t-lg">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            width={300}
            height={300}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <div className="text-center">
              <div className="text-3xl sm:text-5xl mb-1 sm:mb-2">📦</div>
              <p className="text-xs sm:text-sm text-gray-400">Không có hình ảnh</p>
            </div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />

        {/* Quick actions */}
        {showActions && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1 sm:gap-2">
            <Link href={`/products/${product.id}`} onClick={(e) => e.stopPropagation()}>
              <Button size="sm" variant="secondary" className="h-7 w-7 sm:h-8 sm:w-8 p-0 shadow-md">
                <Eye className="h-4 w-4" />
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
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 shadow-md"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteClick}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 shadow-md"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base lg:text-lg group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-green-600 font-bold text-sm sm:text-base lg:text-lg">
          ${product.price.toFixed(2)}
        </p>
        {user && (
          <Button
            size="sm"
            className="w-full mt-2"
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
        )}
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
