/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { DashboardView } from "./components/DashboardView";
import { ClassesAndStudentsView } from "./components/ClassesAndStudentsView";
import { AssignmentsView } from "./components/AssignmentsView";
import { MaterialsView } from "./components/MaterialsView";
import { GradesAndProgressView } from "./components/GradesAndProgressView";
import { NotificationsView } from "./components/NotificationsView";
import { StudentViewModal } from "./components/StudentViewModal";
import { ToastContainer, ToastMessage } from "./components/Toast";
import { ConfirmModal } from "./components/ConfirmModal";
import { sound } from "./utils/sound";
import {
  initialClasses,
  initialStudents,
  initialAssignments,
  initialMaterials,
  initialNotifications,
} from "./data/initialData";
import {
  ActiveTab,
  ClassRoom,
  Student,
  Assignment,
  LearningMaterial,
  NotificationItem,
} from "./types";

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  // Projector mode
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(() => {
    return localStorage.getItem("yv_projector_mode") === "true";
  });

  // Sound muted state
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Student view preview modal
  const [isStudentViewOpen, setIsStudentViewOpen] = useState<boolean>(false);

  // Core Data States (with localStorage persistence)
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem("yv_classes_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialClasses;
      }
    }
    return initialClasses;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("yv_students_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialStudents;
      }
    }
    return initialStudents;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem("yv_assignments_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialAssignments;
      }
    }
    return initialAssignments;
  });

  const [materials, setMaterials] = useState<LearningMaterial[]>(() => {
    const saved = localStorage.getItem("yv_materials_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialMaterials;
      }
    }
    return initialMaterials;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("yv_notifications_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialNotifications;
      }
    }
    return initialNotifications;
  });

  // Active assignment for detail inspection
  const [selectedAssignmentDetail, setSelectedAssignmentDetail] = useState<Assignment | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Confirm Modal state
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Auto-sync to localStorage
  useEffect(() => {
    localStorage.setItem("yv_classes_data", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("yv_students_data", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("yv_assignments_data", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("yv_materials_data", JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem("yv_notifications_data", JSON.stringify(notifications));
  }, [notifications]);

  // Toast helper
  const addToast = (type: "success" | "warning" | "info", message: string) => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const newMuted = sound.toggleMute();
    setIsMuted(newMuted);
    addToast("info", newMuted ? "Đã tắt âm thanh thông báo" : "Đã bật âm thanh thông báo");
    if (!newMuted) sound.playSuccess();
  };

  // Toggle Projector Mode
  const handleToggleProjectorMode = () => {
    setIsProjectorMode((prev) => {
      const next = !prev;
      localStorage.setItem("yv_projector_mode", next ? "true" : "false");
      addToast(
        "info",
        next
          ? "Đã bật chế độ Máy chiếu (Cỡ chữ lớn & Độ tương phản cao)"
          : "Đã chuyển về chế độ hiển thị tiêu chuẩn"
      );
      sound.playClick();
      return next;
    });
  };

  // Reset all data to default
  const handleResetData = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Đặt lại toàn bộ dữ liệu mẫu?",
      message:
        "Thao tác này sẽ khôi phục lại dữ liệu danh sách học sinh, bài tập, tài liệu và thông báo mẫu ban đầu của trường THPT Yên Viên. Dữ liệu chỉnh sửa trước đó sẽ bị xóa.",
      confirmLabel: "Đặt lại dữ liệu",
      onConfirm: () => {
        setClasses(initialClasses);
        setStudents(initialStudents);
        setAssignments(initialAssignments);
        setMaterials(initialMaterials);
        setNotifications(initialNotifications);
        setSelectedAssignmentDetail(null);
        localStorage.removeItem("yv_classes_data");
        localStorage.removeItem("yv_students_data");
        localStorage.removeItem("yv_assignments_data");
        localStorage.removeItem("yv_materials_data");
        localStorage.removeItem("yv_notifications_data");
        sound.playDelete();
        addToast("success", "Đã khôi phục thành công toàn bộ dữ liệu mẫu ban đầu!");
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Student Operations
  const handleAddStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    sound.playSuccess();
    addToast("success", `Đã thêm học sinh ${newStudent.name} (${newStudent.code}) vào lớp ${newStudent.className}`);
  };

  const handleEditStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    sound.playSuccess();
    addToast("success", `Đã cập nhật thông tin học sinh ${updatedStudent.name}`);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Xóa học sinh khỏi danh sách?",
      message: `Cô có chắc chắn muốn xóa học sinh "${name}" không? Thao tác này không thể hoàn tác.`,
      confirmLabel: "Xóa học sinh",
      onConfirm: () => {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        sound.playDelete();
        addToast("warning", `Đã xóa học sinh ${name} khỏi hệ thống.`);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Class Operations
  const handleAddClass = (classData: Omit<ClassRoom, "id">) => {
    const newClass: ClassRoom = {
      ...classData,
      id: `cls-${Date.now()}`,
    };
    setClasses((prev) => [...prev, newClass]);
    sound.playSuccess();
    addToast("success", `Đã tạo thành công lớp học mới: Lớp ${newClass.name}`);
  };

  const handleEditClass = (updatedClass: ClassRoom) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
    sound.playSuccess();
    addToast("success", `Đã cập nhật thông tin Lớp ${updatedClass.name}`);
  };

  const handleDeleteClass = (id: string, name: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: `Xóa Lớp ${name}?`,
      message: `Cô có chắc chắn muốn xóa lớp học "${name}" không? Tất cả học sinh thuộc lớp này cũng sẽ cần được chuyển sang lớp khác.`,
      confirmLabel: "Xác nhận xóa lớp",
      onConfirm: () => {
        setClasses((prev) => prev.filter((c) => c.id !== id));
        sound.playDelete();
        addToast("warning", `Đã xóa Lớp ${name}`);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Assignment Operations
  const handleAddAssignment = (assignmentData: Omit<Assignment, "id">) => {
    const newAsg: Assignment = {
      ...assignmentData,
      id: `asg-${Date.now()}`,
    };
    setAssignments((prev) => [newAsg, ...prev]);
    sound.playSuccess();
    addToast("success", `Đã giao nhiệm vụ: "${newAsg.title}"`);
  };

  const handleEditAssignment = (updatedAsg: Assignment) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === updatedAsg.id ? updatedAsg : a))
    );
    sound.playSuccess();
    addToast("success", `Đã cập nhật nhiệm vụ: "${updatedAsg.title}"`);
  };

  const handleDeleteAssignment = (id: string, title: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Xóa nhiệm vụ học tập?",
      message: `Cô có chắc chắn muốn xóa bài tập "${title}"? Dữ liệu nộp bài của học sinh đối với bài tập này sẽ bị xóa.`,
      confirmLabel: "Xóa nhiệm vụ",
      onConfirm: () => {
        setAssignments((prev) => prev.filter((a) => a.id !== id));
        if (selectedAssignmentDetail?.id === id) {
          setSelectedAssignmentDetail(null);
        }
        sound.playDelete();
        addToast("warning", `Đã xóa nhiệm vụ: "${title}"`);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Material Operations
  const handleAddMaterial = (materialData: Omit<LearningMaterial, "id">) => {
    const newMat: LearningMaterial = {
      ...materialData,
      id: `mat-${Date.now()}`,
    };
    setMaterials((prev) => [newMat, ...prev]);
    sound.playSuccess();
    addToast("success", `Đã thêm tài liệu mới: "${newMat.title}"`);
  };

  const handleEditMaterial = (updatedMat: LearningMaterial) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === updatedMat.id ? updatedMat : m))
    );
    sound.playSuccess();
    addToast("success", `Đã cập nhật tài liệu: "${updatedMat.title}"`);
  };

  const handleDeleteMaterial = (id: string, title: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Xóa tài liệu khỏi kho?",
      message: `Cô có chắc muốn xóa tệp tài liệu "${title}" không?`,
      confirmLabel: "Xóa tài liệu",
      onConfirm: () => {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        sound.playDelete();
        addToast("warning", `Đã xóa tài liệu: "${title}"`);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDownloadMaterial = (mat: LearningMaterial) => {
    // Increment download count
    setMaterials((prev) =>
      prev.map((m) => (m.id === mat.id ? { ...m, downloads: m.downloads + 1 } : m))
    );
    sound.playClick();
    addToast("info", `Đang mở tệp "${mat.linkOrFileName}" (${mat.fileSize})`);
  };

  // Grade update
  const handleUpdateStudentScores = (studentId: string, newScores: Student["scores"]) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, scores: newScores } : s))
    );
    sound.playSuccess();
    addToast("success", "Đã cập nhật bảng điểm học sinh thành công!");
  };

  // Export grades
  const handleExportGrades = (className: string) => {
    sound.playClick();
    addToast("success", `Đã xuất bảng điểm ${className} sang định dạng sẵn sàng in/lưu trữ!`);
    window.print();
  };

  // Notification Operations
  const handleAddNotification = (notifData: Omit<NotificationItem, "id">) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    sound.playSuccess();
    addToast("success", `Đã phát thông báo mới: "${newNotif.title}"`);
  };

  const handleEditNotification = (updatedNotif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n))
    );
    sound.playSuccess();
    addToast("success", `Đã cập nhật thông báo: "${updatedNotif.title}"`);
  };

  const handleDeleteNotification = (id: string, title: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Xóa thông báo này?",
      message: `Cô có chắc muốn xóa thông báo "${title}" không?`,
      confirmLabel: "Xóa thông báo",
      onConfirm: () => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        sound.playDelete();
        addToast("warning", `Đã xóa thông báo.`);
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
    sound.playClick();
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    sound.playSuccess();
    addToast("info", "Đã đánh dấu đã đọc tất cả thông báo.");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={`min-h-screen bg-slate-100/70 text-slate-900 ${isProjectorMode ? "projector-mode" : ""}`}>
      {/* Navbar with 5 main feature tabs + tools */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          sound.playClick();
          setActiveTab(tab);
        }}
        unreadCount={unreadCount}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isProjectorMode={isProjectorMode}
        onToggleProjectorMode={handleToggleProjectorMode}
        onOpenStudentView={() => {
          sound.playClick();
          setIsStudentViewOpen(true);
        }}
        onResetData={handleResetData}
      />

      {/* Main Content View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "dashboard" && (
          <DashboardView
            classes={classes}
            students={students}
            assignments={assignments}
            materials={materials}
            notifications={notifications}
            setActiveTab={(tab) => {
              sound.playClick();
              setActiveTab(tab);
            }}
            onSelectAssignment={(asg) => {
              setSelectedAssignmentDetail(asg);
            }}
            onOpenAddAssignment={() => {
              setActiveTab("assignments");
            }}
            onOpenAddNotification={() => {
              setActiveTab("notifications");
            }}
            onOpenAddMaterial={() => {
              setActiveTab("materials");
            }}
          />
        )}

        {activeTab === "classes" && (
          <ClassesAndStudentsView
            classes={classes}
            students={students}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
            onAddClass={handleAddClass}
            onEditClass={handleEditClass}
            onDeleteClass={handleDeleteClass}
          />
        )}

        {activeTab === "assignments" && (
          <AssignmentsView
            assignments={assignments}
            classes={classes}
            students={students}
            onAddAssignment={handleAddAssignment}
            onEditAssignment={handleEditAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            selectedAssignmentDetail={selectedAssignmentDetail}
            onSelectAssignmentDetail={setSelectedAssignmentDetail}
          />
        )}

        {activeTab === "materials" && (
          <MaterialsView
            materials={materials}
            classes={classes}
            onAddMaterial={handleAddMaterial}
            onEditMaterial={handleEditMaterial}
            onDeleteMaterial={handleDeleteMaterial}
            onDownloadMaterial={handleDownloadMaterial}
          />
        )}

        {activeTab === "grades" && (
          <GradesAndProgressView
            classes={classes}
            students={students}
            assignments={assignments}
            onUpdateStudentScores={handleUpdateStudentScores}
            onExportGrades={handleExportGrades}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationsView
            notifications={notifications}
            classes={classes}
            onAddNotification={handleAddNotification}
            onEditNotification={handleEditNotification}
            onDeleteNotification={handleDeleteNotification}
            onToggleRead={handleToggleRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>TRỢ LÝ QUẢN TRỊ HỌC TẬP</strong> – TRƯỜNG THPT YÊN VIÊN (NĂM HỌC 2024 - 2025)
          </div>
          <div>
            Giáo viên phụ trách: <span className="font-semibold text-slate-800">Cô Khúc Thị Thu Thủy</span>
          </div>
        </div>
      </footer>

      {/* Student View Modal */}
      <StudentViewModal
        isOpen={isStudentViewOpen}
        onClose={() => setIsStudentViewOpen(false)}
        students={students}
        assignments={assignments}
        materials={materials}
        notifications={notifications}
        classes={classes}
        onDownloadMaterial={handleDownloadMaterial}
      />

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmLabel}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
