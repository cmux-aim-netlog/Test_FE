export type CategoryType = 'ALL' | 'COTE' | 'WAKE' | 'SEATED' |'LANG' | 'CERT' | 'ETC';

export interface Product {
  productId: number;
  name: string;
  category: CategoryType;
  categoryName: string;
  price: number;
  isAvailable: boolean;
  description: string;
}

export interface UserItem {
  productItemId: number;
  productId: number;
  name: string;
  quantity: number;
}

export interface PurchaseResponse {
  transactionId: string;
  productName: string;
  spentAmount: number;
  balanceAfter: number;
  purchasedAt: string;
}