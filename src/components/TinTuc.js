import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  fetchTinTuc,
  createTinTuc,
  updateTinTuc,
  deleteTinTuc,
  uploadImage,
} from "../services/apiService";
import Swal from "sweetalert2";

const TinTuc = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    tieude: "",
    mota: "",
    imageUrl: "",
  });

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch news from API
  const loadNews = async () => {
    setLoading(true);
    try {
      const response = await fetchTinTuc(token);
      // console.log("Phản hồi API:", response);
      // console.log("Phản hồi API:", response.data);
      // setNews(data);
      setNews(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách tin tức");
      console.error("Error loading news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle add news
  const handleAddNews = async () => {
    try {
      setLoading(true);
      if (!formData.tieude || !formData.mota) {
        throw new Error('Tiêu đề và mô tả không được để trống');
      }
      
      let imageUrl = formData.imageUrl;
      if (selectedFile) {
        const uploadedFile = await uploadImage(token, selectedFile);
        console.log(uploadedFile.data);
        imageUrl = uploadedFile.data;
      }

      const newNews = await createTinTuc(token, {
        tieude: formData.tieude,
        mota: formData.mota,
        imageUrl,
      });

      setNews([...news, newNews]);
      setShowAddModal(false);
      Swal.fire("Thành công!", "Thêm tin tức thành công", "success");
    } catch (err) {
      Swal.fire("Lỗi!", "Thêm tin tức thất bại", "error");
      console.error("Error adding news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle update news
  const handleUpdateNews = async () => {
    try {
      setLoading(true);

      let imageUrl = formData.imageUrl;
      if (selectedFile) {
        const uploadedFile = await uploadImage(token, selectedFile);
        imageUrl = uploadedFile;
      }

      const updatedNews = await updateTinTuc(token, selectedNews.tintucId, {
        tieude: formData.tieude,
        mota: formData.mota,
        imageUrl,
      });

      setNews(
        news.map((item) =>
          item.tintucId === selectedNews.tintucId ? updatedNews : item
        )
      );
      setShowEditModal(false);
      Swal.fire("Thành công!", "Cập nhật tin tức thành công", "success");
    } catch (err) {
      Swal.fire("Lỗi!", "Cập nhật tin tức thất bại", "error");
      console.error("Error updating news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete news
  const handleDeleteNews = async () => {
    try {
      setLoading(true);
      await deleteTinTuc(token, selectedNews.tintucId);

      setNews(news.filter((item) => item.tintucId !== selectedNews.tintucId));
      setShowDeleteModal(false);
      Swal.fire("Thành công!", "Xóa tin tức thành công", "success");
    } catch (err) {
      Swal.fire("Lỗi!", "Xóa tin tức thất bại", "error");
      console.error("Error deleting news:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination and search
  const filteredNews = news.filter(
    (item) =>
      item.tieude.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mota.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentItems = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset form when opening add modal
  const openAddModal = () => {
    setFormData({
      tieude: "",
      mota: "",
      imageUrl: "",
    });
    setSelectedFile(null);
    setShowAddModal(true);
  };

  // Open edit modal with selected news data
  const openEditModal = (newsItem) => {
    setSelectedNews(newsItem);
    setFormData({
      tieude: newsItem.tieude,
      mota: newsItem.mota,
      imageUrl: newsItem.imageUrl,
    });
    setSelectedFile(null);
    setShowEditModal(true);
  };

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      {/* Main content */}
      <div className="p-4 flex-grow-1">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-3 mb-md-0">Tin tức hoạt động</h1>
          <div className="d-flex gap-2">
            <div
              className="d-flex"
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm tin tức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              />
              <button
                className="btn btn-primary"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
            <button className="btn btn-success" onClick={openAddModal}>
              <i className="fas fa-plus me-2"></i>Thêm mới
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {/* News table */}
        <div className="table-responsive mb-4">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th style={{ width: "5%" }}>STT</th>
                <th style={{ width: "15%" }}>Hình ảnh</th>
                <th style={{ width: "25%" }}>Tiêu đề</th>
                <th style={{ width: "35%" }}>Mô tả</th>
                <th style={{ width: "10%" }}>Ngày tạo</th>
                <th style={{ width: "10%" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.tintucId}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <img
                      src={`http://3.104.77.30:8080/api/v1/project/file/getImage/${item.imageUrl}`}
                      alt="Tin tức"
                      className="img-thumbnail"
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{item.tieude}</td>
                  <td>{item.mota}</td>
                  <td>{item.createdAt.split('.')[0]}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary btn-outline-primary-detail"
                        onClick={() => {
                          setSelectedNews(item);
                          setShowDetailModal(true);
                        }}
                        title="Xem chi tiết"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => openEditModal(item)}
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setSelectedNews(item);
                          setShowDeleteModal(true);
                        }}
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination - Fixed at bottom */}
      <div className="mt-auto p-3 bg-light border-top">
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &laquo; Trước
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Tiếp &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết tin tức</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedNews && (
                  <>
                    <div className="text-center mb-4">
                      <img
                        src={`http://3.104.77.30:8080/api/v1/project/file/images/${selectedNews.imageUrl}`}
                        alt="Tin tức"
                        className="img-fluid rounded"
                        style={{ maxHeight: "300px" }}
                      />
                    </div>
                    <h4>{selectedNews.tieude}</h4>
                    <p className="text-muted mb-3">
                      <small>
                        Đăng ngày:{" "}
                        {new Date(selectedNews.createdAt).toLocaleString()}
                      </small>
                    </p>
                    <div className="border-top pt-3">
                      <p>{selectedNews.mota}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm tin tức</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="tieude"
                value={formData.tieude}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="mota"
                value={formData.mota}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleAddNews} disabled={loading}>
            {loading ? "Đang xử lý..." : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa tin tức</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="tieude"
                value={formData.tieude}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="mota"
                value={formData.mota}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
              {formData.url && !selectedFile && (
                <div className="mt-2">
                  <img
                    src={`http://3.104.77.30:8080/api/v1/project/file/images/${formData.url}`}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxHeight: "100px" }}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateNews}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Lưu thay đổi"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNews && (
            <p>
              Bạn có chắc chắn muốn xóa tin tức "
              <strong>{selectedNews.tieude}</strong>"?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteNews}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TinTuc;
