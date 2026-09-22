import React from "react";
import {
  Users,
  FileCheck,
  BookOpen,
  LineChart,
  Bell,
  Clock,
  ArrowRight,
  TrendingUp,
  School,
  Sparkles,
  ChevronRight,
  PlusCircle,
  FileText,
  GraduationCap,
} from "lucide-react";
import { ClassRoom, Student, Assignment, LearningMaterial, NotificationItem, ActiveTab } from "../types";

interface DashboardViewProps {
  classes: ClassRoom[];
  students: Student[];
  assignments: Assignment[];
  materials: LearningMaterial[];
  notifications: NotificationItem[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectAssignment: (assignment: Assignment) => void;
  onOpenAddAssignment: () => void;
  onOpenAddNotification: () => void;
  onOpenAddMaterial: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  classes,
  students,
  assignments,
  materials,
  notifications,
  setActiveTab,
  onSelectAssignment,
  onOpenAddAssignment,
  onOpenAddNotification,
  onOpenAddMaterial,
}) => {
  // Compute key stats
  const totalClasses = classes.length;
  const totalStudents = students.length;
  const activeAssignments = assignments.filter((a) => a.status === "Đang thực hiện");
  
  // Calculate average completion rate across all assignments
  let totalSubmissions = 0;
  let totalAssignedExpected = 0;
  assignments.forEach((asg) => {
    totalAssignedExpected += asg.submissions.length;
    totalSubmissions += asg.submissions.filter((s) => s.submitted).length;
  });
  const overallCompletionRate =
    totalAssignedExpected > 0 ? Math.round((totalSubmissions / totalAssignedExpected) * 100) : 0;

  // Student learning status counts
  const positiveCount = students.filter((s) => s.status === "Tích cực").length;
  const normalCount = students.filter((s) => s.status === "Bình thường").length;
  const supportCount = students.filter((s) => s.status === "Cần hỗ trợ").length;
  const absentCount = students.filter((s) => s.status === "Vắng nhiều").length;

  // Recent tasks (first 4)
  const recentAssignments = assignments.slice(0, 4);
  // Recent announcements (first 3)
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-medium mb-3 backdrop-blur-xs">
            <School className="w-3.5 h-3.5 text-blue-200" />
            <span>Trường THPT Yên Viên • Hệ thống quản trị lớp học</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kính chào Cô Khúc Thị Thu Thủy
          </h2>
          <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
            Hôm nay lớp học có <strong className="text-white font-semibold">{totalClasses} lớp học</strong> đang theo dõi, với{" "}
            <strong className="text-white font-semibold">{activeAssignments.length} nhiệm vụ</strong> đang mở nộp bài. 
            Chúc cô có những giờ dạy hiệu quả và truyền cảm hứng!
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              id="dash-quick-assign"
              onClick={onOpenAddAssignment}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-800 text-sm font-bold shadow-sm hover:bg-blue-50 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-blue-700" />
              <span>Giao nhiệm vụ mới</span>
            </button>
            <button
              type="button"
              id="dash-quick-notif"
              onClick={onOpenAddNotification}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold border border-white/20 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Đăng thông báo lớp</span>
            </button>
            <button
              type="button"
              id="dash-quick-material"
              onClick={onOpenAddMaterial}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold border border-white/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Thêm tài liệu học tập</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Classes */}
        <div
          onClick={() => setActiveTab("classes")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng số lớp</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalClasses}</span>
            <span className="text-xs text-slate-500 font-medium">lớp THPT</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 truncate">
            {classes.map((c) => c.name).join(", ")}
          </p>
        </div>

        {/* Total Students */}
        <div
          onClick={() => setActiveTab("classes")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng học sinh</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalStudents}</span>
            <span className="text-xs text-slate-500 font-medium">học sinh</span>
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{positiveCount} em học tập tích cực</span>
          </p>
        </div>

        {/* Active Assignments */}
        <div
          onClick={() => setActiveTab("assignments")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nhiệm vụ đang giao</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-105 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activeAssignments.length}</span>
            <span className="text-xs text-slate-500 font-medium">bài tập đang mở</span>
          </div>
          <p className="mt-1 text-xs text-amber-700 font-medium">
            Tổng số: {assignments.length} nhiệm vụ
          </p>
        </div>

        {/* Completion Rate */}
        <div
          onClick={() => setActiveTab("grades")}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ lệ hoàn thành</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{overallCompletionRate}%</span>
            <span className="text-xs text-slate-500 font-medium">trung bình các lớp</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallCompletionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Progress Chart & Quick Feature Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Visual Progress Chart by Class */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-600" />
                <span>Tiến độ và Trạng thái Học tập Theo Lớp</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Thống kê tỷ lệ nộp bài và phân bố tinh thần học tập của các lớp
              </p>
            </div>
            <button
              onClick={() => setActiveTab("grades")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Xem chi tiết điểm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bars for each class */}
          <div className="space-y-4 mt-4">
            {classes.map((cls) => {
              const classStudents = students.filter((s) => s.classId === cls.id);
              // Calculate completion for this class
              let classSubmissions = 0;
              let classAssignedExpected = 0;
              assignments
                .filter((a) => a.classIds.includes(cls.id))
                .forEach((a) => {
                  const filtered = a.submissions.filter((sub) =>
                    classStudents.some((st) => st.id === sub.studentId)
                  );
                  classAssignedExpected += filtered.length;
                  classSubmissions += filtered.filter((s) => s.submitted).length;
                });
              const classRate =
                classAssignedExpected > 0 ? Math.round((classSubmissions / classAssignedExpected) * 100) : 75;

              // Calculate class grade average
              const totalClassAvg =
                classStudents.length > 0
                  ? (
                      classStudents.reduce((acc, st) => acc + st.scores.average, 0) / classStudents.length
                    ).toFixed(1)
                  : "0.0";

              return (
                <div key={cls.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm sm:text-base">Lớp {cls.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-medium">
                        {classStudents.length} học sinh
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 flex items-center gap-3">
                      <span>ĐTB: <strong className="text-blue-700">{totalClassAvg}</strong></span>
                      <span>Hoàn thành: <strong className="text-emerald-700">{classRate}%</strong></span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className="bg-blue-600 h-2.5 rounded-l-full transition-all duration-300"
                      style={{ width: `${classRate}%` }}
                      title={`Tỷ lệ hoàn thành nhiệm vụ: ${classRate}%`}
                    ></div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Phòng: {cls.room}</span>
                    <span>GVCN: {cls.homeroomTeacher}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Status Summary Pills */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
              Phân loại trạng thái học tập toàn bộ {totalStudents} học sinh:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800">Tích cực</span>
                <div className="text-lg font-bold text-emerald-700">{positiveCount} em</div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-xs font-semibold text-blue-800">Bình thường</span>
                <div className="text-lg font-bold text-blue-700">{normalCount} em</div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-xs font-semibold text-amber-800">Cần hỗ trợ</span>
                <div className="text-lg font-bold text-amber-700">{supportCount} em</div>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-xs font-semibold text-rose-800">Vắng nhiều</span>
                <div className="text-lg font-bold text-rose-700">{absentCount} em</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Quick Navigation Shortcuts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Truy cập nhanh 5 tính năng</h3>
            <p className="text-xs text-slate-500 mb-4">Điều hướng trực tiếp vào từng chức năng quản lý</p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setActiveTab("classes")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-800 font-medium text-sm transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">1. Quản lý Lớp & Học sinh</div>
                    <div className="text-[11px] text-slate-500">{totalStudents} học sinh, {totalClasses} lớp</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("assignments")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-800 font-medium text-sm transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">2. Giao & Quản lý Nhiệm vụ</div>
                    <div className="text-[11px] text-slate-500">{assignments.length} nhiệm vụ đã tạo</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("materials")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-800 font-medium text-sm transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">3. Kho Tài liệu Học tập</div>
                    <div className="text-[11px] text-slate-500">{materials.length} chuyên đề, slide bài giảng</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("grades")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-800 font-medium text-sm transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">4. Theo dõi Điểm & Tiến độ</div>
                    <div className="text-[11px] text-slate-500">ĐTB, xếp loại, biểu đồ học lực</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("notifications")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-800 font-medium text-sm transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">5. Bảng Thông báo Lớp</div>
                    <div className="text-[11px] text-slate-500">{notifications.length} bản tin học tập</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs leading-relaxed">
            <span className="font-bold block mb-1">Mẹo trình chiếu THPT Yên Viên:</span>
            Bật nút <strong>"Máy chiếu: Bật"</strong> ở góc phải trên để phóng to chữ và tăng độ tương phản khi kết nối máy chiếu trên lớp.
          </div>
        </div>
      </div>

      {/* Recent Assignments and Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Nhiệm vụ học tập gần đây</h3>
            </div>
            <button
              onClick={() => setActiveTab("assignments")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả ({assignments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentAssignments.map((asg) => {
              const submittedCount = asg.submissions.filter((s) => s.submitted).length;
              const totalSubs = asg.submissions.length;
              return (
                <div
                  key={asg.id}
                  onClick={() => {
                    onSelectAssignment(asg);
                    setActiveTab("assignments");
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {asg.title}
                    </h4>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${
                        asg.status === "Đang thực hiện"
                          ? "bg-amber-100 text-amber-800"
                          : asg.status === "Đã hoàn thành"
                          ? "bg-emerald-100 text-emerald-800"
                          : asg.status === "Quá hạn"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {asg.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500 line-clamp-1">{asg.description}</p>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Lớp: {asg.classNames.join(", ")}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hạn: {asg.dueDate.replace("T", " ")}</span>
                      </span>
                      <span className="font-semibold text-blue-700">
                        {submittedCount}/{totalSubs} đã nộp
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Thông báo mới gửi học sinh</h3>
            </div>
            <button
              onClick={() => setActiveTab("notifications")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả ({notifications.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => setActiveTab("notifications")}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 animate-pulse"></span>
                    )}
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{notif.title}</h4>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${
                      notif.priority === "Khẩn cấp"
                        ? "bg-rose-100 text-rose-800"
                        : notif.priority === "Quan trọng"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {notif.priority}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {notif.content}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
                  <span>Gửi tới: {notif.classNames.join(", ")}</span>
                  <span>{notif.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
