import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  X,
  FileText,
  School,
  CheckCircle2,
} from "lucide-react";
import { ClassRoom, Student, StudentStatus } from "../types";

interface ClassesAndStudentsViewProps {
  classes: ClassRoom[];
  students: Student[];
  onAddStudent: (student: Omit<Student, "id">) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string, name: string) => void;
  onAddClass: (newClass: Omit<ClassRoom, "id">) => void;
  onEditClass: (cls: ClassRoom) => void;
  onDeleteClass: (id: string, name: string) => void;
}

export const ClassesAndStudentsView: React.FC<ClassesAndStudentsViewProps> = ({
  classes,
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onAddClass,
  onEditClass,
  onDeleteClass,
}) => {
  // Filters
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isClassModalOpen, setIsClassModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Form states for Student
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formClassId, setFormClassId] = useState("");
  const [formGender, setFormGender] = useState<"Nam" | "Nữ">("Nam");
  const [formStatus, setFormStatus] = useState<StudentStatus>("Tích cực");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formScoreTx1, setFormScoreTx1] = useState(8.0);
  const [formScoreTx2, setFormScoreTx2] = useState(8.5);
  const [formScoreMid, setFormScoreMid] = useState(8.0);
  const [formScoreFinal, setFormScoreFinal] = useState(8.5);

  // Form states for Class
  const [formClassName, setFormClassName] = useState("");
  const [formGrade, setFormGrade] = useState<"10" | "11" | "12">("12");
  const [formRoom, setFormRoom] = useState("");
  const [formHomeroom, setFormHomeroom] = useState("Khúc Thị Thu Thủy");
  const [formYear, setFormYear] = useState("2024 - 2025");
  const [formClassDesc, setFormClassDesc] = useState("");

  // Open Add Student Modal
  const openAddStudent = () => {
    setEditingStudent(null);
    setFormName("");
    setFormCode(`YV${selectedClassId !== "all" ? classes.find(c => c.id === selectedClassId)?.name.substring(0, 2) || "12" : "12"}-0${Math.floor(Math.random() * 80 + 20)}`);
    setFormClassId(selectedClassId !== "all" ? selectedClassId : (classes[0]?.id || ""));
    setFormGender("Nam");
    setFormStatus("Tích cực");
    setFormPhone("");
    setFormEmail("");
    setFormNotes("");
    setFormScoreTx1(8.0);
    setFormScoreTx2(8.0);
    setFormScoreMid(8.0);
    setFormScoreFinal(8.0);
    setIsStudentModalOpen(true);
  };

  // Open Edit Student Modal
  const openEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.name);
    setFormCode(student.code);
    setFormClassId(student.classId);
    setFormGender(student.gender);
    setFormStatus(student.status);
    setFormPhone(student.phone || "");
    setFormEmail(student.email || "");
    setFormNotes(student.notes || "");
    setFormScoreTx1(student.scores.regular1);
    setFormScoreTx2(student.scores.regular2);
    setFormScoreMid(student.scores.midterm);
    setFormScoreFinal(student.scores.finalExam);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formClassId) return;

    const targetClass = classes.find((c) => c.id === formClassId);
    const avg = Number(
      ((formScoreTx1 + formScoreTx2 + formScoreMid * 2 + formScoreFinal * 3) / 7).toFixed(1)
    );

    const studentData = {
      name: formName.trim(),
      code: formCode.trim() || `YV-${Math.floor(1000 + Math.random() * 9000)}`,
      classId: formClassId,
      className: targetClass?.name || "Lớp học",
      gender: formGender,
      status: formStatus,
      phone: formPhone.trim(),
      email: formEmail.trim(),
      notes: formNotes.trim(),
      scores: {
        regular1: formScoreTx1,
        regular2: formScoreTx2,
        midterm: formScoreMid,
        finalExam: formScoreFinal,
        average: avg,
      },
    };

    if (editingStudent) {
      onEditStudent({ ...studentData, id: editingStudent.id });
    } else {
      onAddStudent(studentData);
    }
    setIsStudentModalOpen(false);
  };

  // Open Add Class Modal
  const openAddClass = () => {
    setEditingClass(null);
    setFormClassName("");
    setFormGrade("12");
    setFormRoom("Phòng 205");
    setFormHomeroom("Khúc Thị Thu Thủy");
    setFormYear("2024 - 2025");
    setFormClassDesc("");
    setIsClassModalOpen(true);
  };

  // Open Edit Class Modal
  const openEditClass = (cls: ClassRoom) => {
    setEditingClass(cls);
    setFormClassName(cls.name);
    setFormGrade(cls.grade);
    setFormRoom(cls.room);
    setFormHomeroom(cls.homeroomTeacher);
    setFormYear(cls.academicYear);
    setFormClassDesc(cls.description || "");
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClassName.trim()) return;

    const classData = {
      name: formClassName.trim(),
      grade: formGrade,
      room: formRoom.trim(),
      homeroomTeacher: formHomeroom.trim(),
      academicYear: formYear.trim(),
      description: formClassDesc.trim(),
    };

    if (editingClass) {
      onEditClass({ ...classData, id: editingClass.id });
    } else {
      onAddClass(classData);
    }
    setIsClassModalOpen(false);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClassId === "all" || s.classId === selectedClassId;
    const matchStatus = selectedStatus === "all" || s.status === selectedStatus;
    const matchSearch =
      searchQuery.trim() === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchClass && matchStatus && matchSearch;
  });

  // Active class details for banner
  const activeClassObj = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Quản Lý Lớp Học & Học Sinh</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi sĩ số, cập nhật hồ sơ, phân loại tình hình học tập theo từng lớp THPT Yên Viên
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="btn-add-class"
            onClick={openAddClass}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <School className="w-4 h-4 text-blue-600" />
            <span>Thêm lớp</span>
          </button>
          <button
            type="button"
            id="btn-add-student"
            onClick={openAddStudent}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Class Selection Tabs Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              id="filter-class-all"
              onClick={() => setSelectedClassId("all")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedClassId === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả các lớp ({students.length} HS)
            </button>
            {classes.map((cls) => {
              const count = students.filter((s) => s.classId === cls.id).length;
              const isSelected = selectedClassId === cls.id;
              return (
                <button
                  key={cls.id}
                  id={`filter-class-${cls.name}`}
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
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick info if specific class selected */}
          {activeClassObj && (
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span>GVCN: <strong className="text-slate-900">{activeClassObj.homeroomTeacher}</strong></span>
              <span>•</span>
              <span>{activeClassObj.room}</span>
              <button
                onClick={() => openEditClass(activeClassObj)}
                className="p-1 hover:bg-slate-100 rounded text-blue-600 ml-1"
                title="Sửa thông tin lớp"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              {classes.length > 1 && (
                <button
                  onClick={() => onDeleteClass(activeClassObj.id, activeClassObj.name)}
                  className="p-1 hover:bg-rose-50 rounded text-rose-500"
                  title="Xóa lớp học này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-student-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học sinh, mã HS..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Trạng thái:</span>
          </span>
          {[
            { id: "all", label: "Tất cả" },
            { id: "Tích cực", label: "Tích cực" },
            { id: "Bình thường", label: "Bình thường" },
            { id: "Cần hỗ trợ", label: "Cần hỗ trợ" },
            { id: "Vắng nhiều", label: "Vắng nhiều" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedStatus === st.id
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-800">
            Danh sách học sinh ({filteredStudents.length} kết quả)
          </div>
          <span className="text-xs text-slate-500">
            Nhấn vào hàng để xem hồ sơ và điểm số chi tiết
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Mã HS</th>
                <th className="py-3.5 px-4">Họ và tên</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4">Giới tính</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">ĐTB Môn</th>
                <th className="py-3.5 px-4">Ghi chú giáo viên</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">Không tìm thấy học sinh nào phù hợp</p>
                    <p className="text-xs text-slate-400 mt-1">Thử thay đổi bộ lọc lớp hoặc tìm kiếm tên khác</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => setViewingStudent(std)}
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-600">
                      {std.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {std.name}
                      </div>
                      <div className="text-xs text-slate-400 sm:hidden">{std.className}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                        {std.className}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {std.gender}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          std.status === "Tích cực"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : std.status === "Bình thường"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : std.status === "Cần hỗ trợ"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {std.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold text-sm ${
                          std.scores.average >= 8.0
                            ? "text-emerald-700"
                            : std.scores.average >= 6.5
                            ? "text-blue-700"
                            : "text-amber-700"
                        }`}
                      >
                        {std.scores.average.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                      {std.notes || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setViewingStudent(std)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Xem hồ sơ"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditStudent(std)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(std.id, std.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa học sinh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add/Edit Student */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>{editingStudent ? "Chỉnh sửa thông tin học sinh" : "Thêm học sinh mới"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên học sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã học sinh</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="VD: YV12-008"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Lớp {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as "Nam" | "Nữ")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái học tập</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as StudentStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Tích cực">Tích cực</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Cần hỗ trợ">Cần hỗ trợ</option>
                    <option value="Vắng nhiều">Vắng nhiều</option>
                  </select>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại (PH/HS)</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="VD: 0912.xxx.xxx"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email học sinh</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="VD: hs@yenvien.edu.vn"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Sample Scores */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Điểm số kiểm tra mẫu (Thang điểm 10):
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Thường xuyên 1</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formScoreTx1}
                      onChange={(e) => setFormScoreTx1(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-sm bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Thường xuyên 2</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formScoreTx2}
                      onChange={(e) => setFormScoreTx2(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-sm bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Giữa kỳ (x2)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formScoreMid}
                      onChange={(e) => setFormScoreMid(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-sm bg-white text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Cuối kỳ (x3)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formScoreFinal}
                      onChange={(e) => setFormScoreFinal(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-sm bg-white text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú sư phạm</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ghi chú về học lực, tính cách, cần bồi dưỡng thêm..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold cursor-pointer shadow-sm"
                >
                  {editingStudent ? "Cập nhật học sinh" : "Thêm vào danh sách"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Class */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                <span>{editingClass ? "Sửa thông tin lớp học" : "Tạo lớp học mới"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsClassModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên lớp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formClassName}
                    onChange={(e) => setFormClassName(e.target.value)}
                    placeholder="VD: 12A2, 11A1"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as "10" | "11" | "12")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="12">Khối 12</option>
                    <option value="11">Khối 11</option>
                    <option value="10">Khối 10</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phòng học</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="VD: Phòng 204 - Khu A"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Năm học</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Giáo viên phụ trách / GVCN</label>
                <input
                  type="text"
                  value={formHomeroom}
                  onChange={(e) => setFormHomeroom(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả đặc điểm lớp</label>
                <textarea
                  rows={2}
                  value={formClassDesc}
                  onChange={(e) => setFormClassDesc(e.target.value)}
                  placeholder="Lớp chuyên đề, lớp chọn tự nhiên..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-sm font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold cursor-pointer shadow-sm"
                >
                  {editingClass ? "Lưu thay đổi" : "Tạo lớp học"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer / Modal: Student Detail Profile */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">
                  {viewingStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{viewingStudent.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span>Mã HS: <strong className="font-mono text-slate-700">{viewingStudent.code}</strong></span>
                    <span>•</span>
                    <span>Lớp: <strong className="text-blue-700">{viewingStudent.className}</strong></span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-600">Trạng thái học tập:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    viewingStudent.status === "Tích cực"
                      ? "bg-emerald-100 text-emerald-800"
                      : viewingStudent.status === "Bình thường"
                      ? "bg-blue-100 text-blue-800"
                      : viewingStudent.status === "Cần hỗ trợ"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {viewingStudent.status}
                </span>
              </div>

              {/* Scores breakdown */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Bảng điểm thành phần (Toán học):
                </span>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500">TX 1</div>
                    <div className="font-bold text-base text-slate-800 mt-1">
                      {viewingStudent.scores.regular1}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500">TX 2</div>
                    <div className="font-bold text-base text-slate-800 mt-1">
                      {viewingStudent.scores.regular2}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500">Giữa kỳ</div>
                    <div className="font-bold text-base text-slate-800 mt-1">
                      {viewingStudent.scores.midterm}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500">Cuối kỳ</div>
                    <div className="font-bold text-base text-slate-800 mt-1">
                      {viewingStudent.scores.finalExam}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-[11px] text-blue-700 font-semibold">ĐTB Môn</div>
                    <div className="font-extrabold text-base text-blue-800 mt-1">
                      {viewingStudent.scores.average.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Điện thoại: {viewingStudent.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Email: {viewingStudent.email || "Chưa cập nhật"}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Nhận xét của giáo viên:
                </span>
                <p className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-slate-700 text-sm leading-relaxed">
                  {viewingStudent.notes || "Chưa có ghi chú sư phạm đặc biệt."}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const st = viewingStudent;
                    setViewingStudent(null);
                    openEditStudent(st);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Chỉnh sửa hồ sơ
                </button>
                <button
                  type="button"
                  onClick={() => setViewingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
