import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { ApiResponse } from '../types/api';
import { MyBadgeListResponse, MyBadgeItem,BadgeAdminReq,BadgeAdminRes, BadgeDeleteRes } from '../types/badge';

export const getMyBadges = () => 
  apiClient.get<ApiResponse<MyBadgeListResponse>>(`${ENDPOINTS.badges}/my-badges`);

export const equipBadge = (badgeUserId: number) => 
  apiClient.patch<ApiResponse<MyBadgeItem>>(
    `${ENDPOINTS.badges}/my-badges/${badgeUserId}/equip`
  );

export const checkAndGrantBadge = () =>
  apiClient.post<ApiResponse<any>>(`${ENDPOINTS.badges}/check`);

export const getAllBadges = () => 
  apiClient.get<ApiResponse<BadgeAdminRes[]>>(ENDPOINTS.badges);

export const createBadge = (data: BadgeAdminReq) => 
  apiClient.post<ApiResponse<BadgeAdminRes>>(ENDPOINTS.badges, data);

export const updateBadge = (badgeId: number, data: BadgeAdminReq) => 
  apiClient.patch<ApiResponse<BadgeAdminRes>>(`${ENDPOINTS.badges}/${badgeId}`, data);

export const deleteBadge = (badgeId: number) => 
  apiClient.patch<ApiResponse<BadgeDeleteRes>>(`${ENDPOINTS.badges}/${badgeId}/delete`);