// API configuration and types
import { config } from './config';
import { supabase } from './supabase';

const API_BASE_URL = config.api.baseUrl;

// Types based on backend DTOs
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data: T;
  error?: {
    errorCode?: string;
    errorMessage?: string;
    validationErrors?: Record<string, string[]>;
  };
  timestamp: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  imageFile?: File;
}

export interface UpdateProductData extends CreateProductData {
  id: string;
}

export interface SearchParams {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sortOrder?: 0 | 1; // 0 = A-Z, 1 = Z-A
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  totalPrice: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  totalItems: number;
  shippingAddress: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  shippingAddress: string;
  notes?: string;
}

// API functions
export class ProductAPI {
  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    
    return headers;
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const authHeaders = await this.getAuthHeaders();
    
    const response = await fetch(url, {
      headers: {
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private static async requestWithFormData<T>(
    endpoint: string,
    formData: FormData,
    method: 'POST' | 'PUT' = 'POST'
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {};
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    
    const response = await fetch(url, {
      method,
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all products with pagination
  static async getProducts(page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return this.request<PaginatedResponse<Product>>(`/products?page=${page}&pageSize=${pageSize}`);
  }

  // Get product by ID
  static async getProductById(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  // Create new product
  static async createProduct(productData: CreateProductData): Promise<ApiResponse<Product>> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    
    if (productData.imageFile) {
      formData.append('imageFile', productData.imageFile);
    }

    return this.requestWithFormData<Product>('/products', formData, 'POST');
  }

  // Update product
  static async updateProduct(productData: UpdateProductData): Promise<ApiResponse<Product>> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    
    if (productData.imageFile) {
      formData.append('imageFile', productData.imageFile);
    }

    return this.requestWithFormData<Product>(`/products/${productData.id}`, formData, 'PUT');
  }

  // Delete product
  static async deleteProduct(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Search products
  static async searchProducts(params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const searchParams = new URLSearchParams();
    
    if (params.searchTerm) searchParams.append('searchTerm', params.searchTerm);
    if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.pageSize !== undefined) searchParams.append('pageSize', params.pageSize.toString());
    if (params.sortOrder !== undefined) searchParams.append('sortOrder', params.sortOrder.toString());

    const queryString = searchParams.toString();
    const endpoint = `/products/search${queryString ? `?${queryString}` : ''}`;
    
    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  // Cart API methods
  static async getCart(): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart');
  }

  static async addToCart(productId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  static async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return this.request<Cart>(`/cart/items/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  static async removeFromCart(productId: string): Promise<ApiResponse<Cart>> {
    return this.request<Cart>(`/cart/items/${productId}`, {
      method: 'DELETE',
    });
  }

  static async clearCart(): Promise<ApiResponse<null>> {
    return this.request<null>('/cart', {
      method: 'DELETE',
    });
  }

  // Order API methods
  static async createOrder(orderData: CreateOrderData): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  static async getMyOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>('/orders/my');
  }

  static async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${orderId}`);
  }
}
