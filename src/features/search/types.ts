import { type ImageSourcePropType } from 'react-native';

export type StudyPreview = {
  id: string;
  tag: string;
  title: string;
  members: string;
  description: string;
  schedule: string;
  period: string;
  methods: string[];
  authTimes: { method: string; time: string; deadline?: string; complete?: string }[];
  authDays?: string;
  image: ImageSourcePropType;
};
