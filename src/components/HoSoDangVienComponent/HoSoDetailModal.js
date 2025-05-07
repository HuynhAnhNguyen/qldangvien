import React from "react";
import { Modal, Button, Badge, Row, Col } from "react-bootstrap";

const HoSoDetailModal = ({ 
  show, 
  onHide, 
  hoSoDetail, 
  selectedDangVien,
  handleDownloadFile 
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết Hồ Sơ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {hoSoDetail ? (
          <div>
            <Row className="mb-3">
              <Col md={6}>
                <h6>Tập hồ sơ:</h6>
                <p>
                  {hoSoDetail.taphoso === "tap1"
                    ? "Tập 1"
                    : hoSoDetail.taphoso === "tap2"
                    ? "Tập 2"
                    : "Tập 3"}
                </p>
              </Col>
              <Col md={6}>
                <h6>Loại hồ sơ:</h6>
                <p>{hoSoDetail.loaihoso}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <h6>File hồ sơ:</h6>
                {hoSoDetail.fileUrl && (
                  <p>
                    <a
                      onClick={() => handleDownloadFile(hoSoDetail.fileUrl)}
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      {hoSoDetail.fileUrl}
                    </a>
                  </p>
                )}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <h6>Ghi chú:</h6>
                <p>{hoSoDetail.ghichu || "Không có ghi chú"}</p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <h6>Trạng thái:</h6>
                <Badge
                  bg={
                    hoSoDetail.trangthai === "approved"
                      ? "success"
                      : hoSoDetail.trangthai === "reject"
                      ? "danger"
                      : "warning"
                  }
                >
                  {hoSoDetail.trangthai === "approved"
                    ? "Đã duyệt"
                    : hoSoDetail.trangthai === "reject"
                    ? "Từ chối"
                    : "Chờ duyệt"}
                </Badge>
              </Col>
              <Col md={6}>
                <h6>Thời gian tạo:</h6>
                <p>
                  {hoSoDetail.thoigiantao
                    ? new Date(hoSoDetail.thoigiantao).toLocaleString()
                    : "Không có"}
                </p>
              </Col>
            </Row>
            {hoSoDetail.trangthai === "approved" && (
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Người phê duyệt:</h6>
                  <p>{hoSoDetail.nguoipheduyet}</p>
                </Col>
                <Col md={6}>
                  <h6>Thời gian phê duyệt:</h6>
                  <p>
                    {hoSoDetail.thoigianpheduyet
                      ? new Date(hoSoDetail.thoigianpheduyet).toLocaleString()
                      : "Không có"}
                  </p>
                </Col>
              </Row>
            )}
            <div className="mt-3">
              <h6>Đảng viên: {selectedDangVien?.hoten}</h6>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p>Không có thông tin chi tiết</p>
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

export default HoSoDetailModal;