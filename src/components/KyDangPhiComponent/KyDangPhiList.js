import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { createKyDangPhi, fetchKyDangPhi, updateKyDangPhi } from "../../services/apiService";
import KyDangPhiTable from "./KyDangPhiTable";
import KyDangPhiAddModal from "./KyDangPhiAddModal";
import KyDangPhiEditModal from "./KyDangPhiEditModal";

const KyDangPhiList = () => {
  // State management
  const [kyDangPhiList, setKyDangPhiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedKyDangPhi, setSelectedKyDangPhi] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    ten: "",
    sotien: "",
  });

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch all KyDangPhi
  const fetchKyDangPhiList = async () => {
    setLoading(true);
    try {
      const data = await fetchKyDangPhi(token);
      if (data.resultCode === 0) {
        setKyDangPhiList(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } else {
        throw new Error(data.message || "Failed to fetch KyDangPhi list");
      }
    } catch (err) {
      setError("Failed to load KyDangPhi data");
      console.error("Error fetching KyDangPhi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.ten.trim()) {
      errors.ten = "Tên kỳ đảng phí là bắt buộc";
    }

    if (!formData.sotien) {
      errors.sotien = "Số tiền là bắt buộc";
    } else if (isNaN(formData.sotien) || Number(formData.sotien) <= 0) {
      errors.sotien = "Số tiền phải là số dương";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await createKyDangPhi(token, formData.ten, formData.sotien);
      if (response.resultCode === 0) {
        Swal.fire("Thành công", "Thêm kỳ đảng phí thành công", "success");
        setShowAddModal(false);
        setFormData({ ten: "", sotien: "" });
        fetchKyDangPhiList();
      } else {
        throw new Error(response.message || "Failed to create KyDangPhi");
      }
    } catch (error) {
      Swal.fire("Lỗi", error.message || "Thêm kỳ đảng phí thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await updateKyDangPhi(
        token,
        selectedKyDangPhi.id,
        formData.ten,
        formData.sotien
      );
      if (response.resultCode === 0) {
        Swal.fire("Thành công", "Cập nhật kỳ đảng phí thành công", "success");
        setShowEditModal(false);
        fetchKyDangPhiList();
      } else {
        throw new Error(response.message || "Failed to update KyDangPhi");
      }
    } catch (error) {
      Swal.fire("Lỗi", error.message || "Cập nhật kỳ đảng phí thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (kyDangPhi) => {
    setSelectedKyDangPhi(kyDangPhi);
    setFormData({
      ten: kyDangPhi.ten,
      sotien: kyDangPhi.sotien,
    });
    setValidationErrors({});
    setShowEditModal(true);
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      ten: "",
      sotien: "",
    });
    setValidationErrors({});
    setShowAddModal(true);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Initialize data
  useEffect(() => {
    fetchKyDangPhiList();
  }, []);

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-3 mb-md-0">Quản lý Kỳ Đảng phí</h1>
          <div className="d-flex gap-2 align-items-center">
            <div className="d-flex" style={{ width: "100%", maxWidth: "450px" }}>
              <input
                type="text"
                className="form-control custom-sm-input"
                placeholder="Tìm kiếm kỳ đảng phí..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              />
              <button
                className="btn btn-primary custom-sm-btn"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
            <button
              className="btn btn-success custom-sm-btn-dangvien"
              onClick={openAddModal}
            >
              <i className="fas fa-plus me-2"></i>Thêm mới
            </button>
          </div>
        </div>

        <KyDangPhiTable
          kyDangPhiList={kyDangPhiList}
          searchTerm={searchTerm}
          loading={loading}
          error={error}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          openEditModal={openEditModal}
        />

        <KyDangPhiAddModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          formData={formData}
          setFormData={setFormData}
          validationErrors={validationErrors}
          handleCreate={handleCreate}
          loading={loading}
        />

        <KyDangPhiEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          formData={formData}
          setFormData={setFormData}
          validationErrors={validationErrors}
          handleUpdate={handleUpdate}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default KyDangPhiList;