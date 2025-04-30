import React from "react";
import { Modal, Button } from "react-bootstrap";
import ChiBoForm from "./ChiBoForm";

const ChiBoEditModal = ({
  show,
  onHide,
  formData,
  validationErrors,
  handleInputChange,
  handleUpdateChiBo,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật chi bộ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ChiBoForm
          formData={formData}
          validationErrors={validationErrors}
          handleInputChange={handleInputChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleUpdateChiBo} disabled={loading}>
          {loading ? "Đang xử lý..." : "Lưu thay đổi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChiBoEditModal;