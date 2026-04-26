/**
 * GET /study-groups/my 응답 카드 DTO 매핑
 * API 명세: api-study-group-my.md (data[] = StudyGroupCardRes)
 */

import type { ImageSourcePropType } from 'react-native';
import type { StudyDetail } from '../features/study-detail/screens/StudyDetailScreen';

/** 백엔드 카드 응답 한 건 */
export type StudyGroupCardRes = {
  groupId: number;
  category: string;
  methodCodes: string[];
  title: string;
  minMembers: number;
  maxMembers: number;
  currentMembers: number;
  verificationTimeSummary: string;
  startDate: string | null;
  endDate: string | null;
  isIndefinite: boolean;
  hashtags: string[];
  /** UPLOAD 시 thumbnailUrl 사용, 없으면 디폴트 아이콘 */
  thumbnailType?: string;
  thumbnailUrl?: string | null;
};

const CATEGORY_LABEL: Record<string, string> = {
  WAKE: '기상',
  SEATED: '착석',
  COTE: '코테',
  LANG: '언어',
  CERT: '자격증',
  ETC: '기타',
};

const METHOD_LABEL: Record<string, string> = {
  PHOTO: '사진',
  CHECKLIST: 'TODO',
  GPS: '위치',
  GITHUB: 'GitHub',
};

const DAY_LABEL: Record<string, string> = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};

/** "MON,TUE,WED,THU,FRI 22:00" → "월/화/수/목/금 22:00" */
function verificationSummaryToKorean(summary: string): string {
  if (!summary || !summary.trim()) return '-';
  const parts = summary.trim().split(/\s+/);
  const dayPart = parts[0] ?? '';
  const timePart = parts.slice(1).join(' ');
  const days = dayPart.split(',').map((d) => DAY_LABEL[d?.trim() ?? ''] ?? d?.trim() ?? '').filter(Boolean);
  const dayStr = days.length > 0 ? days.join('/') : dayPart;
  return timePart ? `${dayStr} ${timePart}` : dayStr;
}

function categoryToLabel(category: string): string {
  return CATEGORY_LABEL[category] ?? category;
}

function methodCodesToLabels(methodCodes: string[]): string[] {
  return methodCodes.map((c) => METHOD_LABEL[c] ?? c);
}

function formatMembers(currentMembers: number, maxMembers: number): string {
  return `${currentMembers}/${maxMembers}`;
}

function formatPeriodFromDates(startDate: string | null, endDate: string | null): string {
  if (!startDate) return '-';
  const fmt = (s: string) => s.replace(/-/g, '. ');
  if (!endDate) return fmt(startDate);
  return `${fmt(startDate)} - ${fmt(endDate)}`;
}

/** 썸네일 설정 시 이미지 소스, 아니면 디폴트 마스코트 */
function cardImageSource(
  card: StudyGroupCardRes,
  index: number,
  mascotSources: ImageSourcePropType[],
): ImageSourcePropType {
  if (card.thumbnailType === 'UPLOAD' && card.thumbnailUrl?.trim()) {
    return { uri: card.thumbnailUrl.trim() };
  }
  return mascotSources[index % mascotSources.length];
}

/**
 * API 카드 한 건 → 메인 페이지 StudyDetail (StudyCard, 상세 이동)
 */
export function mapCardToStudyDetail(
  card: StudyGroupCardRes,
  index: number,
  mascotSources: ImageSourcePropType[],
): StudyDetail {
  const tag = categoryToLabel(card.category);
  const methods = methodCodesToLabels(card.methodCodes);
  const schedule = verificationSummaryToKorean(card.verificationTimeSummary || '-');
  const authTimes = methods.map((method) => ({ method, time: schedule }));
  const imageSource = cardImageSource(card, index, mascotSources);

  return {
    id: String(card.groupId),
    tag,
    title: card.title,
    members: formatMembers(card.currentMembers, card.maxMembers),
    description: '',
    schedule,
    count: '-',
    methods,
    authTimes,
    authDays: schedule,
    period: formatPeriodFromDates(card.startDate, card.endDate),
    image: imageSource,
    statusText: '인증 미완료',
    statusVariant: 'neutral',
    statusIcons: [],
    mascotSource: imageSource,
  };
}

/** 필터 옵션 (카테고리 / 인증방식) — MyStudyScreen 필터와 동일 라벨 */
export const categoryOptions = ['코테', '자격증', '언어', '기상', '착석', '기타'];
export const methodOptions = ['사진', '위치', 'TODO', 'GitHub'];

/** 라벨 → GET /study-groups 파라미터용 코드 */
export const CATEGORY_TO_CODE: Record<string, string> = {
  기상: 'WAKE',
  착석: 'SEATED',
  코테: 'COTE',
  언어: 'LANG',
  자격증: 'CERT',
  기타: 'ETC',
};
export const METHOD_TO_CODE: Record<string, string> = {
  사진: 'PHOTO',
  TODO: 'CHECKLIST',
  위치: 'GPS',
  GitHub: 'GITHUB',
};

/**
 * API 카드 한 건 → MyStudyScreen 리스트용 StudyItem 형태
 */
export function mapCardToStudyItem(
  card: StudyGroupCardRes,
  index: number,
  mascotSources: ImageSourcePropType[],
): {
  id: string;
  image: ImageSourcePropType;
  tag: string;
  title: string;
  members: string;
  time: string;
  methods: string[];
  description: string;
  period: string;
  authTimes: { method: string; time: string }[];
  authDays: string;
} {
  const tag = categoryToLabel(card.category);
  const methods = methodCodesToLabels(card.methodCodes);
  const time = verificationSummaryToKorean(card.verificationTimeSummary || '-');

  return {
    id: String(card.groupId),
    image: cardImageSource(card, index, mascotSources),
    tag,
    title: card.title,
    members: formatMembers(card.currentMembers, card.maxMembers),
    time,
    methods,
    description: '',
    period: formatPeriodFromDates(card.startDate, card.endDate),
    authTimes: methods.map((method) => ({ method, time })),
    authDays: time,
  };
}
