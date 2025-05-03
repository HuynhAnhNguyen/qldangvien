import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const TheDangModal = ({
  show,
  onHide,
  selectedDangVien,
  theDangData,
  setTheDangData,
  showAddTheDangForm,
  setShowAddTheDangForm,
  theDangFormData,
  setTheDangFormData,
  validationErrors,
  token,
  fetchTheDang,
  createTheDang,
  updateTheDang,
  deleteTheDang,
  loading,
  setLoading,
}) => {
  // Hàm tạo thẻ Đảng
  const handleCreateTheDang = async () => {
    if (!theDangFormData.mathe || !theDangFormData.noicapthe) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin thẻ Đảng", "error");
      return;
    }
    try {
      setLoading(true);
      const response = await createTheDang(
        token,
        selectedDangVien.id,
        theDangFormData
      );
      if (response.resultCode === 0) {
        setTheDangData(response.data);
        setShowAddTheDangForm(false);
        Swal.fire("Thành công", "Thêm thẻ Đảng thành công", "success");
      } else {
        Swal.fire("Thất bại", response.message, "error");
      }
    } catch (error) {
      Swal.fire(
        "Lỗi",
        error.message || "Đã xảy ra lỗi khi thêm thẻ Đảng",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa thẻ Đảng
  const handleDeleteTheDang = async () => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa thẻ Đảng này?",
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
        const response = await deleteTheDang(token, theDangData.thedangId);
        if (response.resultCode === 0) {
          setTheDangData(null);
          setShowAddTheDangForm(true);
          Swal.fire("Đã xóa", "Thẻ Đảng đã được xóa", "success");
        } else {
          throw new Error(response.message || "Xóa thẻ Đảng thất bại");
        }
      } catch (error) {
        Swal.fire("Lỗi", "Xóa thẻ Đảng thất bại", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Hàm cập nhật thẻ Đảng
  const handleUpdateTheDang = async () => {
    if (!theDangFormData.mathe || !theDangFormData.noicapthe) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin thẻ Đảng", "error");
      return;
    }
    try {
      setLoading(true);
      const response = await updateTheDang(
        token,
        theDangData.thedangId,
        theDangFormData
      );
      if (response.resultCode === 0) {
        setTheDangData({
          id: response.data.thedangId || response.data.id,
          mathe: response.data.mathe,
          ngaycap: response.data.ngaycap,
          noicapthe: response.data.noicapthe,
        });
        setShowAddTheDangForm(false);
        Swal.fire("Thành công", "Cập nhật thẻ Đảng thành công", "success");
      } else {
        throw new Error(response.message || "Cập nhật thẻ Đảng thất bại");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Cập nhật thẻ Đảng thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {showAddTheDangForm ? "Thêm/Cập nhật thẻ Đảng" : "Thẻ Đảng viên"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAddTheDangForm ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Số thẻ <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="mathe"
                value={theDangFormData.mathe}
                onChange={(e) =>
                  setTheDangFormData({
                    ...theDangFormData,
                    mathe: e.target.value,
                  })
                }
                placeholder="Nhập số thẻ"
                required
                isInvalid={!!validationErrors.mathe}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.mathe}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày cấp <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="ngaycap"
                value={theDangFormData.ngaycap}
                onChange={(e) =>
                  setTheDangFormData({
                    ...theDangFormData,
                    ngaycap: e.target.value,
                  })
                }
                required
                isInvalid={!!validationErrors.ngaycap}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.ngaycap}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nơi cấp <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="noicapthe"
                value={theDangFormData.noicapthe}
                onChange={(e) =>
                  setTheDangFormData({
                    ...theDangFormData,
                    noicapthe: e.target.value,
                  })
                }
                placeholder="Nhập nơi cấp"
                required
                isInvalid={!!validationErrors.noicapthe}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.noicapthe}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        ) : theDangData ? (
          <div className="creative-full-bg-card">
            <div className="title">Thẻ Đảng Viên</div>
            <div className="subtitle">Đảng Cộng sản Việt Nam</div>
            <div className="name-section">
              {selectedDangVien?.hoten?.toUpperCase() || "N/A"}
            </div>
            <div className="number-section">
              Số: {theDangData.mathe || "N/A"}
            </div>
            <div className="info-container">
              <div className="info-left">
                <div>
                  Ngày cấp:{" "}
                  {theDangData.ngaycap
                    ? new Date(theDangData.ngaycap).toLocaleDateString("vi-VN")
                    : "N/A"}
                </div>
                {selectedDangVien?.ngayvaodang && (
                  <div>
                    Ngày vào Đảng:{" "}
                    {new Date(
                      selectedDangVien.ngayvaodang
                    ).toLocaleDateString("vi-VN")}
                  </div>
                )}
              </div>
              <div className="info-right">
                <div>Nơi cấp: {theDangData.noicapthe || "N/A"}</div>
                {selectedDangVien?.ngaychinhthuc && (
                  <div>
                    Ngày chính thức:{" "}
                    {new Date(
                      selectedDangVien.ngaychinhthuc
                    ).toLocaleDateString("vi-VN")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}
      </Modal.Body>
      <Modal.Footer>
        {showAddTheDangForm ? (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddTheDangForm(false);
                if (!theDangData) onHide();
              }}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={theDangData ? handleUpdateTheDang : handleCreateTheDang}
              disabled={
                loading ||
                !theDangFormData.mathe ||
                !theDangFormData.noicapthe
              }
            >
              {loading
                ? "Đang xử lý..."
                : theDangData
                ? "Cập nhật"
                : "Thêm thẻ"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="danger"
              onClick={handleDeleteTheDang}
              disabled={loading}
            >
              <i className="fas fa-trash me-1"></i> Xóa thẻ
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setTheDangFormData({
                  mathe: theDangData.mathe,
                  ngaycap: theDangData.ngaycap,
                  noicapthe: theDangData.noicapthe,
                });
                setShowAddTheDangForm(true);
              }}
              disabled={loading}
            >
              <i className="fas fa-edit me-1"></i> Cập nhật
            </Button>
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              Đóng
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default TheDangModal;