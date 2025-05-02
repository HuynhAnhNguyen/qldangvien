import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  InputGroup,
  FormControl,
  Pagination,
} from "react-bootstrap";
import Swal from "sweetalert2";
// import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const KyDangPhi = () => {
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
      const response = await fetch(
        "http://3.104.77.30:8080/api/v1/project/kydangphi/findAll",
        {
            method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const data = await response.json();
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

  // Create new KyDangPhi
  const createKyDangPhi = async (ten, sotien) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://3.104.77.30:8080/api/v1/project/kydangphi/create?sotien=${sotien}&tenKydangphi=${encodeURIComponent(ten)}`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating KyDangPhi:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update KyDangPhi
  const updateKyDangPhi = async (id, ten, sotien) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://3.104.77.30:8080/api/v1/project/kydangphi/update?kydangphiId=${id}&tenKydangphi=${encodeURIComponent(ten)}&sotien=${sotien}`,
        {
          method: "PUT",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating KyDangPhi:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete KyDangPhi
  const deleteKyDangPhi = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://3.104.77.30:8080/api/v1/project/kydangphi/delete?kydangphiId=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting KyDangPhi:", error);
      throw error;
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
      const response = await createKyDangPhi(formData.ten, formData.sotien);
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
    }
  };

  // Handle update
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const response = await updateKyDangPhi(
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
    }
  };

  
  // Open edit modal
  const openEditModal = (kyDangPhi) => {
    setSelectedKyDangPhi(kyDangPhi);
    setFormData({
      ten: kyDangPhi.ten,
      sotien: kyDangPhi.sotien,
    });
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

  // Initialize data
  useEffect(() => {
    fetchKyDangPhiList();
  }, []);

  // Filter data based on search term
  const filteredData = kyDangPhiList.filter((item) =>
    item.ten.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Kỳ Đảng Phí</h2>
        <Button variant="success" onClick={openAddModal}>
          {/* <FaPlus className="me-2" />  */}
          Thêm mới
        </Button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <InputGroup style={{ maxWidth: "400px" }}>
          <FormControl
            placeholder="Tìm kiếm kỳ đảng phí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroup.Text>
            {/* <FaSearch /> */}
          </InputGroup.Text>
        </InputGroup>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Data table */}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên kỳ đảng phí</th>
              <th>Số tiền</th>
              <th>Người tạo</th>
              <th>Thời gian tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.ten}</td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.sotien)}
                  </td>
                  <td>{item.nguoitao}</td>
                  <td>{item.thoigiantao}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => openEditModal(item)}
                      disabled={loading}
                    >
                      {/* <FaEdit /> */}
                    </Button>
        
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Kỳ Đảng Phí</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên kỳ đảng phí *</Form.Label>
              <Form.Control
                type="text"
                name="ten"
                value={formData.ten}
                onChange={(e) =>
                  setFormData({ ...formData, ten: e.target.value })
                }
                isInvalid={!!validationErrors.ten}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.ten}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số tiền *</Form.Label>
              <Form.Control
                type="number"
                name="sotien"
                value={formData.sotien}
                onChange={(e) =>
                  setFormData({ ...formData, sotien: e.target.value })
                }
                isInvalid={!!validationErrors.sotien}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.sotien}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={loading}>
            {loading ? "Đang xử lý..." : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật Kỳ Đảng Phí</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên kỳ đảng phí *</Form.Label>
              <Form.Control
                type="text"
                name="ten"
                value={formData.ten}
                onChange={(e) =>
                  setFormData({ ...formData, ten: e.target.value })
                }
                isInvalid={!!validationErrors.ten}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.ten}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số tiền *</Form.Label>
              <Form.Control
                type="number"
                name="sotien"
                value={formData.sotien}
                onChange={(e) =>
                  setFormData({ ...formData, sotien: e.target.value })
                }
                isInvalid={!!validationErrors.sotien}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.sotien}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdate} disabled={loading}>
            {loading ? "Đang xử lý..." : "Lưu thay đổi"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KyDangPhi;