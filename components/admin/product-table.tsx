"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Eye, Edit, Trash2 } from "lucide-react";

// Columns with accessorFn to avoid accessorKey errors
const createColumns = (
  onEdit?: (product: Product) => void,
  onDeleteClick?: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    id: "image",
    header: "Hình ảnh",
    accessorFn: row => row.image || "",
    cell: ({ getValue }) => {
      const image = getValue<string>();
      return (
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-gray-100">
          {image ? (
            <Image src={image} alt="Product" width={48} height={48} className="w-full h-full object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "name",
    header: "Tên sản phẩm",
    accessorFn: row => row.name,
    cell: ({ getValue }) => {
      const name = getValue<string>();
      return <div className="truncate max-w-[150px] sm:max-w-[250px]" title={name}>{name}</div>;
    },
  },
  {
    id: "description",
    header: "Mô tả",
    accessorFn: row => row.description,
    cell: ({ getValue }) => {
      const desc = getValue<string>();
      return <div className="truncate max-w-[100px] sm:max-w-[300px] text-xs sm:text-sm text-muted-foreground" title={desc}>{desc}</div>;
    },
    enableSorting: false,
  },
  {
    id: "price",
    header: "Giá",
    accessorFn: row => Number(row.price),
    cell: ({ getValue }) => {
      const formatted = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(getValue<number>());
      return <div className="font-medium text-xs sm:text-sm">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="outline" size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-green-600 border-green-600 hover:bg-green-50">
            <Link href={`/products/${product.id}`}><Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" /><span className="hidden sm:inline">Xem</span></Link>
          </Button>
          <Button variant="outline" size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-blue-600 border-blue-600 hover:bg-blue-50" onClick={() => onEdit?.(product)}>
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1"/><span className="hidden sm:inline">Sửa</span>
          </Button>
          <Button variant="outline" size="sm" className="h-6 sm:h-8 px-1 sm:px-2 text-red-600 border-red-600 hover:bg-red-50" onClick={() => onDeleteClick?.(product)}>
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1"/><span className="hidden sm:inline">Xóa</span>
          </Button>
        </div>
      );
    },
  },
];

interface ProductTableProps {
  data: Product[];
  loading?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function ProductTable({ data, loading = false, onEdit, onDelete, currentPage = 1, totalPages = 1, onPageChange }: ProductTableProps) {
  const table = useReactTable({
    data,
    columns: createColumns(onEdit, product => onDelete?.(product.id)),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-64"/>
          <Skeleton className="h-10 w-32 ml-auto"/>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({length:5}).map((_,i) => <TableHead key={i}><Skeleton className="h-4 w-16"/></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({length:5}).map((_,i) => (
                <TableRow key={i}>
                  {Array.from({length:5}).map((_,j)=><TableCell key={j}><Skeleton className="h-12 w-12"/></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup=>(
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header=>(
                  <TableHead key={header.id} className="text-xs sm:text-sm">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? table.getRowModel().rows.map(row=>(
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell=>(
                  <TableCell key={cell.id} className="text-xs sm:text-sm">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">Không có sản phẩm nào.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={currentPage===1} onClick={()=>onPageChange?.(currentPage-1)}>Trước</Button>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-none">Trang {currentPage}/{totalPages}</span>
            <Button variant="outline" disabled={currentPage===totalPages} onClick={()=>onPageChange?.(currentPage+1)}>Sau</Button>
          </div>
        </div>
      )}
    </div>
  );
}
