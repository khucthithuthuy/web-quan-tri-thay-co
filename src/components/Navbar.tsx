import React from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  FileCheck,
  BookOpen,
  LineChart,
  Bell,
  Volume2,
  VolumeX,
  Tv,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { ActiveTab } from "../types";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isProjectorMode: boolean;
  onToggleProjectorMode: () => void;
  onOpenStudentView: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  isMuted,
  onToggleMute,
  isProjectorMode,
  onToggleProjectorMode,
  onOpenStudentView,
  onResetData,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "dashboard", label: "Tổng quan", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "classes", label: "Lớp & Học sinh", icon: <Users className="w-5 h-5" /> },
    { id: "assignments", label: "Giao nhiệm vụ", icon: <FileCheck className="w-5 h-5" /> },
    { id: "materials", label: "Kho tài liệu", icon: <BookOpen className="w-5 h-5" /> },
    { id: "grades", label: "Điểm & Tiến độ", icon: <LineChart className="w-5 h-5" /> },
    {
      id: "notifications",
      label: "Thông báo",
      icon: <Bell className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with Teacher and School info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                THPT YÊN VIÊN
              </span>
              <span className="text-xs text-slate-500 font-medium">Năm học 2024 - 2025</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              TRỢ LÝ QUẢN TRỊ HỌC TẬP
            </h1>
          </div>
        </div>

        {/* Teacher profile & Quick tools */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Giáo viên:</span>
            <strong className="text-slate-900 font-semibold">Khúc Thị Thu Thủy</strong>
          </div>

          {/* Student view toggle button */}
          <button
            type="button"
            id="btn-student-view"
            onClick={onOpenStudentView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Xem giao diện góc nhìn của học sinh"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Góc Học sinh</span>
          </button>

          {/* Projector mode toggle */}
          <button
            type="button"
            id="btn-projector-mode"
            onClick={onToggleProjectorMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
              isProjectorMode
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
            title="Chế độ chiếu máy chiếu (chữ to, dễ quan sát)"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Máy chiếu:</span>
            <span>{isProjectorMode ? "Bật" : "Tắt"}</span>
          </button>

          {/* Sound toggle button */}
          <button
            type="button"
            id="btn-toggle-sound"
            onClick={onToggleMute}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              isMuted
                ? "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            }`}
            title={isMuted ? "Âm thanh đang tắt (Bấm để bật)" : "Âm thanh đang bật (Bấm để tắt)"}
            aria-label="Bật tắt âm thanh"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset sample data button */}
          <button
            type="button"
            id="btn-reset-data"
            onClick={onResetData}
            className="p-2 rounded-xl text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="Đặt lại toàn bộ dữ liệu mẫu ban đầu"
            aria-label="Đặt lại dữ liệu mẫu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 5 Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar" aria-label="Điều hướng chính">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? "bg-white text-blue-700" : "bg-rose-500 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
