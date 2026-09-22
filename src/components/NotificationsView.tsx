import React, { useState } from "react";
import {
  Bell,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertTriangle,
  Clock,
  Send,
  X,
  Users,
  Eye,
} from "lucide-react";
import { NotificationItem, NotificationPriority, ClassRoom } from "../types";

interface NotificationsViewProps {
  notifications: NotificationItem[];
  classes: ClassRoom[];
  onAddNotification: (notif: Omit<NotificationItem, "id">) => void;
  onEditNotification: (notif: NotificationItem) => void;
  onDeleteNotification: (id: string, title: string) => void;
  onToggleRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  classes,
  onAddNotification,
  onEditNotification,
  onDeleteNotification,
  onToggleRead,
  onMarkAllAsRead,
}) => {
  const [filterClassId, setFilterClassId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<NotificationItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formClassIds, setFormClassIds] = useState<string[]>([]);
  const [formPriority, setFormPriority] = useState<NotificationPriority>("Quan trọng");

  const openAdd = () => {
    setEditingNotification(null);
    setFormTitle("");
    setFormContent("");
    setFormClassIds(classes.map((c) => c.id)); // Default all classes
    setFormPriority("Quan trọng");
    setIsModalOpen(true);
  };

  const openEdit = (notif: NotificationItem) => {
    setEditingNotification(notif);
    setFormTitle(notif.title);
    setFormContent(notif.content);
    setFormClassIds(notif.classIds);
    setFormPriority(notif.priority);
    setIsModalOpen(true);
  };

  const handleToggleClass = (classId: string) => {
    if (formClassIds.includes(classId)) {
      if (formClassIds.length > 1) {
        setFormClassIds(formClassIds.filter((id) => id !== classId));
      }
    } else {
      setFormClassIds([...formClassIds, classId]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim() || formClassIds.length === 0) return;

    const selectedClassNames = classes
      .filter((c) => formClassIds.includes(c.id))
      .map((c) => c.name);

    if (editingNotification) {
      onEditNotification({
        ...editingNotification,
        title: formTitle.trim(),
        content: formContent.trim(),
        classIds: formClassIds,
        classNames: selectedClassNames,
        priority: formPriority,
      });
    } else {
      const nowStr = new Date().toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      onAddNotification({
        title: formTitle.trim(),
        content: formContent.trim(),
        classIds: formClassIds,
        classNames: selectedClassNames,
        timestamp: `Hôm nay lúc ${nowStr.split(" ")[0]}`,
        isRead: false,
        priority: formPriority,
      });
    }
    setIsModalOpen(false);
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchClass =
      filterClassId === "all" || notif.classIds.includes(filterClassId);
    const matchSearch =
      searchQuery.trim() === "" ||
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <span>Bảng Thông Báo Lớp Học</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Gửi thông tri, nhắc nhở nộp bài và thông báo lịch kiểm tra đến học sinh các lớp
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Đánh dấu đã đọc tất cả</span>
            </button>
          )}

          <button
            type="button"
            id="btn-add-notif"
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo thông báo mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-notif-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề hoặc nội dung..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400">Lọc theo lớp:</span>
          <select
            value={filterClassId}
            onChange={(e) => setFilterClassId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
          >
            <option value="all">Tất cả các lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Lớp {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">Chưa có thông báo nào</p>
            <p className="text-xs text-slate-500 mt-1">Bấm "Tạo thông báo mới" để gửi tin nhắn đến các lớp</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all ${
                !notif.isRead
                  ? "bg-blue-50/40 border-blue-300 shadow-xs"
                  : "bg-white border-slate-200 shadow-xs hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {!notif.isRead ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      Mới
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">Đã xem</span>
                  )}

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      notif.priority === "Khẩn cấp"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : notif.priority === "Quan trọng"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {notif.priority}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {notif.classNames.map((cName) => (
                      <span
                        key={cName}
                        className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold"
                      >
                        Lớp {cName}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{notif.timestamp}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onToggleRead(notif.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                    title={notif.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(notif)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                    title="Chỉnh sửa thông báo"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNotification(notif.id, notif.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug">
                {notif.title}
              </h3>

              <p className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {notif.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add/Edit Notification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span>{editingNotification ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề thông báo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="VD: Thông báo kiểm tra 15 phút tuần tới"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lớp nhận thông báo <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {classes.map((c) => {
                    const isChecked = formClassIds.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => handleToggleClass(c.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        Lớp {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mức độ ưu tiên</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as NotificationPriority)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Bình thường">Bình thường</option>
                  <option value="Quan trọng">Quan trọng</option>
                  <option value="Khẩn cấp">Khẩn cấp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung thông báo chi tiết <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Ghi rõ thông tin dặn dò, thời gian, hình thức và các lưu ý cho học sinh..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{editingNotification ? "Lưu thay đổi" : "Phát thông báo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
