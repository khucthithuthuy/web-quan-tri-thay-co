export interface ClassRoom {
  id: string;
  name: string; // e.g. "12A1"
  grade: "10" | "11" | "12";
  room: string; // e.g. "Phòng 201"
  homeroomTeacher: string; // GVCN
  academicYear: string; // "2024 - 2025"
  description?: string;
}

export type StudentStatus = "Tích cực" | "Bình thường" | "Cần hỗ trợ" | "Vắng nhiều";

export interface Student {
  id: string;
  code: string; // e.g. "YV-1201"
  name: string;
  classId: string;
  className: string;
  gender: "Nam" | "Nữ";
  status: StudentStatus;
  phone?: string;
  email?: string;
  notes?: string;
  scores: {
    regular1: number; // ĐĐGtx 1
    regular2: number; // ĐĐGtx 2
    midterm: number;  // ĐĐGgk
    finalExam: number;// ĐĐGck
    average: number;  // ĐTB
  };
}

export type AssignmentStatus = "Chưa giao" | "Đang thực hiện" | "Đã hoàn thành" | "Quá hạn";

export interface StudentSubmission {
  studentId: string;
  studentName: string;
  studentCode: string;
  submitted: boolean;
  submittedAt?: string;
  score?: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classIds: string[]; // Classes this task is assigned to
  classNames: string[];
  dueDate: string; // YYYY-MM-DD or readable string
  assignedDate: string;
  status: AssignmentStatus;
  maxScore: number;
  submissions: StudentSubmission[];
}

export type MaterialType = "pdf" | "docx" | "pptx" | "link" | "video";

export interface LearningMaterial {
  id: string;
  title: string;
  subject: string;
  topic: string;
  classIds: string[];
  classNames: string[];
  description: string;
  fileType: MaterialType;
  fileSize?: string;
  linkOrFileName: string;
  dateAdded: string;
  downloads: number;
}

export type NotificationPriority = "Bình thường" | "Quan trọng" | "Khẩn cấp";

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  classIds: string[]; // ["all"] or specific classIds
  classNames: string[];
  timestamp: string;
  isRead: boolean;
  priority: NotificationPriority;
}

export type ActiveTab = "dashboard" | "classes" | "assignments" | "materials" | "grades" | "notifications";
