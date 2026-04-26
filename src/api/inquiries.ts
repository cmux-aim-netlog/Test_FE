import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { ApiResponse } from '../types/api';
import { InquiryDetail, InquiryListRes, InquiryRequest, InquiryComment } from '../types/inquiry';

export const fetchInquiries = <T = unknown>(params?: Record<string, unknown>) =>
  apiClient.get<T>(ENDPOINTS.inquiries, { params });

export const getMyInquiries = (page = 0, size = 10) => 
  apiClient.get<ApiResponse<InquiryListRes>>(`${ENDPOINTS.inquiries}/me?page=${page}&size=${size}`);

export const getInquiryDetail = (inquiryId: number) => 
  apiClient.get<ApiResponse<InquiryDetail>>(`${ENDPOINTS.inquiries}/${inquiryId}`);

export const createInquiry = (data: InquiryRequest) => 
  apiClient.post<ApiResponse<InquiryDetail>>(ENDPOINTS.inquiries, data);

export const addInquiryComment = (inquiryId: number, content: string) => 
  apiClient.post<ApiResponse<InquiryComment>>(`${ENDPOINTS.inquiries}/${inquiryId}/comments`, { 
    author_type: 'USER', 
    content 
  });

export const deleteInquiry = (inquiryId: number) => 
  apiClient.delete(`${ENDPOINTS.inquiries}/${inquiryId}`);

export const getAllInquiriesForAdmin = (role: string, page = 0, size = 10, status?: string) => 
  apiClient.get<ApiResponse<InquiryListRes>>(ENDPOINTS.inquiries, {
    params: { page, size, status },
    headers: { 'X-User-Role': role }
  });