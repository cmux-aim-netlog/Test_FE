/**
 * POST /study-groups 요청/응답 타입 및 폼 → API payload 변환
 * 백엔드 StudyGroupCreateReq / StudyGroupCreateRes 스펙 기준
 */

import type { MethodConfig } from '../features/my-study/components/AuthMethodSection';

export type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  data: T | null;
};

export type StudyGroupCreateRes = {
  groupId: number;
  createdAt: string;
};

/** 백엔드 카테고리: WAKE, SEATED, COTE, LANG, CERT, ETC */
const CATEGORY_MAP: Record<string, string> = {
  '코딩 테스트': 'COTE',
  자격증: 'CERT',
  언어: 'LANG',
  기상: 'WAKE',
  착석: 'SEATED',
  기타: 'ETC',
};

/** 프론트 인증 방식 → 백엔드 methodCode */
const METHOD_MAP: Record<string, string> = {
  사진: 'PHOTO',
  위치: 'GPS',
  TODO: 'CHECKLIST',
  GitHub: 'GITHUB',
};

/** 요일 한글 → 백엔드 (MON, TUE, ...) */
const DAY_MAP: Record<string, string> = {
  월: 'MON',
  화: 'TUE',
  수: 'WED',
  목: 'THU',
  금: 'FRI',
  토: 'SAT',
  일: 'SUN',
};

const formatTime = (date: Date) => {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

type CreatePayload = {
  title: string;
  description: string;
  thumbnailType: 'UPLOAD' | 'DEFAULT';
  thumbnailUrl: string | null;
  category: string;
  joinType: 'PUBLIC' | 'INVITE_ONLY';
  minMembers: number;
  maxMembers: number;
  period: {
    startDate: string;
    endDate: string | null;
    durationWeeks: number | null;
    isIndefinite: boolean;
  };
  hashtags: string[];
  verificationRules: Array<{
    slot: number;
    schedule: {
      endTime: string;
      checkEndTime: string | null;
      daysOfWeek: string[];
      timezone: string;
    };
    frequency: { unit: 'DAY' | 'WEEK'; requiredCnt: number };
    method: {
      methodCode: string;
      photo?: { minFiles: number; maxFiles: number; source: string };
      gps?: { radiusMode: string; radiusM: number; locations: unknown[]; blockOutsideTime: boolean };
      github?: { repoUrl: string; branch: string };
    };
    exemption: { isEnabled: boolean; limitUnit: string; limitCnt: number };
  }>;
};

function configToVerificationRule(
  config: MethodConfig,
  slot: number,
): CreatePayload['verificationRules'][0] {
  const methodCode = METHOD_MAP[config.method] ?? 'PHOTO';
  const endTime =
    config.method === 'TODO' ? formatTime(config.todoDeadline) : formatTime(config.rangeEnd);
  const checkEndTime = config.method === 'TODO' ? formatTime(config.todoComplete) : null;

  const method: CreatePayload['verificationRules'][0]['method'] = {
    methodCode,
  };
  if (config.method === '사진') {
    method.photo = { minFiles: 1, maxFiles: 3, source: 'ALLOW_ALBUM' };
  }
  if (config.method === '위치') {
    method.gps = {
      radiusMode: config.locationType === '공통 위치' ? 'COMMON' : 'PER_LOCATION',
      radiusM: 100,
      locations: config.locationName ? [{ name: config.locationName, latitude: 0, longitude: 0 }] : [],
      blockOutsideTime: true,
    };
  }
  if (config.method === 'GitHub') {
    method.github = { repoUrl: '', branch: 'main' };
  }

  return {
    slot,
    schedule: {
      endTime,
      checkEndTime,
      daysOfWeek: [], // 아래에서 채움
      timezone: 'Asia/Seoul',
    },
    frequency: { unit: 'DAY', requiredCnt: 1 },
    method,
    exemption: { isEnabled: false, limitUnit: 'TOTAL', limitCnt: 0 },
  };
}

export type BuildPayloadParams = {
  title: string;
  description: string;
  activeCategory: string;
  thumbnailUri: string | null;
  members: number;
  days: string[];
  startDate: Date;
  endDate: Date;
  primaryConfig: MethodConfig | null;
  secondaryConfig: MethodConfig | null;
};

/**
 * CreateStudyGroupScreen 폼 상태를 백엔드 POST /study-groups body 로 변환
 */
export function buildStudyGroupCreatePayload(params: BuildPayloadParams): CreatePayload {
  const {
    title,
    description,
    activeCategory,
    thumbnailUri,
    members,
    days,
    startDate,
    endDate,
    primaryConfig,
    secondaryConfig,
  } = params;

  const category = CATEGORY_MAP[activeCategory] ?? 'ETC';
  const daysOfWeek = days.map((d) => DAY_MAP[d] ?? d).filter(Boolean);

  const rules: CreatePayload['verificationRules'] = [];
  if (primaryConfig) {
    const r = configToVerificationRule(primaryConfig, 1);
    r.schedule.daysOfWeek = daysOfWeek.length > 0 ? daysOfWeek : ['MON'];
    rules.push(r);
  }
  if (secondaryConfig) {
    const r = configToVerificationRule(secondaryConfig, 2);
    r.schedule.daysOfWeek = daysOfWeek.length > 0 ? daysOfWeek : ['MON'];
    rules.push(r);
  }

  if (rules.length === 0) {
    rules.push({
      slot: 1,
      schedule: {
        endTime: '23:00',
        checkEndTime: '23:00',
        daysOfWeek: daysOfWeek.length > 0 ? daysOfWeek : ['MON'],
        timezone: 'Asia/Seoul',
      },
      frequency: { unit: 'DAY', requiredCnt: 1 },
      method: { methodCode: 'CHECKLIST' },
      exemption: { isEnabled: false, limitUnit: 'TOTAL', limitCnt: 0 },
    });
  }

  const formatYmd = (d: Date) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return {
    title: title.trim() || '제목 없음',
    description: description.trim() || '',
    thumbnailType: thumbnailUri ? 'UPLOAD' : 'DEFAULT',
    thumbnailUrl: thumbnailUri || null,
    category,
    joinType: 'PUBLIC',
    minMembers: 1,
    maxMembers: Math.max(1, members),
    period: {
      startDate: formatYmd(startDate),
      endDate: formatYmd(endDate),
      durationWeeks: null,
      isIndefinite: false,
    },
    hashtags: [],
    verificationRules: rules,
  };
}
