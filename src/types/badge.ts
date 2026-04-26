export interface BadgeAdminRes {
  badgeId: number;
  name: string;
  description: string;
  imageUrl: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

export interface BadgeAdminReq {
  name: string;
  description: string;
  imageUrl?: string;
}

export interface BadgeDeleteRes {
  badgeId: number;
  deletedBy: string;
  deletedAt: string;
}

export interface MyBadgeItem {
  badgeUserId: number; 
  badgeId: number;
  name: string;
  description: string;
  imageUrl: string;
  acquiredAt: string;
  isEquipped: boolean;
}

export interface MyBadgeListResponse {
  badges: MyBadgeItem[];
}