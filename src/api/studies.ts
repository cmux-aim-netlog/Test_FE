import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

export const fetchStudies = <T = unknown>(params?: Record<string, unknown>) =>
  apiClient.get<T>(ENDPOINTS.studies, { params });

export const fetchStudyById = <T = unknown>(studyId: string | number) =>
  apiClient.get<T>(`${ENDPOINTS.studies}/${studyId}`);

export const createStudy = <T = unknown, P = unknown>(payload: P) =>
  apiClient.post<T>(ENDPOINTS.studies, payload);

export const updateStudy = <T = unknown, P = unknown>(studyId: string | number, payload: P) =>
  apiClient.patch<T>(`${ENDPOINTS.studies}/${studyId}`, payload);

export const deleteStudy = <T = unknown>(studyId: string | number) =>
  apiClient.delete<T>(`${ENDPOINTS.studies}/${studyId}`);
