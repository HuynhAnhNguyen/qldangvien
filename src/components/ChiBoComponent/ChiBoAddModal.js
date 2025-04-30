import React from "react";
import { Modal, Button } from "react-bootstrap";
import ChiBoForm from "./ChiBoForm";

const ChiBoAddModal = ({
  show,
  onHide,
  formData,
  validationErrors,
  handleInputChange,
  handleAddChiBo,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thêm chi bộ</Modal.Title>
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
        <Button variant="primary" onClick={handleAddChiBo} disabled={loading}>
          {loading ? "Đang xử lý..." : "Thêm mới"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChiBoAddModal;