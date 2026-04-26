import { apiClient } from './client';
import { ApiResponse } from '../types/api';
import { PointTransaction, PageResponse } from '../types/point';

export const getPointBalance = () =>
  apiClient.get<ApiResponse<number>>(`/points/balance`)

export const getPointHistory = (type: string, page: number = 0) => {
  const typeMap: { [key: string]: string } = {
    all: '전체',
    earn: '적립',
    use: '사용',
    exchange: '환전',
  };

  const queryType = typeMap[type] || '전체';

  return apiClient.get<ApiResponse<PageResponse<PointTransaction>>>(
    `/points/history`, 
    {
      params: { 
        type: queryType,
        page, 
        size: 10 
      }
    }
  );
};