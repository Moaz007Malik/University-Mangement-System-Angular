export interface User {
  id: string;
  USER_ID: number;
  USER_NAME: string;
  USER_EMAIL: string;
  USER_PASSWORD: string;
  USER_TYPE: 'student' | 'teacher' | 'faculty';
  IS_AUTH_TO_REG: boolean;
  COURSES: { id: string }[];
}

export interface Courses {
  id: string;
  COURSE_ID: number;
  COURSE_NAME: string;
  COURSE_DESC: string;
  COURSE_CODE: string;
  COURSE_TEACHER?: { id: string }[];
  COURSE_STUDENTS?: { studentId: string }[];
  teacherNames?: string;
}

export interface CourseRequest {
  id?: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  type: 'enroll' | 'drop';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: any;
}

export interface Quiz {
  id?: string;
  title: string;
  type: 'quiz' | 'assignment';
  courseId: string;
  teacherId: string;
  createdAt: any;
  dueDate: any;
  description: string;
}

export interface GradeEntry {
  id?: string;
  studentId: string;
  courseId: string;
  type: 'Quiz' | 'Assignment';
  title: string;
  date: string;
  marks: number;
}

export interface TimeSlot {
  id?: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  teacherId: string;
  studentId: string[];
  rooms: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface Teacher {
  USER_NAME: string;
  id?: string;
  name: string;
  email: string;
  USER_TYPE: string;
}
