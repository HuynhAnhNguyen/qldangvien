import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const ChiBoForm = ({ formData, validationErrors, handleInputChange }) => {
  return (
    <Form>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Tên chi bộ <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="tenchibo"
              value={formData.tenchibo}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.tenchibo}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.tenchibo}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Tên Đảng ủy cấp trên <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="danguycaptren"
              value={formData.danguycaptren}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.danguycaptren}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.danguycaptren}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Họ và tên bí thư <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="bithu"
              value={formData.bithu}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.bithu}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.bithu}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Họ và tên phó bí thư</Form.Label>
            <Form.Control
              type="text"
              name="phobithu"
              value={formData.phobithu}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.phobithu}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.phobithu}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="diachi"
              value={formData.diachi}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.diachi}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.diachi}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Ngày thành lập chi bộ <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="date"
              name="ngaythanhlap"
              value={formData.ngaythanhlap}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.ngaythanhlap}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.ngaythanhlap}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Trạng thái hoạt động của chi bộ <span className="text-danger">*</span></Form.Label>
        <Form.Select
          name="trangthai"
          value={formData.trangthai}
          onChange={handleInputChange}
          isInvalid={!!validationErrors.trangthai}
        >
          <option value="">Chọn trạng thái</option>
          <option value="hoatdong">Hoạt động</option>
          <option value="giaithe">Giải thể</option>
          <option value="tamdung">Tạm dừng</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {validationErrors.trangthai}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ghi chú</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="ghichu"
          value={formData.ghichu}
          onChange={handleInputChange}
          isInvalid={!!validationErrors.ghichu}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.ghichu}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );
};

export default ChiBoForm;