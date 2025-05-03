import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const KyDangPhiEditModal = ({
  show,
  onHide,
  formData,
  setFormData,
  validationErrors,
  handleUpdate,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật Kỳ Đảng Phí</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Tên kỳ đảng phí <span className="text-danger">*</span>
            </Form.Label>
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
            <Form.Label>
              Số tiền <span className="text-danger">*</span>
            </Form.Label>
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
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={loading}>
          {loading ? "Đang xử lý..." : "Lưu thay đổi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default KyDangPhiEditModal;