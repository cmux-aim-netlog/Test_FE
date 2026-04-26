
import { ApiResponse } from './api'; 

export interface PageResponse<T> {
  content: T[];
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PointTransaction {
  transactionId: string;
  type: '적립' | '사용' | '환전';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export interface PointHistoryResponse extends PageResponse<PointTransaction> {}