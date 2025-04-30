import React from "react";
import { Modal, Button } from "react-bootstrap";
import DangVienForm from "./DangVienForm";

const DangVienAddModal = ({
  show,
  onHide,
  formData,
  validationErrors,
  chiBoList,
  handleInputChange,
  handleAddDangVien,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thêm Đảng viên</Modal.Title>
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
          onClick={handleAddDangVien}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Thêm mới"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DangVienAddModal;