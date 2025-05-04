import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const TaiKhoanAddModal = ({
  show,
  onHide,
  formData,
  handleInputChange,
  validationErrors,
  roles,
  handleAddAccount,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thêm tài khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Họ và tên <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.fullname}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.fullname}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Username <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.userName}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.userName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Mật khẩu <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="passWord"
                  value={formData.passWord}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.passWord}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.passWord}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Xác nhận mật khẩu <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Vai trò <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.roleName}
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.id} - {role.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.roleName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleAddAccount} disabled={loading}>
          {loading ? "Đang xử lý..." : "Thêm mới"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaiKhoanAddModal;