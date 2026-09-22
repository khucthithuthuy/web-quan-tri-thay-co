import React, { useState } from "react";
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Users,
  X,
  ExternalLink,
  Award,
  MessageSquare,
} from "lucide-react";
import { Assignment, AssignmentStatus, ClassRoom, Student } from "../types";

interface AssignmentsViewProps {
  assignments: Assignment[];
  classes: ClassRoom[];
  students: Student[];
  onAddAssignment: (assignment: Omit<Assignment, "id">) => void;
  onEditAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string, title: string) => void;
  selectedAssignmentDetail: Assignment | null;
  onSelectAssignmentDetail: (assignment: Assignment | null) => void;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  classes,
  students,
  onAddAssignment,
  onEditAssignment,
  onDeleteAssignment,
  selectedAssignmentDetail,
  onSelectAssignmentDetail,
}) => {
  // Filter states
  const [filterClassId, setFilterClassId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal create/edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formClassIds, setFormClassIds] = useState<string[]>([]);
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState<AssignmentStatus>("Đang thực hiện");
  const [formMaxScore, setFormMaxScore] = useState(10);

  // Open Add Assignment
  const openAdd = () => {
    setEditingAssignment(null);
    setFormTitle("");
    setFormDescription("");
    setFormClassIds(classes.length > 0 ? [classes[0].id] : []);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 5);
    setFormDueDate(tomorrow.toISOString().slice(0, 16));
    setFormStatus("Đang thực hiện");
    setFormMaxScore(10);
    setIsModalOpen(true);
  };

  // Open Edit Assignment
  const openEdit = (asg: Assignment) => {
    setEditingAssignment(asg);
    setFormTitle(asg.title);
    setFormDescription(asg.description);
    setFormClassIds(asg.classIds);
    setFormDueDate(asg.dueDate);
    setFormStatus(asg.status);
    setFormMaxScore(asg.maxScore || 10);
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
    if (!formTitle.trim() || formClassIds.length === 0) return;

    const selectedClassNames = classes
      .filter((c) => formClassIds.includes(c.id))
      .map((c) => c.name);

    if (editingAssignment) {
      onEditAssignment({
        ...editingAssignment,
        title: formTitle.trim(),
        description: formDescription.trim(),
        classIds: formClassIds,
        classNames: selectedClassNames,
        dueDate: formDueDate,
        status: formStatus,
        maxScore: formMaxScore,
      });
    } else {
      // Build initial submissions list for target classes
      const assignedStudents = students.filter((s) => formClassIds.includes(s.classId));
      const submissions = assignedStudents.map((st) => ({
        studentId: st.id,
        studentName: st.name,
        studentCode: st.code,
        submitted: false,
      }));

      onAddAssignment({
        title: formTitle.trim(),
        description: formDescription.trim(),
        classIds: formClassIds,
        classNames: selectedClassNames,
        dueDate: formDueDate || new Date().toISOString().slice(0, 16),
        assignedDate: new Date().toISOString().slice(0, 10),
        status: formStatus,
        maxScore: formMaxScore,
        submissions,
      });
    }
    setIsModalOpen(false);
  };

  // Submissions toggle within Detail modal
  const handleToggleSubmission = (studentId: string) => {
    if (!selectedAssignmentDetail) return;
    const updated = {
      ...selectedAssignmentDetail,
      submissions: selectedAssignmentDetail.submissions.map((sub) => {
        if (sub.studentId === studentId) {
          const nextState = !sub.submitted;
          return {
            ...sub,
            submitted: nextState,
            submittedAt: nextState ? new Date().toLocaleString("vi-VN") : undefined,
            score: nextState ? (sub.score !== undefined ? sub.score : 8.5) : undefined,
          };
        }
        return sub;
      }),
    };
    onEditAssignment(updated);
    onSelectAssignmentDetail(updated);
  };

  const handleUpdateScore = (studentId: string, newScore: number) => {
    if (!selectedAssignmentDetail) return;
    const updated = {
      ...selectedAssignmentDetail,
      submissions: selectedAssignmentDetail.submissions.map((sub) =>
        sub.studentId === studentId ? { ...sub, score: newScore } : sub
      ),
    };
    onEditAssignment(updated);
    onSelectAssignmentDetail(updated);
  };

  const handleUpdateFeedback = (studentId: string, feedback: string) => {
    if (!selectedAssignmentDetail) return;
    const updated = {
      ...selectedAssignmentDetail,
      submissions: selectedAssignmentDetail.submissions.map((sub) =>
        sub.studentId === studentId ? { ...sub, feedback } : sub
      ),
    };
    onEditAssignment(updated);
    onSelectAssignmentDetail(updated);
  };

  // Filter list
  const filteredAssignments = assignments.filter((asg) => {
    const matchClass =
      filterClassId === "all" || asg.classIds.includes(filterClassId);
    const matchStatus =
      filterStatus === "all" || asg.status === filterStatus;
    const matchSearch =
      searchQuery.trim() === "" ||
      asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-blue-600" />
            <span>Giao & Quản Lý Nhiệm Vụ Học Tập</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Giao bài tập, thiết lập thời hạn nộp bài và theo dõi tiến độ nộp bài của học sinh
          </p>
        </div>

        <button
          type="button"
          id="btn-create-assignment"
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo nhiệm vụ mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-assignment-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề nhiệm vụ..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Class filter */}
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

          {/* Status filter buttons */}
          <div className="flex items-center gap-1">
            {[
              { id: "all", label: "Tất cả" },
              { id: "Đang thực hiện", label: "Đang thực hiện" },
              { id: "Chưa giao", label: "Chưa giao" },
              { id: "Đã hoàn thành", label: "Đã hoàn thành" },
              { id: "Quá hạn", label: "Quá hạn" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === st.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200">
            <FileCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">Chưa tìm thấy nhiệm vụ nào phù hợp</p>
            <p className="text-xs text-slate-500 mt-1">Bấm "Tạo nhiệm vụ mới" để giao bài tập cho học sinh</p>
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const submittedCount = asg.submissions.filter((s) => s.submitted).length;
            const totalAssigned = asg.submissions.length;
            const percentage =
              totalAssigned > 0 ? Math.round((submittedCount / totalAssigned) * 100) : 0;

            return (
              <div
                key={asg.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {asg.classNames.map((cName) => (
                        <span
                          key={cName}
                          className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"
                        >
                          Lớp {cName}
                        </span>
                      ))}
                      <span className="text-xs text-slate-400">
                        Giao ngày: {asg.assignedDate}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        asg.status === "Đang thực hiện"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : asg.status === "Đã hoàn thành"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : asg.status === "Quá hạn"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {asg.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {asg.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {asg.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  {/* Progress info */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Tiến độ nộp bài:</span>
                    <span className="font-bold text-slate-800">
                      {submittedCount}/{totalAssigned} học sinh ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentage === 100
                          ? "bg-emerald-500"
                          : percentage > 50
                          ? "bg-blue-600"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hạn nộp: <strong className="text-slate-700">{asg.dueDate.replace("T", " ")}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectAssignmentDetail(asg)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                        title="Xem chi tiết bài nộp của học sinh"
                      >
                        Chấm & Duyệt bài
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(asg)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Chỉnh sửa nhiệm vụ"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteAssignment(asg.id, asg.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Xóa nhiệm vụ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create / Edit Assignment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>{editingAssignment ? "Chỉnh sửa nhiệm vụ" : "Giao nhiệm vụ mới"}</span>
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
                  Tiêu đề nhiệm vụ / Bài tập <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="VD: Ôn tập chuyên đề Khảo sát hàm số bậc ba"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lớp áp dụng <span className="text-rose-500">*</span> (Có thể chọn nhiều lớp)
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hạn nộp bài <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as AssignmentStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Chưa giao">Chưa giao</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Quá hạn">Quá hạn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả và yêu cầu chi tiết</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ghi rõ số lượng câu hỏi, hình thức nộp bài (ảnh chụp, file Word hay nộp tại lớp)..."
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
                  className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold cursor-pointer shadow-sm"
                >
                  {editingAssignment ? "Lưu thay đổi" : "Tạo và giao nhiệm vụ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assignment Detail & Student Submissions Checklist */}
      {selectedAssignmentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">
                    Lớp {selectedAssignmentDetail.classNames.join(", ")}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      selectedAssignmentDetail.status === "Đang thực hiện"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {selectedAssignmentDetail.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedAssignmentDetail.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hạn nộp: {selectedAssignmentDetail.dueDate.replace("T", " ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectAssignmentDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <p className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200">
                {selectedAssignmentDetail.description}
              </p>
            </div>

            {/* Submissions tracking list */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Danh sách nộp bài & Đánh giá của học sinh</span>
                </h4>
                <span className="text-xs font-semibold text-slate-500">
                  Đã nộp:{" "}
                  <strong className="text-emerald-700">
                    {selectedAssignmentDetail.submissions.filter((s) => s.submitted).length}
                  </strong>
                  /{selectedAssignmentDetail.submissions.length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {selectedAssignmentDetail.submissions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Chưa có học sinh nào trong danh sách lớp được giao nhiệm vụ này.
                  </p>
                ) : (
                  selectedAssignmentDetail.submissions.map((sub) => (
                    <div
                      key={sub.studentId}
                      className={`p-3 rounded-xl border transition-all ${
                        sub.submitted
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={sub.submitted}
                            onChange={() => handleToggleSubmission(sub.studentId)}
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-sm text-slate-900">{sub.studentName}</span>
                            <span className="ml-2 font-mono text-xs text-slate-400">({sub.studentCode})</span>
                            {sub.submitted && sub.submittedAt && (
                              <div className="text-[11px] text-emerald-700">
                                Đã nộp: {sub.submittedAt}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Grade input */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-600">Điểm:</span>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="10"
                            disabled={!sub.submitted}
                            value={sub.score !== undefined ? sub.score : ""}
                            onChange={(e) =>
                              handleUpdateScore(sub.studentId, Number(e.target.value))
                            }
                            placeholder="—"
                            className="w-14 px-2 py-1 text-center font-bold text-sm rounded-lg border border-slate-300 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </div>
                      </div>

                      {/* Feedback input */}
                      {sub.submitted && (
                        <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <input
                            type="text"
                            value={sub.feedback || ""}
                            onChange={(e) => handleUpdateFeedback(sub.studentId, e.target.value)}
                            placeholder="Nhận xét của cô Thủy (VD: Lời giải tốt, chú ý điều kiện...)"
                            className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Tích vào ô vuông để xác nhận học sinh đã nộp bài
              </span>
              <button
                type="button"
                onClick={() => onSelectAssignmentDetail(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
              >
                Đóng & Lưu tiến độ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
