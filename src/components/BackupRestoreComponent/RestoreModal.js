import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";

const RestoreModal = ({
  show,
  onHide,
  selectedFile,
  loading,
  validationError,
  onFileChange,
  onRestore,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>Khôi phục dữ liệu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Chọn file sao lưu *</Form.Label>
            <Form.Control
              type="file"
              accept=".sql"
              onChange={onFileChange}
              isInvalid={!!validationError}
            />
            <Form.Control.Feedback type="invalid">
              {validationError}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Vui lòng chọn file .sql để khôi phục dữ liệu.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={onRestore}
          disabled={loading || !selectedFile}
        >
          {loading ? "Đang xử lý..." : "Khôi phục"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RestoreModal;