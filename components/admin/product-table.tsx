"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

const createColumns = (
  onEdit?: (product: Product) => void,
  onDeleteClick?: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      return (
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-none overflow-hidden bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt="Product"
              className="w-full h-full object-cover"
              width={48}
              height={48}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Tên sách",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div 
          className="font-medium max-w-[120px] sm:max-w-[200px] truncate cursor-help"
          title={name}
        >
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div 
          className="max-w-[100px] sm:max-w-[300px] truncate text-xs sm:text-sm text-muted-foreground cursor-help"
          title={description}
        >
          {description}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
      return <div className="font-medium text-xs sm:text-sm">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-6 sm:h-8 px-1 sm:px-2 text-xs font-medium text-green-600 border-green-600 hover:bg-green-50"
          >
            <Link href={`/products/${product.id}`}>
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Xem</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 sm:h-8 px-1 sm:px-2 text-xs font-medium text-blue-600 border-blue-600 hover:bg-blue-50"
            onClick={() => onEdit?.(product)}
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
            <span className="hidden sm:inline">Sửa</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 sm:h-8 px-1 sm:px-2 text-xs font-medium text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => onDeleteClick?.(product)}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
            <span className="hidden sm:inline">Xóa</span>
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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const handleDeleteClick = (product: Product) => {
    if (onDelete) {
      onDelete(product.id);
    }
  };

  const columns = createColumns(onEdit, handleDeleteClick);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });


  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32 ml-auto" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                <TableHead><Skeleton className="h-4 w-12" /></TableHead>
                <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-12 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
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
      {/* Table View for all screen sizes */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-xs sm:text-sm">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs sm:text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có sản phẩm nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Server-side Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              className="px-4 py-2"
            >
              Trước
            </Button>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-none">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              className="px-4 py-2"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
