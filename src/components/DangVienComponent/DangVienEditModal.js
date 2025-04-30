import React from "react";
import { Modal, Button } from "react-bootstrap";
import DangVienForm from "./DangVienForm";

const DangVienEditModal = ({
  show,
  onHide,
  formData,
  validationErrors,
  chiBoList,
  handleInputChange,
  handleUpdateDangVien,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật Đảng viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DangVienForm
          formData={formData}
          validationErrors={validationErrors}
          chiBoList={chiBoList}
          handleInputChange={handleInputChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleUpdateDangVien}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Lưu thay đổi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DangVienEditModal;