import React, { useState } from "react";
import {
  LineChart,
  Award,
  TrendingUp,
  Search,
  Filter,
  Download,
  Edit2,
  Users,
  CheckCircle2,
  AlertTriangle,
  X,
  FileSpreadsheet,
  GraduationCap,
} from "lucide-react";
import { ClassRoom, Student, Assignment } from "../types";

interface GradesAndProgressViewProps {
  classes: ClassRoom[];
  students: Student[];
  assignments: Assignment[];
  onUpdateStudentScores: (studentId: string, scores: Student["scores"]) => void;
  onExportGrades: (className: string) => void;
}

export const GradesAndProgressView: React.FC<GradesAndProgressViewProps> = ({
  classes,
  students,
  assignments,
  onUpdateStudentScores,
  onExportGrades,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit grade modal
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formScoreTx1, setFormScoreTx1] = useState(8.0);
  const [formScoreTx2, setFormScoreTx2] = useState(8.0);
  const [formScoreMid, setFormScoreMid] = useState(8.0);
  const [formScoreFinal, setFormScoreFinal] = useState(8.0);

  const openEditScores = (std: Student) => {
    setEditingStudent(std);
    setFormScoreTx1(std.scores.regular1);
    setFormScoreTx2(std.scores.regular2);
    setFormScoreMid(std.scores.midterm);
    setFormScoreFinal(std.scores.finalExam);
  };

  const handleSaveScores = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const avg = Number(
      ((formScoreTx1 + formScoreTx2 + formScoreMid * 2 + formScoreFinal * 3) / 7).toFixed(1)
    );
    onUpdateStudentScores(editingStudent.id, {
      regular1: formScoreTx1,
      regular2: formScoreTx2,
      midterm: formScoreMid,
      finalExam: formScoreFinal,
      average: avg,
    });
    setEditingStudent(null);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClassId === "all" || s.classId === selectedClassId;
    const matchSearch =
      searchQuery.trim() === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  // Calculate statistics for filtered list
  const totalCount = filteredStudents.length;
  const classAvgScore =
    totalCount > 0
      ? (filteredStudents.reduce((acc, s) => acc + s.scores.average, 0) / totalCount).toFixed(1)
      : "0.0";

  // Distribution
  const countExcellent = filteredStudents.filter((s) => s.scores.average >= 9.0).length;
  const countGood = filteredStudents.filter((s) => s.scores.average >= 8.0 && s.scores.average < 9.0).length;
  const countFair = filteredStudents.filter((s) => s.scores.average >= 6.5 && s.scores.average < 8.0).length;
  const countAverage = filteredStudents.filter((s) => s.scores.average >= 5.0 && s.scores.average < 6.5).length;
  const countSupport = filteredStudents.filter((s) => s.scores.average < 5.0).length;

  // Assignments completion rate for filtered class
  let classSubmissionsCount = 0;
  let classAssignedTotal = 0;
  assignments
    .filter((a) => selectedClassId === "all" || a.classIds.includes(selectedClassId))
    .forEach((a) => {
      const relevant = a.submissions.filter((sub) =>
        filteredStudents.some((s) => s.id === sub.studentId)
      );
      classAssignedTotal += relevant.length;
      classSubmissionsCount += relevant.filter((s) => s.submitted).length;
    });

  const completionRate =
    classAssignedTotal > 0
      ? Math.round((classSubmissionsCount / classAssignedTotal) * 100)
      : 80;

  const getRankBadge = (avg: number) => {
    if (avg >= 9.0) {
      return <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-bold">Xuất sắc</span>;
    }
    if (avg >= 8.0) {
      return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">Giỏi</span>;
    }
    if (avg >= 6.5) {
      return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">Khá</span>;
    }
    if (avg >= 5.0) {
      return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">Đạt</span>;
    }
    return <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-xs font-bold">Cần phụ đạo</span>;
  };

  const activeClassName =
    selectedClassId === "all"
      ? "Toàn khối"
      : classes.find((c) => c.id === selectedClassId)?.name || "Lớp";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LineChart className="w-6 h-6 text-blue-600" />
            <span>Theo Dõi Điểm & Tiến Độ Học Tập</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tổng hợp kết quả đánh giá định kỳ, điểm trung bình và biểu đồ xếp loại học lực môn Toán
          </p>
        </div>

        <button
          type="button"
          onClick={() => onExportGrades(activeClassName)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Xuất bảng điểm (Excel/In)</span>
        </button>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedClassId("all")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            selectedClassId === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Tất cả các lớp ({students.length} HS)
        </button>
        {classes.map((cls) => {
          const isSelected = selectedClassId === cls.id;
          const count = students.filter((s) => s.classId === cls.id).length;
          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>Lớp {cls.name}</span>
              <span
                className={`text-xs px-1.5 py-0.2 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {count} HS
              </span>
            </button>
          );
        })}
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Class Average Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Điểm TB {activeClassName}
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700">{classAvgScore}</span>
            <span className="text-xs text-slate-500 font-medium">/ 10.0</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Dựa trên {totalCount} học sinh đang hiển thị
          </p>
        </div>

        {/* Excellent & Good Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Học lực Khá - Giỏi
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">
              {countExcellent + countGood}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              /{totalCount} em ({totalCount > 0 ? Math.round(((countExcellent + countGood) / totalCount) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1 text-xs text-emerald-600 font-medium">
            {countExcellent} em đạt mức Xuất sắc (≥ 9.0)
          </p>
        </div>

        {/* Needs Support Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Học sinh cần phụ đạo
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{countSupport}</span>
            <span className="text-xs text-slate-500 font-medium">học sinh (&lt; 5.0)</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Cần lên kế hoạch phụ đạo bổ trợ
          </p>
        </div>

        {/* Task Completion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tỷ lệ nộp bài tập
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-700">{completionRate}%</span>
            <span className="text-xs text-slate-500 font-medium">hoàn thành</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Visual Grade Distribution Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          Biểu Đồ Phân Phối Điểm Số & Xếp Loại ({activeClassName})
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Trực quan hóa tỷ lệ học sinh theo các mức điểm tổng kết môn học
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            {
              label: "Xuất sắc",
              range: "9.0 - 10.0",
              count: countExcellent,
              color: "bg-purple-600",
              lightBg: "bg-purple-50",
              border: "border-purple-200",
              textColor: "text-purple-700",
            },
            {
              label: "Giỏi",
              range: "8.0 - 8.9",
              count: countGood,
              color: "bg-emerald-600",
              lightBg: "bg-emerald-50",
              border: "border-emerald-200",
              textColor: "text-emerald-700",
            },
            {
              label: "Khá",
              range: "6.5 - 7.9",
              count: countFair,
              color: "bg-blue-600",
              lightBg: "bg-blue-50",
              border: "border-blue-200",
              textColor: "text-blue-700",
            },
            {
              label: "Đạt",
              range: "5.0 - 6.4",
              count: countAverage,
              color: "bg-amber-600",
              lightBg: "bg-amber-50",
              border: "border-amber-200",
              textColor: "text-amber-700",
            },
            {
              label: "Cần phụ đạo",
              range: "< 5.0",
              count: countSupport,
              color: "bg-rose-600",
              lightBg: "bg-rose-50",
              border: "border-rose-200",
              textColor: "text-rose-700",
            },
          ].map((bar) => {
            const percent = totalCount > 0 ? Math.round((bar.count / totalCount) * 100) : 0;
            return (
              <div
                key={bar.label}
                className={`p-4 rounded-xl border ${bar.border} ${bar.lightBg} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{bar.label}</span>
                    <span className="text-[11px] font-semibold text-slate-400">{bar.range}</span>
                  </div>
                  <div className={`text-2xl font-extrabold mt-2 ${bar.textColor}`}>
                    {bar.count} <span className="text-xs font-normal text-slate-500">em</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span>Tỷ lệ</span>
                    <span className="font-bold">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${bar.color} transition-all duration-300`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Grades Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-800">
            Bảng kết quả học tập chi tiết ({filteredStudents.length} học sinh)
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Lọc tên hoặc mã HS..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">STT</th>
                <th className="py-3 px-4">Mã HS</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4 text-center">TX 1 (x1)</th>
                <th className="py-3 px-4 text-center">TX 2 (x1)</th>
                <th className="py-3 px-4 text-center">Giữa kỳ (x2)</th>
                <th className="py-3 px-4 text-center">Cuối kỳ (x3)</th>
                <th className="py-3 px-4 text-center">ĐTB Môn</th>
                <th className="py-3 px-4">Xếp loại</th>
                <th className="py-3 px-4 text-right">Sửa điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Không có học sinh nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => (
                  <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-xs text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 text-xs font-mono font-semibold text-slate-600">
                      {std.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{std.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {std.className}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">
                      {std.scores.regular1}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">
                      {std.scores.regular2}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">
                      {std.scores.midterm}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium">
                      {std.scores.finalExam}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold text-blue-700 font-mono text-base">
                        {std.scores.average.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getRankBadge(std.scores.average)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditScores(std)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        title="Chỉnh sửa điểm số mẫu"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit Student Scores */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Cập nhật điểm số: {editingStudent.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Mã HS: {editingStudent.code} • Lớp: {editingStudent.className}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScores} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ĐĐG Thường xuyên 1 (Hệ số 1)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formScoreTx1}
                    onChange={(e) => setFormScoreTx1(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ĐĐG Thường xuyên 2 (Hệ số 1)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formScoreTx2}
                    onChange={(e) => setFormScoreTx2(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ĐĐG Giữa kỳ (Hệ số 2)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formScoreMid}
                    onChange={(e) => setFormScoreMid(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ĐĐG Cuối kỳ (Hệ số 3)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formScoreFinal}
                    onChange={(e) => setFormScoreFinal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-center"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <span className="text-xs font-semibold text-blue-700">Điểm trung bình tự động tính:</span>
                <div className="text-2xl font-black text-blue-900 mt-0.5">
                  {((formScoreTx1 + formScoreTx2 + formScoreMid * 2 + formScoreFinal * 3) / 7).toFixed(1)}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold cursor-pointer shadow-sm"
                >
                  Lưu điểm số
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
