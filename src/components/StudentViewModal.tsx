import React, { useState } from "react";
import {
  GraduationCap,
  X,
  FileCheck,
  BookOpen,
  LineChart,
  Bell,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Student, Assignment, LearningMaterial, NotificationItem, ClassRoom } from "../types";

interface StudentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  assignments: Assignment[];
  materials: LearningMaterial[];
  notifications: NotificationItem[];
  classes: ClassRoom[];
  onDownloadMaterial: (mat: LearningMaterial) => void;
}

export const StudentViewModal: React.FC<StudentViewModalProps> = ({
  isOpen,
  onClose,
  students,
  assignments,
  materials,
  notifications,
  classes,
  onDownloadMaterial,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ""
  );
  const [activeTab, setActiveTab] = useState<"assignments" | "materials" | "grades" | "notifications">("assignments");

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  if (!currentStudent) return null;

  // Student specific data
  const studentAssignments = assignments.filter((a) =>
    a.classIds.includes(currentStudent.classId)
  );

  const studentMaterials = materials.filter((m) =>
    m.classIds.includes(currentStudent.classId)
  );

  const studentNotifications = notifications.filter((n) =>
    n.classIds.includes(currentStudent.classId) || n.classIds.includes("all")
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  GÓC NHÌN HỌC SINH
                </span>
                <span className="text-xs text-slate-500">Trường THPT Yên Viên</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Cổng Học Tập Dành Cho Học Sinh & Phụ Huynh
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Selector Switcher */}
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Mô phỏng học sinh:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code} - Lớp {s.className})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-600">
            Giáo viên phụ trách: <strong className="text-blue-700">Cô Khúc Thị Thu Thủy</strong>
          </div>
        </div>

        {/* Sub tabs */}
        <div className="flex space-x-2 border-b border-slate-200 mt-4 pb-2 flex-shrink-0">
          {[
            { id: "assignments", label: "Nhiệm vụ cần nộp", count: studentAssignments.length, icon: <FileCheck className="w-4 h-4" /> },
            { id: "materials", label: "Tài liệu & Bài giảng", count: studentMaterials.length, icon: <BookOpen className="w-4 h-4" /> },
            { id: "grades", label: "Bảng điểm cá nhân", icon: <LineChart className="w-4 h-4" /> },
            { id: "notifications", label: "Thông báo lớp", count: studentNotifications.length, icon: <Bell className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === t.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content area */}
        <div className="mt-4 overflow-y-auto flex-1 pr-1 space-y-3">
          {/* Tab 1: Assignments */}
          {activeTab === "assignments" && (
            <div className="space-y-3">
              {studentAssignments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">Chưa có nhiệm vụ nào được giao cho lớp {currentStudent.className}.</p>
              ) : (
                studentAssignments.map((asg) => {
                  const mySub = asg.submissions.find((s) => s.studentId === currentStudent.id);
                  const isSubmitted = mySub?.submitted;
                  return (
                    <div key={asg.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{asg.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{asg.description}</p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                            isSubmitted
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isSubmitted ? "Đã nộp bài" : "Chưa nộp bài"}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Hạn nộp: {asg.dueDate.replace("T", " ")}</span>
                        </div>
                        {isSubmitted && mySub?.score !== undefined && (
                          <div className="font-bold text-emerald-700 flex items-center gap-1">
                            <span>Điểm bài làm:</span>
                            <span className="text-sm font-black px-2 py-0.5 bg-emerald-100 rounded-md">
                              {mySub.score} / 10
                            </span>
                          </div>
                        )}
                      </div>

                      {mySub?.feedback && (
                        <div className="mt-2 p-2.5 bg-blue-50 rounded-xl text-xs text-blue-900 border border-blue-200 flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="block font-semibold">Nhận xét của cô Thủy:</strong>
                            <span>{mySub.feedback}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab 2: Materials */}
          {activeTab === "materials" && (
            <div className="space-y-3">
              {studentMaterials.map((mat) => (
                <div key={mat.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{mat.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{mat.subject} • {mat.topic}</p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1">{mat.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDownloadMaterial(mat)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải bài học</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Grades */}
          {activeTab === "grades" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Điểm tổng kết Môn Toán Học Kỳ
                </span>
                <div className="text-4xl font-black text-blue-900 mt-1">
                  {currentStudent.scores.average.toFixed(1)}
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Xếp loại: <strong className="font-bold">{currentStudent.scores.average >= 8 ? "Giỏi" : currentStudent.scores.average >= 6.5 ? "Khá" : "Đạt"}</strong> • Trạng thái: {currentStudent.status}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">TX 1 (x1)</div>
                  <div className="text-lg font-bold text-slate-800 mt-1">{currentStudent.scores.regular1}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">TX 2 (x1)</div>
                  <div className="text-lg font-bold text-slate-800 mt-1">{currentStudent.scores.regular2}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Giữa kỳ (x2)</div>
                  <div className="text-lg font-bold text-slate-800 mt-1">{currentStudent.scores.midterm}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Cuối kỳ (x3)</div>
                  <div className="text-lg font-bold text-slate-800 mt-1">{currentStudent.scores.finalExam}</div>
                </div>
              </div>

              {currentStudent.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-slate-700">
                  <strong className="block font-semibold text-amber-900 mb-0.5">Lời dặn của giáo viên:</strong>
                  {currentStudent.notes}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-3">
              {studentNotifications.map((notif) => (
                <div key={notif.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-bold text-rose-600">{notif.priority}</span>
                    <span>{notif.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
                  <p className="mt-1 text-xs text-slate-700 leading-relaxed whitespace-pre-line">{notif.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span>THPT Yên Viên • Hệ thống hỗ trợ dạy & học trực tuyến</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold cursor-pointer text-xs"
          >
            Quay lại giao diện giáo viên
          </button>
        </div>
      </div>
    </div>
  );
};
