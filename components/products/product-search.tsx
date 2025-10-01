'use client';

import { useState } from 'react';
import { SearchParams } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';

interface ProductSearchProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
  showAdvanced?: boolean;
}

export function ProductSearch({ onSearch, loading = false, showAdvanced = true }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState<0 | 1>(0);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const params: SearchParams = {
      searchTerm: searchTerm.trim() || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortOrder,
      page: 1, // Reset to first page on new search
    };
    onSearch(params);
  };

  const handleClear = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortOrder(0);
    onSearch({ page: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          Tìm kiếm sản phẩm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-3">
        {/* Search Input */}
        <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Nhập tên sản phẩm hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Button onClick={handleSearch} disabled={loading} className="px-4 sm:px-4 w-full sm:w-auto text-sm sm:text-base">
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Tìm kiếm</span>
              <span className="sm:hidden">Tìm</span>
            </Button>
            {showAdvanced && (
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 sm:px-4 w-full sm:w-auto text-sm sm:text-base"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Bộ lọc</span>
                <span className="sm:hidden">Lọc</span>
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3 p-3 sm:p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
                Giá tối thiểu (VND)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
                Giá tối đa (VND)
              </label>
              <Input
                type="number"
                placeholder="1000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
                Sắp xếp
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) as 0 | 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              >
                <option value={0}>A - Z</option>
                <option value={1}>Z - A</option>
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={loading}
            className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Xóa bộ lọc</span>
            <span className="sm:hidden">Xóa lọc</span>
          </Button>
          {showAdvanced && showFilters && (
            <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
              Áp dụng bộ lọc
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
