import React from "react";
import { Modal, Button, Form, Row, Col, Badge, Spinner } from "react-bootstrap";

const HoSoDangVienEditModal = ({
  show,
  onHide,
  formData,
  handleInputChange,
  handleFileChange,
  handleUpdateHoSo,
  selectedDangVien,
  selectedHoSo,
  loading,
  handleDownloadFile,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật Hồ Sơ Đảng Viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Tập hồ sơ <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="taphoso"
                  value={formData.taphoso}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn tập hồ sơ</option>
                  <option value="tap1">Tập 1</option>
                  <option value="tap2">Tập 2</option>
                  <option value="tap3">Tập 3</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Loại hồ sơ <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="loaihoso"
                  value={formData.loaihoso}
                  onChange={handleInputChange}
                  placeholder="Nhập loại hồ sơ"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>File hồ sơ</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                {formData.fileUrl && (
                  <div className="mt-2">
                    <a
                      onClick={() => handleDownloadFile(formData.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      File hiện tại: {formData.fileUrl}
                    </a>
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="ghichu"
                  value={formData.ghichu}
                  onChange={handleInputChange}
                  placeholder="Nhập ghi chú"
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <h6>Đảng viên: {selectedDangVien?.hoten}</h6>
            <p>
              Trạng thái:{" "}
              <Badge
                bg={
                  selectedHoSo?.trangthai === "approved"
                    ? "success"
                    : selectedHoSo?.trangthai === "rejected"
                    ? "danger"
                    : "warning"
                }
              >
                {selectedHoSo?.trangthai === "approved"
                  ? "Đã duyệt"
                  : selectedHoSo?.trangthai === "rejected"
                  ? "Từ chối"
                  : "Chờ duyệt"}
              </Badge>
            </p>
            {selectedHoSo?.thoigianpheduyet && (
              <p>Thời gian phê duyệt: {selectedHoSo.thoigianpheduyet}</p>
            )}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleUpdateHoSo}
          disabled={!formData.taphoso || !formData.loaihoso || loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Đang xử lý...</span>
            </>
          ) : (
            "Cập nhật"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HoSoDangVienEditModal;