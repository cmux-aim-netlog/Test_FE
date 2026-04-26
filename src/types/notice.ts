export interface NoticeListItem {
  notice_id: number;
  title: string;
  view_count: number;
  created_at: string;
}

export interface PageInfo {
  current_page: number;
  total_pages: number;
  total_elements: number;
  size: number;
}

export interface NoticeListResponse {
  notices: NoticeListItem[];
  page_info: PageInfo;
}

export interface NoticeDetail {
  notice_id: number;
  title: string;
  content: string;
  view_count: number;
  created_at: string;
}

export interface NoticeCreateReq {
  title: string;
  content: string;
}

export interface NoticeUpdateReq {
  title?: string;
  content?: string;
}