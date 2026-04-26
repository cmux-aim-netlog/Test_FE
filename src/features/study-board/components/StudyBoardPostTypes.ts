export type Comment = {
  id: number;
  name: string;
  text: string;
  date?: string;
  /** API 연동: 본인 댓글 여부(수정/삭제 버튼 표시) */
  isMine?: boolean;
};

export type Post = {
  id: number;
  studyName: string;
  name: string;
  title: string;
  desc: string;
  detail: string;
  date: string;
  likes: number;
  liked: boolean;
  alarmEnabled: boolean;
  comments: number;
  image?: number;
  commentList: Comment[];
  /** API 연동: 작성자 userId (본인 글 수정/삭제 판단) */
  authorUserId?: string;
};

/** 날짜 문자열을 화면 표시용으로 포맷 (예: 2025-01-15T14:30:00 → 01/15 14:30) */
export function formatPostDate(iso: string): string {
  try {
    const d = new Date(iso);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${m}/${day} ${h}:${min}`;
  } catch {
    return '';
  }
}
