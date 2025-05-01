import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  fetchQuyetDinhByDangVien,
  createQuyetDinh,
  updateQuyetDinh,
  deleteQuyetDinh,
  uploadFile,
  downloadFile,
} from "../../services/apiService";

const QuyetDinhModal = ({ show, onHide, selectedDangVien, token }) => {
  const [quyetDinhList, setQuyetDinhList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedQuyetDinh, setSelectedQuyetDinh] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [formData, setFormData] = useState({
    loaiquyetdinh: "",
    nam: "",
    tenquyetdinh: "",
    fileUrl: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    loaiquyetdinh: "",
    nam: "",
    tenquyetdinh: "",
  });

  useEffect(() => {
    if (show && selectedDangVien) {
      loadQuyetDinh();
    }
  }, [show, selectedDangVien]);

  const loadQuyetDinh = async () => {
    setLoading(true);
    try {
      const data = await fetchQuyetDinhByDangVien(
        token,
        selectedDangVien.id
      );
    //   const data = await response.json();
      if (data.resultCode === 0) {
        setQuyetDinhList(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } else {
        throw new Error(data.message || "Không thể tải danh sách quyết định");
      }
    } catch (err) {
      setError("Không thể tải danh sách quyết định");
      console.error("Error loading quyetDinh:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleUploadFile = async () => {
    if (!file) return null;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const data = await uploadFile(token, formData);
      console.log(data.data);
      //   const data = await response.json();

      if (data.resultCode === 0) {
        return data.data;
      } else {
        throw new Error(data.message || "Tải lên file thất bại");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire("Lỗi", "Tải lên file thất bại", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

//   const handleDownloadFile = async (filename) => {
//     try {
//       setLoading(true);
//       const response = await downloadFile(token, filename);

//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//       } else {
//         throw new Error("Không thể tải file");
//       }
//     } catch (error) {
//       console.error("Error downloading file:", error);
//       Swal.fire("Lỗi", "Tải file thất bại", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

const handleDownloadFile = async (filename) => {
    try {
      setLoading(true);
      
      // Get the file blob from API
      const response = await downloadFile(token, filename);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Try to get the original filename from headers
      const contentDisposition = response.headers['content-disposition'];
      let downloadFilename = filename;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          downloadFilename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', downloadFilename);
      document.body.appendChild(link);
      link.click();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Tải file thành công!',
        confirmButtonText: 'Đóng'
      });
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
      
    } catch (error) {
      console.error("Download failed:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.response?.data?.message || 'Tải file thất bại',
        confirmButtonText: 'Đóng'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.loaiquyetdinh.trim()) {
      errors.loaiquyetdinh = "Loại quyết định là bắt buộc";
      isValid = false;
    }

    if (!formData.nam.trim()) {
      errors.nam = "Năm quyết định là bắt buộc";
      isValid = false;
    }

    if (!formData.tenquyetdinh.trim()) {
      errors.tenquyetdinh = "Tên quyết định là bắt buộc";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddQuyetDinh = async () => {
    if (!validateForm()) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    try {
      setLoading(true);

      // Upload file first if exists
      let fileUrl = formData.fileUrl;
      if (file) {
        fileUrl = await handleUploadFile();
        if (!fileUrl) return;
      }

      const quyetDinhData = {
        ...formData,
        fileUrl: fileUrl || "",
      };

      const data = await createQuyetDinh(
        token,
        selectedDangVien.id,
        quyetDinhData
      );

      if (data.resultCode === 0) {
        setQuyetDinhList([...quyetDinhList, data.data]);
        setShowAddForm(false);
        resetForm();
        Swal.fire("Thành công", "Thêm quyết định thành công", "success");
      } else {
        throw new Error(data.message || "Thêm quyết định thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Thêm quyết định thất bại", "error");
      console.error("Error adding quyetDinh:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuyetDinh = async () => {
    if (!validateForm()) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    try {
      setLoading(true);

      // Upload new file if selected
      let fileUrl = formData.fileUrl;
      if (file) {
        fileUrl = await handleUploadFile();
        if (!fileUrl) return;
      }

      const quyetDinhData = {
        ...formData,
        fileUrl: fileUrl || formData.fileUrl,
      };

      const data = await updateQuyetDinh(
        token,
        selectedQuyetDinh.id,
        quyetDinhData
      );

      if (data.resultCode === 0) {
        setQuyetDinhList(
          quyetDinhList.map((item) =>
            item.id === selectedQuyetDinh.id ? data.data : item
          )
        );
        setShowEditForm(false);
        resetForm();
        Swal.fire("Thành công", "Cập nhật quyết định thành công", "success");
      } else {
        throw new Error(data.message || "Cập nhật quyết định thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi", "Cập nhật quyết định thất bại", "error");
      console.error("Error updating quyetDinh:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuyetDinh = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa quyết định này?",
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
        const data = await deleteQuyetDinh(token, id);
        // const data = await response.json();

        if (data.resultCode === 0) {
          setQuyetDinhList(quyetDinhList.filter((item) => item.id !== id));
          Swal.fire("Đã xóa", "Quyết định đã được xóa", "success");
        } else {
          throw new Error(data.message || "Xóa quyết định thất bại");
        }
      } catch (err) {
        Swal.fire("Lỗi", "Xóa quyết định thất bại", "error");
        console.error("Error deleting quyetDinh:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      loaiquyetdinh: "",
      nam: "",
      tenquyetdinh: "",
      fileUrl: "",
    });
    setFile(null);
    setFilePreview(null);
    setValidationErrors({
      loaiquyetdinh: "",
      nam: "",
      tenquyetdinh: "",
    });
  };

  const openAddForm = () => {
    resetForm();
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const openEditForm = (quyetDinh) => {
    setSelectedQuyetDinh(quyetDinh);
    setFormData({
      loaiquyetdinh: quyetDinh.loaiquyetdinh,
      nam: quyetDinh.nam,
      tenquyetdinh: quyetDinh.tenquyetdinh,
      fileUrl: quyetDinh.fileUrl,
    });
    setShowEditForm(true);
    setShowAddForm(false);
    setFile(null);
    setFilePreview(null);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Quyết định của Đảng viên: {selectedDangVien?.hoten}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !showAddForm && !showEditForm && (
          <>
            {quyetDinhList.length === 0 ? (
              <div className="text-center py-4">
                <p>Đảng viên này chưa có quyết định nào</p>
                <Button variant="primary" onClick={openAddForm}>
                  Thêm quyết định
                </Button>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-end mb-3">
                  <Button variant="primary" onClick={openAddForm}>
                    Thêm quyết định
                  </Button>
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Loại quyết định</th>
                      <th>Tên quyết định</th>
                      <th>Năm</th>
                      <th>File đính kèm</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quyetDinhList.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.loaiquyetdinh}</td>
                        <td>{item.tenquyetdinh}</td>
                        <td>{item.nam}</td>
                        <td>
                          {item.fileUrl ? (
                            <Button
                              variant="link"
                              onClick={() => handleDownloadFile(item.fileUrl)}
                            >
                              Tải xuống <i class="fa-solid fa-download"></i>
                            </Button>
                          ) : (
                            "Không có file"
                          )}
                        </td>
                        <td>
                          <td>
                            <div className="d-flex flex-wrap gap-2">
                              {/* {" "} */}
                              {/* Cho phép xuống dòng và có khoảng cách */}
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => openEditForm(item)}
                                title="Chỉnh sửa quyết định"
                              >
                                <i className="fas fa-edit"></i>
                                <span className="ms-1">Sửa</span>{" "}
                                {/* Khoảng cách giữa icon và chữ */}
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteQuyetDinh(item.id)}
                                title="Xóa quyết định"
                              >
                                <i className="fas fa-trash"></i>{" "}
                                {/* Icon thùng rác thay vì thẻ bài */}
                                <span className="ms-1">Xóa</span>
                              </button>
                            </div>
                          </td>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </>
        )}

        {(showAddForm || showEditForm) && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Loại quyết định *</Form.Label>
              <Form.Control
                type="text"
                name="loaiquyetdinh"
                value={formData.loaiquyetdinh}
                onChange={handleInputChange}
                placeholder="Nhập loại quyết định"
                isInvalid={!!validationErrors.loaiquyetdinh}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.loaiquyetdinh}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tên quyết định *</Form.Label>
              <Form.Control
                type="text"
                name="tenquyetdinh"
                value={formData.tenquyetdinh}
                onChange={handleInputChange}
                placeholder="Nhập tên quyết định"
                isInvalid={!!validationErrors.tenquyetdinh}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.tenquyetdinh}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Năm *</Form.Label>
              <Form.Control
                type="text"
                name="nam"
                value={formData.nam}
                onChange={handleInputChange}
                placeholder="Nhập năm quyết định"
                isInvalid={!!validationErrors.nam}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.nam}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>File đính kèm</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
              {filePreview && (
                <div className="mt-2">
                  <p>File mới: {file.name}</p>
                </div>
              )}
              {!file && formData.fileUrl && (
                <div className="mt-2">
                  <p>File hiện tại: {formData.fileUrl}</p>
                </div>
              )}
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!showAddForm && !showEditForm && (
          <Button variant="secondary" onClick={onHide}>
            Đóng
          </Button>
        )}

        {(showAddForm || showEditForm) && (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddForm(false);
                setShowEditForm(false);
                resetForm();
              }}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={showAddForm ? handleAddQuyetDinh : handleUpdateQuyetDinh}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : showAddForm ? "Thêm" : "Cập nhật"}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default QuyetDinhModal;
