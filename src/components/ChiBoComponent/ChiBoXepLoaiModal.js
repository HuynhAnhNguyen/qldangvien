import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ChiBoXepLoaiModal = ({
  show,
  onHide,
  selectedChiBo,
  xepLoaiList,
  xepLoaiForm,
  editXepLoaiId,
  setEditXepLoaiId,
  handleXepLoaiInputChange,
  handleCreateXepLoai,
  handleUpdateXepLoai,
  validationErrors,
  loading,
  setXepLoaiForm, // Added missing prop
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Xếp loại chi bộ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Năm <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="nam"
                  value={xepLoaiForm.nam}
                  onChange={handleXepLoaiInputChange}
                  isInvalid={!!validationErrors.nam}
                  disabled={editXepLoaiId !== null}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.nam}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Hình thức xếp loại <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="xeploai"
                  value={xepLoaiForm.xeploai}
                  onChange={handleXepLoaiInputChange}
                  isInvalid={!!validationErrors.xeploai}
                >
                  <option value="">Chọn xếp loại</option>
                  <option value="xuatsac">Hoàn thành xuất sắc nhiệm vụ</option>
                  <option value="tot">Hoàn thành tốt nhiệm vụ</option>
                  <option value="hoanthanh">Hoàn thành nhiệm vụ</option>
                  <option value="khonghoanthanh">Không hoàn thành nhiệm vụ</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {validationErrors.xeploai}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <Button
          variant="primary"
          onClick={editXepLoaiId ? handleUpdateXepLoai : handleCreateXepLoai}
          disabled={loading}
          className="mb-3"
        >
          {loading
            ? "Đang xử lý..."
            : editXepLoaiId
            ? "Cập nhật xếp loại"
            : "Xếp loại chi bộ"}
        </Button>
        {xepLoaiList.length === 0 ? (
          <div className="text-muted">Chi bộ chưa được xếp loại</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Năm</th>
                  <th>Xếp loại</th>
                  <th>Thao tác</th>
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
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => {
                          setEditXepLoaiId(item.id);
                          setXepLoaiForm({
                            nam: item.nam,
                            xeploai: item.xeploai,
                          });
                        }}
                        title="Chỉnh sửa xếp loại"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default ChiBoXepLoaiModal;