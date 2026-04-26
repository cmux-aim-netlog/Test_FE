import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";
import { Product, PurchaseResponse, UserItem, CategoryType } from "../types/store";
import { ApiResponse } from "../types/api";

export const storeApi = {
  getAvailableProducts: async () => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`${ENDPOINTS.stores}`);
    return response.data;
  },

  purchaseProduct: async (productId: number) => {
    const response = await apiClient.post<ApiResponse<PurchaseResponse>>(`${ENDPOINTS.stores}/${productId}/purchase`);
    return response.data;
  },

  getMyInventory: async () => {
    const response = await apiClient.get<ApiResponse<{ items: UserItem[] }>>(`${ENDPOINTS.stores}/items`);
    return response.data;
  },

  deleteUserItem: async (productItemId: number) => {
    const response = await apiClient.patch<ApiResponse<string>>(`${ENDPOINTS.stores}/items/${productItemId}/delete`);
    return response.data;
  },

  getAllProductsAdmin: async () => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`${ENDPOINTS.stores}/admin`);
    return response.data;
  },

  /** [관리자] 새 상품 등록 */
  createProduct: async (productData: {
    name: string;
    category: CategoryType;
    price: number;
    isAvailable: boolean;
  }) => {
    const response = await apiClient.post<ApiResponse<Product>>(`${ENDPOINTS.stores}`, productData);
    return response.data;
  },

  /** [관리자] 상품 수정 */
  updateProduct: async (productId: number, productData: {
    name: string;
    category: CategoryType;
    price: number;
    isAvailable: boolean;
  }) => {
    const response = await apiClient.patch<ApiResponse<Product>>(`${ENDPOINTS.stores}/${productId}`, productData);
    return response.data;
  },

  deleteProduct: async (productId: number) => {
    const response = await apiClient.patch<ApiResponse<string>>(`${ENDPOINTS.stores}/${productId}/delete`);
    return response.data;
  }
};