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
      page: 1,
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
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Card className="mb-6 rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50 p-4">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Search className="h-5 w-5 text-orange-400" />
          Tìm kiếm sản phẩm
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Tên sản phẩm hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200 rounded-lg"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg px-4"
            >
              <Search className="h-4 w-4" />
              Tìm kiếm
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={loading}
              className="flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-100 rounded-lg px-4"
            >
              <X className="h-4 w-4" />
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-100 rounded-lg px-4 py-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>
          </div>
        )}

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 bg-blue-50 rounded-lg p-3 shadow-inner">
            {/* Min Price */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-blue-800 mb-1">Giá tối thiểu (VND)</label>
              <Input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm sm:text-base border-blue-200 focus:border-blue-400 focus:ring-blue-200 rounded-md"
              />
            </div>
            {/* Max Price */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-blue-800 mb-1">Giá tối đa (VND)</label>
              <Input
                type="number"
                placeholder="1000000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm sm:text-base border-blue-200 focus:border-blue-400 focus:ring-blue-200 rounded-md"
              />
            </div>
            {/* Sort Order */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-blue-800 mb-1">Sắp xếp</label>
              <div className="flex gap-2">
                <Button
                  variant={sortOrder === 0 ? 'default' : 'outline'}
                  onClick={() => setSortOrder(0)}
                  className="flex-1 text-sm sm:text-base"
                >
                  A - Z
                </Button>
                <Button
                  variant={sortOrder === 1 ? 'default' : 'outline'}
                  onClick={() => setSortOrder(1)}
                  className="flex-1 text-sm sm:text-base"
                >
                  Z - A
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Apply Filters Button */}
        {showFilters && (
          <div className="flex justify-end mt-3">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-400 hover:bg-blue-500 text-white rounded-lg px-4 py-2"
            >
              Áp dụng bộ lọc
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
