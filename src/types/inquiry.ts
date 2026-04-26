
export type InquiryStatus = 'PENDING' | 'ANSWERED';

export interface InquiryComment {
  comment_id: number;
  author_type: 'USER' | 'ADMIN';
  content: string;
}

export interface InquiryListItem {
  inquiry_id: number;
  title: string;
  status: InquiryStatus;
}

export interface InquiryDetail {
  inquiry_id: number;
  title: string;
  content: string;
  status: InquiryStatus;
  comments: InquiryComment[];
}

export interface PageInfo {
  current_page: number;
  size: number;
  total_elements: number;
  total_pages: number;
  is_last: boolean;
}

export interface InquiryListRes {
  inquiries: InquiryListItem[];
  page_info: PageInfo;
}

export interface InquiryRequest {
  title: string;
  content: string;
}