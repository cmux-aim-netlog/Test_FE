export interface UserResponse {
    name: string;
    email: string;
    nickname: string;
    gender: string;
    birthdate: string; 
    phoneNumber: string;
    socialType: string;
  }
  
  export interface UserUpdateReq {
    nickname: string;
    birthdate: string;
    gender: string;
    phoneNumber: string;
  }

export interface CategoryInfo {
  id: string;
  name: string;
}

export interface FavoriteCategoryRes {
  userId: string;
  favorites: CategoryInfo[]; 
  count: number; 
  updatedAt: string;
}

export interface FavoriteCategoryReq {
  category_ids: string[];
}

export interface SocialAccountRes {
  provider: string;
  email: string;
}