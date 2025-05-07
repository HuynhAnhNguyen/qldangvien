import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  fetchDangVien,
  fetchHoSoByDangVienId,
  fetchHoSoApprovedByDangVienId,
  createHoSo,
  updateHoSo,
  deleteHoSo,
  uploadFile,
  downloadFile,
  fetchHoSoById,
} from "../../services/apiService";
import HoSoDangVienTable from "./HoSoDangVienTable";
import HoSoDangVienAddModal from "./HoSoDangVienAddModal";
import HoSoDangVienEditModal from "./HoSoDangVienEditModal";
import HoSoDetailModal from "./HoSoDetailModal";

const HoSoDangVienList = () => {
  const [dangVienList, setDangVienList] = useState([]);
  const [hoSoList, setHoSoList] = useState([]);
  const [selectedDangVien, setSelectedDangVien] = useState(null);
  const [searchType, setSearchType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [file, setFile] = useState(null);
  const itemsPerPage = 10;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHoSo, setSelectedHoSo] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [hoSoDetail, setHoSoDetail] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    taphoso: "",
    loaihoso: "",
    fileUrl: "",
    ghichu: "",
  });

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch danh sách Đảng viên
  const loadDangVien = async () => {
    try {
      const response = await fetchDangVien(token);
      const data = await response.json();
      if (data.resultCode === 0) {
        setDangVienList(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "Không thể tải danh sách Đảng viên");
      }
    } catch (err) {
      setError("Không thể tải danh sách Đảng viên");
      console.error("Error loading dangVien:", err);
    }
  };

  // Fetch hồ sơ theo Đảng viên
  const loadHoSo = async () => {
    if (!selectedDangVien) return;

    setLoading(true);
    try {
      let data;
      if (searchType === "all") {
        data = await fetchHoSoByDangVienId(token, selectedDangVien.id);
      } else {
        data = await fetchHoSoApprovedByDangVienId(token, selectedDangVien.id);
      }
      // const data = await response.json();
      if (data.resultCode === 0) {
        setHoSoList(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } else {
        throw new Error(data.message || "Không thể tải danh sách hồ sơ");
      }
    } catch (err) {
      setError("Không thể tải danh sách hồ sơ");
      console.error("Error loading hoSo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUploadFile = async () => {
    if (!file) return null;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await uploadFile(token, formData);
      if (data.resultCode === 0) {
        return data.data;
      } else {
        throw new Error(data.message || "Tải lên file thất bại");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire("Lỗi", "Tải lên file thất bại", "error");
      return null;
    }
  };

  const handleDownloadFile = async (filename) => {
    try {
      setLoading(true);
      const response = await downloadFile(token, filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let downloadFilename = filename;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          downloadFilename = filenameMatch[1];
        }
      }

      link.setAttribute("download", downloadFilename);
      document.body.appendChild(link);
      link.click();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Tải file thành công!",
        confirmButtonText: "Đóng",
      });

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data?.message || "Tải file thất bại",
        confirmButtonText: "Đóng",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new hồ sơ
  const handleAddHoSo = async () => {
    if (!formData.taphoso || !formData.loaihoso) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }

    try {
      setLoading(true);

      let fileUrl = formData.fileUrl;
      if (file) {
        const uploadedFileUrl = await handleUploadFile();
        if (!uploadedFileUrl) return;
        fileUrl = uploadedFileUrl;
      }

      const hoSoData = {
        ...formData,
        fileUrl: fileUrl || "",
      };

      const data = await createHoSo(token, selectedDangVien.id, hoSoData);

      if (data.resultCode === 0) {
        setHoSoList([data.data, ...hoSoList]);
        setShowAddModal(false);
        setFile(null);
        Swal.fire("Thành công!", "Thêm hồ sơ thành công", "success");
      } else {
        throw new Error(data.message || "Thêm hồ sơ thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Thêm hồ sơ thất bại", "error");
      console.error("Error adding hoSo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update hồ sơ
  const handleUpdateHoSo = async () => {
    if (!formData.taphoso || !formData.loaihoso) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }

    try {
      setLoading(true);

      let fileUrl = formData.fileUrl;
      if (file) {
        const uploadedFileUrl = await handleUploadFile();
        if (!uploadedFileUrl) return;
        fileUrl = uploadedFileUrl;
      }

      const hoSoData = {
        ...formData,
        fileUrl: fileUrl || formData.fileUrl,
      };

      const data = await updateHoSo(token, selectedHoSo.id, hoSoData);

      if (data.resultCode === 0) {
        setHoSoList(
          hoSoList.map((item) =>
            item.id === selectedHoSo.id ? data.data : item
          )
        );
        setShowEditModal(false);
        setFile(null);
        Swal.fire("Thành công!", "Cập nhật hồ sơ thành công", "success");
      } else {
        throw new Error(data.message || "Cập nhật hồ sơ thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Cập nhật hồ sơ thất bại", "error");
      console.error("Error updating hoSo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete hồ sơ
  const handleDeleteHoSo = async (hoSoId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa hồ sơ này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await deleteHoSo(token, hoSoId);
        const data = await response.json();
        if (data.resultCode === 0) {
          setHoSoList(hoSoList.filter((item) => item.id !== hoSoId));
          Swal.fire("Đã xóa!", "Hồ sơ đã được xóa.", "success");
        } else {
          throw new Error(data.message || "Xóa hồ sơ thất bại");
        }
      } catch (err) {
        Swal.fire("Lỗi!", "Xóa hồ sơ thất bại", "error");
        console.error("Error deleting hoSo:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchHoSoDetail = async (hoSoId) => {
    try {
      setLoading(true);
      const data = await fetchHoSoById(token, hoSoId);
      // const data = await response.json();
      if (data.resultCode === 0 && data.data && data.data.length > 0) {
        setHoSoDetail(data.data[0]);
        setShowDetailModal(true);
      } else {
        throw new Error(data.message || "Không thể tải chi tiết hồ sơ");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Không thể tải chi tiết hồ sơ", "error");
      console.error("Error fetching hoSo detail:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      taphoso: "",
      loaihoso: "",
      fileUrl: "",
      ghichu: "",
    });
    setFile(null);
    setShowAddModal(true);
  };

  // Open edit modal with selected hoSo data
  const openEditModal = (hoSoItem) => {
    setSelectedHoSo(hoSoItem);
    setFormData({
      taphoso: hoSoItem.taphoso,
      loaihoso: hoSoItem.loaihoso,
      fileUrl: hoSoItem.fileUrl,
      ghichu: hoSoItem.ghichu || "",
    });
    setFile(null);
    setShowEditModal(true);
  };

  const openDetailModal = (hoSoItem) => {
    fetchHoSoDetail(hoSoItem.id);
  };

  // Handle DangVien selection
  const handleDangVienSelect = (dangVien) => {
    setSelectedDangVien(dangVien);
    setCurrentPage(1);
    setSearchTerm("");
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Load data on component mount and when selectedDangVien or searchType changes
  useEffect(() => {
    loadDangVien();
  }, []);

  useEffect(() => {
    loadHoSo();
  }, [selectedDangVien, searchType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchType]);

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-3 mb-md-0">Quản lý Hồ Sơ Đảng Viên</h1>
          <div className="d-flex gap-2 align-items-center">
            <Form.Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="all">Tất cả hồ sơ</option>
              <option value="approved">Hồ sơ đã duyệt</option>
            </Form.Select>
            <Form.Select
              value={selectedDangVien?.id || ""}
              onChange={(e) => {
                const selectedId = e.target.value;
                const dv = dangVienList.find((item) => item.id == selectedId);
                handleDangVienSelect(dv || null);
              }}
              style={{ width: "250px" }}
            >
              <option value="">Chọn Đảng viên</option>
              {dangVienList.map((dangVien) => (
                <option key={dangVien.id} value={dangVien.id}>
                  {dangVien.hoten}
                </option>
              ))}
            </Form.Select>
            <div style={{ width: "100%", maxWidth: "400px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm hồ sơ..."
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={!selectedDangVien}
              />
            </div>
            <button
              className="btn btn-success custom-sm-btn-hoso"
              onClick={openAddModal}
              disabled={!selectedDangVien}
            >
              <i className="fas fa-plus me-2"></i>Thêm mới
            </button>
          </div>
        </div>

        <HoSoDangVienTable
          hoSoList={hoSoList}
          selectedDangVien={selectedDangVien}
          searchTerm={searchTerm}
          loading={loading}
          error={error}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          openEditModal={openEditModal}
          handleDeleteHoSo={handleDeleteHoSo}
          searchType={searchType}
          openDetailModal={openDetailModal}
        />

        <HoSoDangVienAddModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleAddHoSo={handleAddHoSo}
          selectedDangVien={selectedDangVien}
          loading={loading}
          file={file}
          handleDownloadFile={handleDownloadFile}
        />

        <HoSoDangVienEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleUpdateHoSo={handleUpdateHoSo}
          selectedDangVien={selectedDangVien}
          selectedHoSo={selectedHoSo}
          loading={loading}
          handleDownloadFile={handleDownloadFile}
        />

        <HoSoDetailModal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          hoSoDetail={hoSoDetail}
          selectedDangVien={selectedDangVien}
          handleDownloadFile={handleDownloadFile}
        />
      </div>
    </div>
  );
};

export default HoSoDangVienList;
