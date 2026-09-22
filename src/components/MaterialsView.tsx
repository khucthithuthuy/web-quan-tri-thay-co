import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  FileText,
  FileCode,
  Video,
  Link2,
  Download,
  Trash2,
  Edit2,
  LayoutGrid,
  List,
  Eye,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { LearningMaterial, MaterialType, ClassRoom } from "../types";

interface MaterialsViewProps {
  materials: LearningMaterial[];
  classes: ClassRoom[];
  onAddMaterial: (mat: Omit<LearningMaterial, "id">) => void;
  onEditMaterial: (mat: LearningMaterial) => void;
  onDeleteMaterial: (id: string, title: string) => void;
  onDownloadMaterial: (mat: LearningMaterial) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  classes,
  onAddMaterial,
  onEditMaterial,
  onDeleteMaterial,
  onDownloadMaterial,
}) => {
  // View mode: grid or list
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClassId, setFilterClassId] = useState("all");
  const [filterTopic, setFilterTopic] = useState("all");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formSubject, setFormSubject] = useState("Toán học 12");
  const [formTopic, setFormTopic] = useState("");
  const [formClassIds, setFormClassIds] = useState<string[]>([]);
  const [formDescription, setFormDescription] = useState("");
  const [formFileType, setFormFileType] = useState<MaterialType>("pdf");
  const [formLinkOrFileName, setFormLinkOrFileName] = useState("");
  const [formFileSize, setFormFileSize] = useState("2.5 MB");

  // Unique topics for filter
  const topics = Array.from(new Set(materials.map((m) => m.topic)));

  const openAdd = () => {
    setEditingMaterial(null);
    setFormTitle("");
    setFormSubject("Toán học 12");
    setFormTopic("Chương 1: Ứng dụng đạo hàm");
    setFormClassIds(classes.length > 0 ? [classes[0].id] : []);
    setFormDescription("");
    setFormFileType("pdf");
    setFormLinkOrFileName("TaiLieu_OnTap_THPTYenVien.pdf");
    setFormFileSize("3.2 MB");
    setIsModalOpen(true);
  };

  const openEdit = (mat: LearningMaterial) => {
    setEditingMaterial(mat);
    setFormTitle(mat.title);
    setFormSubject(mat.subject);
    setFormTopic(mat.topic);
    setFormClassIds(mat.classIds);
    setFormDescription(mat.description);
    setFormFileType(mat.fileType);
    setFormLinkOrFileName(mat.linkOrFileName);
    setFormFileSize(mat.fileSize || "2.5 MB");
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

    if (editingMaterial) {
      onEditMaterial({
        ...editingMaterial,
        title: formTitle.trim(),
        subject: formSubject.trim(),
        topic: formTopic.trim(),
        classIds: formClassIds,
        classNames: selectedClassNames,
        description: formDescription.trim(),
        fileType: formFileType,
        linkOrFileName: formLinkOrFileName.trim(),
        fileSize: formFileSize.trim(),
      });
    } else {
      onAddMaterial({
        title: formTitle.trim(),
        subject: formSubject.trim(),
        topic: formTopic.trim(),
        classIds: formClassIds,
        classNames: selectedClassNames,
        description: formDescription.trim(),
        fileType: formFileType,
        linkOrFileName: formLinkOrFileName.trim() || "TaiLieu_YenVien.pdf",
        fileSize: formFileSize.trim() || "2.0 MB",
        dateAdded: new Date().toISOString().slice(0, 10),
        downloads: 0,
      });
    }
    setIsModalOpen(false);
  };

  const filteredMaterials = materials.filter((mat) => {
    const matchClass =
      filterClassId === "all" || mat.classIds.includes(filterClassId);
    const matchTopic =
      filterTopic === "all" || mat.topic === filterTopic;
    const matchSearch =
      searchQuery.trim() === "" ||
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchTopic && matchSearch;
  });

  const getFileIcon = (type: MaterialType) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-rose-500" />;
      case "pptx":
        return <FileSpreadsheet className="w-5 h-5 text-amber-500" />;
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "video":
        return <Video className="w-5 h-5 text-indigo-500" />;
      case "link":
      default:
        return <Link2 className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>Kho Tài Liệu Học Tập & Bài Giảng</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Lưu trữ giáo án, đề cương, bài giảng điện tử và ngân hàng câu hỏi ôn thi THPT Yên Viên
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500"
              }`}
              title="Xem dạng thẻ lưới"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-white text-blue-700 shadow-xs" : "text-slate-500"
              }`}
              title="Xem dạng danh sách bảng"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            id="btn-add-material"
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tài liệu mới</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-material-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tài liệu theo tên, chủ đề..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Class Filter */}
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

          {/* Topic Filter */}
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 max-w-xs truncate"
          >
            <option value="all">Tất cả chủ đề</option>
            {topics.map((tp) => (
              <option key={tp} value={tp}>
                {tp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Content: Grid View or List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.length === 0 ? (
            <div className="col-span-3 bg-white rounded-2xl p-12 text-center border border-slate-200">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-bold text-slate-700">Chưa có tài liệu nào trong bộ lọc này</p>
              <p className="text-xs text-slate-500 mt-1">Bấm "+ Thêm tài liệu mới" để tải lên bài giảng</p>
            </div>
          ) : (
            filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0">
                      {getFileIcon(mat.fileType)}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {mat.classNames.map((cName) => (
                        <span
                          key={cName}
                          className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"
                        >
                          Lớp {cName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {mat.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span className="text-blue-700 font-semibold">{mat.subject}</span>
                    <span>•</span>
                    <span className="truncate">{mat.topic}</span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {mat.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    <div>{mat.fileSize} • {mat.dateAdded}</div>
                    <div className="text-emerald-700 font-medium">{mat.downloads} lượt xem/tải</div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onDownloadMaterial(mat)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      title="Mở tài liệu này"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Xem/Tải</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(mat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Sửa thông tin tài liệu"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteMaterial(mat.id, mat.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Xóa tài liệu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Loại</th>
                  <th className="py-3 px-4">Tên tài liệu</th>
                  <th className="py-3 px-4">Môn & Chủ đề</th>
                  <th className="py-3 px-4">Lớp áp dụng</th>
                  <th className="py-3 px-4">Dung lượng</th>
                  <th className="py-3 px-4">Ngày đăng</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="p-1.5 rounded-lg bg-slate-100 inline-block">
                        {getFileIcon(mat.fileType)}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">
                      <div className="truncate">{mat.title}</div>
                      <div className="text-xs text-slate-400 font-normal truncate">
                        {mat.linkOrFileName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <span className="font-semibold text-blue-700">{mat.subject}</span>
                      <div className="text-slate-400">{mat.topic}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {mat.classNames.join(", ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">{mat.fileSize}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{mat.dateAdded}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onDownloadMaterial(mat)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                          title="Tải về"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(mat)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteMaterial(mat.id, mat.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Material */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>{editingMaterial ? "Chỉnh sửa tài liệu học tập" : "Thêm tài liệu học tập mới"}</span>
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
                  Tên tài liệu / Bài giảng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="VD: Đề cương ôn tập Toán Học kỳ 1"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Môn học</label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="VD: Toán học 12"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chủ đề / Bài học</label>
                  <input
                    type="text"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="VD: Khảo sát hàm số"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Lớp áp dụng <span className="text-rose-500">*</span>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Định dạng tệp</label>
                  <select
                    value={formFileType}
                    onChange={(e) => setFormFileType(e.target.value as MaterialType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="pdf">Tài liệu PDF (.pdf)</option>
                    <option value="pptx">Bài giảng trình chiếu PowerPoint (.pptx)</option>
                    <option value="docx">Tài liệu soạn thảo Word (.docx)</option>
                    <option value="video">Video bài giảng / Liên kết (.mp4, link)</option>
                    <option value="link">Liên kết tài liệu trực tuyến</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dung lượng tệp</label>
                  <input
                    type="text"
                    value={formFileSize}
                    onChange={(e) => setFormFileSize(e.target.value)}
                    placeholder="VD: 3.5 MB"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên tệp lưu trữ / Đường dẫn liên kết
                </label>
                <input
                  type="text"
                  value={formLinkOrFileName}
                  onChange={(e) => setFormLinkOrFileName(e.target.value)}
                  placeholder="VD: De_Cuong_Toan_12_HocKy1.pdf"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả tài liệu</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mô tả nội dung chính, hướng dẫn học sinh cách sử dụng tài liệu..."
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
                  {editingMaterial ? "Lưu thay đổi" : "Thêm vào kho tài liệu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
