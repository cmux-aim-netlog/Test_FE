export type StudyGroupItem = {
  group_id: number;
  category: string;
  verify_methods: string[];
  title: string;
  member_count: number;
  max_members: number;
  auth_days?: string[];
  period: string;
  hashtags: string[];
  thumbnail_url: string;
  auth_times?: Record<string, string>;
};

export type StudyGroupResponse = {
  isSuccess: boolean;
  data: {
    page: number;
    size: number;
    total: number;
    items: StudyGroupItem[];
  };
};

export const studyGroupMock: StudyGroupResponse = {
  isSuccess: true,
  data: {
    page: 1,
    size: 20,
    total: 12,
    items: [
      {
        group_id: 101,
        category: 'WAKE',
        verify_methods: ['PHOTO', 'GPS'],
        title: '매일 6시 기상 인증',
        member_count: 7,
        max_members: 10,
        auth_days: ['월', '화', '수', '목', '금'],
        auth_times: {
          PHOTO: '07:00~08:00',
          GPS: '08:00~09:00',
        },
        period: '2026-02-01~2026-02-28',
        hashtags: ['기상', '아침루틴'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail.png',
      },
      {
        group_id: 102,
        category: 'LANGUAGE',
        verify_methods: ['TODO'],
        title: '영어 회화 루틴',
        member_count: 4,
        max_members: 8,
        auth_days: ['월', '수', '금'],
        auth_times: {
          TODO: '19:00~20:00|21:00~22:00',
        },
        period: '2026-02-03~2026-03-10',
        hashtags: ['언어', '회화'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail2.png',
      },
      {
        group_id: 103,
        category: 'CODING_TEST',
        verify_methods: ['GITHUB', 'PHOTO'],
        title: '코테 30분 챌린지',
        member_count: 5,
        max_members: 10,
        auth_days: ['화', '목', '토'],
        auth_times: {
          GITHUB: '21:00~22:00',
          PHOTO: '22:00~23:00',
        },
        period: '2026-02-05~2026-03-05',
        hashtags: ['코딩', '알고리즘'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail3.png',
      },
      {
        group_id: 104,
        category: 'LICENSE',
        verify_methods: ['TODO'],
        title: '자격증 한 달 완성',
        member_count: 6,
        max_members: 12,
        auth_days: ['월', '수', '금'],
        auth_times: {
          TODO: '08:00~09:00|09:00~10:00',
        },
        period: '2026-02-10~2026-03-15',
        hashtags: ['자격증', '아침공부'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail4.png',
      },
      {
        group_id: 105,
        category: 'SEATED',
        verify_methods: ['PHOTO'],
        title: '착석 인증 챌린지',
        member_count: 8,
        max_members: 10,
        auth_days: ['월', '화', '목'],
        auth_times: {
          PHOTO: '10:00~12:00',
        },
        period: '2026-02-12~2026-03-12',
        hashtags: ['착석', '루틴'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail5.png',
      },
      {
        group_id: 106,
        category: 'WAKE',
        verify_methods: ['PHOTO', 'TODO'],
        title: '5시 기상과 할일',
        member_count: 3,
        max_members: 6,
        auth_days: ['월', '화', '수', '목', '금'],
        auth_times: {
          PHOTO: '05:00~06:00',
          TODO: '05:30~06:00|06:00~06:30',
        },
        period: '2026-02-15~2026-03-20',
        hashtags: ['기상', 'TODO'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail6.png',
      },
      {
        group_id: 107,
        category: 'LANGUAGE',
        verify_methods: ['PHOTO'],
        title: '일본어 한자 쓰기',
        member_count: 5,
        max_members: 9,
        auth_days: ['화', '목'],
        auth_times: {
          PHOTO: '08:00~09:00',
        },
        period: '2026-02-18~2026-03-22',
        hashtags: ['언어', '일본어'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail7.png',
      },
      {
        group_id: 108,
        category: 'CODING_TEST',
        verify_methods: ['GITHUB'],
        title: '매일 알고리즘 1문제',
        member_count: 9,
        max_members: 12,
        auth_days: ['월', '수', '금'],
        auth_times: {
          GITHUB: '22:00~23:00',
        },
        period: '2026-02-20~2026-03-25',
        hashtags: ['코딩', '깃허브'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail8.png',
      },
      {
        group_id: 109,
        category: 'LICENSE',
        verify_methods: ['PHOTO', 'GPS'],
        title: '도서관 출석 인증',
        member_count: 4,
        max_members: 7,
        auth_days: ['월', '수', '금'],
        auth_times: {
          PHOTO: '14:00~15:00',
          GPS: '15:00~16:00',
        },
        period: '2026-02-22~2026-03-30',
        hashtags: ['자격증', '도서관'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail9.png',
      },
      {
        group_id: 110,
        category: 'SEATED',
        verify_methods: ['TODO', 'PHOTO'],
        title: '저녁 집중 스터디',
        member_count: 2,
        max_members: 6,
        auth_days: ['월', '화', '목'],
        auth_times: {
          TODO: '19:00~20:00|21:00~22:00',
          PHOTO: '22:00~23:00',
        },
        period: '2026-02-25~2026-03-31',
        hashtags: ['착석', '집중'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail10.png',
      },
      {
        group_id: 111,
        category: 'ETC',
        verify_methods: ['GPS'],
        title: '러닝 루틴 인증',
        member_count: 10,
        max_members: 15,
        auth_days: ['토', '일'],
        auth_times: {
          GPS: '07:00~08:00',
        },
        period: '2026-02-27~2026-04-01',
        hashtags: ['운동', 'GPS'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail11.png',
      },
      {
        group_id: 112,
        category: 'ETC',
        verify_methods: ['PHOTO', 'GITHUB'],
        title: '프로젝트 회고 챌린지',
        member_count: 1,
        max_members: 5,
        auth_days: ['금'],
        auth_times: {
          PHOTO: '21:00~22:00',
          GITHUB: '22:30~23:30',
        },
        period: '2026-03-01~2026-04-05',
        hashtags: ['회고', '깃허브'],
        thumbnail_url: 'https://cdn.example.com/group/thumbnail12.png',
      },
    ],
  },
};

const categoryMap: Record<string, string> = {
  WAKE: '기상',
  LANGUAGE: '언어',
  CODING_TEST: '코테',
  LICENSE: '자격증',
  SEATED: '착석',
  ETC: '기타',
};

const methodMap: Record<string, string> = {
  PHOTO: '사진',
  GPS: 'GPS',
  TODO: 'TODO',
  GITHUB: 'GitHub',
};

export const categoryOptions = Object.values(categoryMap);
export const methodOptions = Object.values(methodMap);

export const getStudyGroups = () => studyGroupMock.data.items;

export const myStudyGroupMock: StudyGroupResponse = {
  isSuccess: true,
  data: {
    page: 1,
    size: 10,
    total: 4,
    items: [
      {
        group_id: 201,
        category: 'WAKE',
        verify_methods: ['PHOTO', 'GPS'],
        title: '기상 스터디',
        member_count: 3,
        max_members: 5,
        auth_days: ['월', '화', '목'],
        auth_times: {
          PHOTO: '07:00~08:00',
          GPS: '08:00~09:00',
        },
        period: '2026-02-01~2026-03-01',
        hashtags: ['기상', '루틴'],
        thumbnail_url: 'https://cdn.example.com/group/my-thumbnail1.png',
      },
      {
        group_id: 202,
        category: 'LANGUAGE',
        verify_methods: ['PHOTO'],
        title: '일본어 뽀시기',
        member_count: 6,
        max_members: 6,
        auth_days: ['화', '목'],
        auth_times: {
          PHOTO: '15:00~16:00',
        },
        period: '2026-02-05~2026-03-05',
        hashtags: ['언어', '일본어'],
        thumbnail_url: 'https://cdn.example.com/group/my-thumbnail2.png',
      },
      {
        group_id: 203,
        category: 'CODING_TEST',
        verify_methods: ['GITHUB'],
        title: '코테 스터디',
        member_count: 4,
        max_members: 10,
        auth_days: ['월', '수', '금'],
        auth_times: {
          GITHUB: '21:00~22:00',
        },
        period: '2026-02-10~2026-03-20',
        hashtags: ['코딩', '알고리즘'],
        thumbnail_url: 'https://cdn.example.com/group/my-thumbnail3.png',
      },
      {
        group_id: 204,
        category: 'SEATED',
        verify_methods: ['TODO', 'PHOTO'],
        title: '착석 스터디',
        member_count: 2,
        max_members: 4,
        auth_days: ['월', '수', '금'],
        auth_times: {
          TODO: '09:00~10:00|10:00~11:00',
          PHOTO: '11:00~12:00',
        },
        period: '2026-02-12~2026-03-12',
        hashtags: ['착석'],
        thumbnail_url: 'https://cdn.example.com/group/my-thumbnail4.png',
      },
    ],
  },
};

export const getMyStudyGroups = () => myStudyGroupMock.data.items;

export const formatCategory = (category: string) => categoryMap[category] ?? category;

export const formatMethods = (methods: string[]) =>
  methods.map((method) => methodMap[method] ?? method);

export const formatMembers = (count: number, max: number) => `${count}/${max}`;

export const formatPrimaryAuthTime = (
  methods: string[],
  authTimes?: Record<string, string>,
) => {
  const firstMethod = methods[0];
  const raw = authTimes?.[firstMethod] ?? '';
  if (!raw) {
    return '';
  }
  if (firstMethod === 'TODO' && raw.includes('|')) {
    const parts = raw.split('|').map((value) => value.trim());
    return parts[1] || parts[0] || '';
  }
  return raw;
};

export const formatPeriod = (period: string) => {
  const [start, end] = period.split('~').map((value) => value.trim());
  const formatDate = (value: string) => value.replace(/-/g, '. ');
  if (!end) {
    return formatDate(start);
  }
  return `${formatDate(start)} - ${formatDate(end)}`;
};

export const formatAuthDays = (days?: string[]) => {
  if (!days || days.length === 0) {
    return '-';
  }
  return `매주 ${days.join('/')}`;
};

export const formatAuthTimes = (
  methods: string[],
  authTimes?: Record<string, string>,
) =>
  methods.map((method) => {
    const raw = authTimes?.[method] ?? '';
    if (method === 'TODO') {
      const [deadline, complete] = raw.split('|').map((value) => value.trim());
      return {
        method: formatMethods([method])[0],
        time: raw,
        deadline,
        complete,
      };
    }
    return {
      method: formatMethods([method])[0],
      time: raw,
    };
  });
