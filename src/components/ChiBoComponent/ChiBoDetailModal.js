import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ChiBoDetailModal = ({ show, onHide, selectedChiBo, xepLoaiList }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết chi bộ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedChiBo && (
          <div>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên chi bộ</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedChiBo.tenchibo}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên Đảng ủy cấp trên</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedChiBo.danguycaptren}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ và tên bí thư</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedChiBo.bithu}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Họ và tên phó bí thư</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedChiBo.phobithu}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedChiBo.diachi}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ngày thành lập chi bộ</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedChiBo.ngaythanhlap}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái hoạt động của chi bộ</Form.Label>
              <Form.Control
                type="text"
                value={
                  selectedChiBo.trangthai === "hoatdong"
                    ? "Hoạt động"
                    : selectedChiBo.trangthai === "giaithe"
                    ? "Giải thể"
                    : selectedChiBo.trangthai === "tamdung"
                    ? "Tạm dừng"
                    : ""
                }
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={selectedChiBo.ghichu}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Danh sách xếp loại chi bộ</Form.Label>
              {xepLoaiList.length === 0 ? (
                <div className="text-muted">Chi bộ chưa được xếp loại</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Năm</th>
                        <th>Xếp loại</th>
                      </tr>
                    </thead>
                    <tbody>
                      {xepLoaiList.map((item) => (
                        <tr key={item.id}>
                          <td>{item.nam}</td>
                          <td>
                            {item.xeploai === "xuatsac"
                              ? "Hoàn thành xuất sắc nhiệm vụ"
                              : item.xeploai === "tot"
                              ? "Hoàn thành tốt nhiệm vụ"
                              : item.xeploai === "hoanthanh"
                              ? "Hoàn thành nhiệm vụ"
                              : "Không hoàn thành nhiệm vụ"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Form.Group>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChiBoDetailModal;