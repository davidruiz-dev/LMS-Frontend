
// import axiosClient from '@/api/client';
// import type { Course } from '@/shared/types';

// export const courseApi = {
//   getAll: (): Promise<Course[]> => {
//     return axiosClient.get('/courses');
//   },

//   getById: (id: string): Promise<Course> => {
//     return axiosClient.get(`/courses/${id}`);
//   },

//   create: (data: CreateCourseData): Promise<Course> => {
//     return axiosClient.post('/courses', data);
//   },

//   update: (id: string, data: UpdateCourseData): Promise<Course> => {
//     return axiosClient.put(`/courses/${id}`, data);
//   },

//   delete: (id: string): Promise<void> => {
//     return axiosClient.delete(`/courses/${id}`);
//   },

//   enrollStudent: (courseId: string, studentId: string): Promise<void> => {
//     return axiosClient.post(`/courses/${courseId}/enroll`, { studentId });
//   },

//   removeStudent: (courseId: string, studentId: string): Promise<void> => {
//     return axiosClient.delete(`/courses/${courseId}/students/${studentId}`);
//   },
// };