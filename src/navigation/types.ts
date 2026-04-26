import { type NavigatorScreenParams } from '@react-navigation/native';
import { type StudyDetail } from '../features/study-detail/screens/StudyDetailScreen';
import { type StudyPreview } from '../features/search/types';

export type HomeStackParamList = {
  HomeMain: undefined;
  StudyDetail: { study: StudyDetail; showWelcome?: boolean };
};

export type SearchStackParamList = {
  SearchMain: { fromHomeEmptyCard?: boolean };
  StudyJoin: { study: StudyPreview };
};

export type BottomTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: NavigatorScreenParams<SearchStackParamList>;
  History: undefined;
  MyPage: undefined;
};
