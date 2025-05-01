import React from "react";
import { Modal, Button, Tab, Tabs } from "react-bootstrap";

const DangVienDetailModal = ({ show, onHide, selectedDangVien }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết Đảng viên</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {selectedDangVien && (
          <Tabs defaultActiveKey="personal" className="mb-3">
            <Tab eventKey="personal" title="Thông tin cá nhân">
              <div className="p-3">
                <dl className="row">
                  <dt className="col-sm-4">Họ và tên</dt>
                  <dd className="col-sm-8">{selectedDangVien.hoten}</dd>
                  <dt className="col-sm-4">Ngày sinh</dt>
                  <dd className="col-sm-8">
                    {new Date(selectedDangVien.ngaysinh).toLocaleDateString()}
                  </dd>
                  <dt className="col-sm-4">Giới tính</dt>
                  <dd className="col-sm-8">{selectedDangVien.gioitinh}</dd>
                  <dt className="col-sm-4">Quê quán</dt>
                  <dd className="col-sm-8">{selectedDangVien.quequan}</dd>
                  <dt className="col-sm-4">Dân tộc</dt>
                  <dd className="col-sm-8">{selectedDangVien.dantoc}</dd>
                  <dt className="col-sm-4">Trình độ văn hóa</dt>
                  <dd className="col-sm-8">{selectedDangVien.trinhdovanhoa}</dd>
                  <dt className="col-sm-4">Nơi ở hiện nay</dt>
                  <dd className="col-sm-8">{selectedDangVien.noihiennay}</dd>
                  <dt className="col-sm-4">Chuyên môn</dt>
                  <dd className="col-sm-8">{selectedDangVien.chuyennmon}</dd>
                  <dt className="col-sm-4">Trình độ ngoại ngữ</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.trinhdongoaingu}
                  </dd>
                  <dt className="col-sm-4">Trình độ chính trị</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.trinhdochinhtri}
                  </dd>
                </dl>
              </div>
            </Tab>
            <Tab eventKey="party" title="Thông tin Đảng">
              <div className="p-3">
                <dl className="row">
                  <dt className="col-sm-4">Chi bộ</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.chibo?.tenchibo || "Không xác định"}
                  </dd>
                  <dt className="col-sm-4">Ngày vào Đảng</dt>
                  <dd className="col-sm-8">
                    {new Date(
                      selectedDangVien.ngayvaodang
                    ).toLocaleDateString()}
                  </dd>
                  <dt className="col-sm-4">Ngày chính thức</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.ngaychinhthuc
                      ? new Date(
                          selectedDangVien.ngaychinhthuc
                        ).toLocaleDateString()
                      : "Chưa chính thức"}
                  </dd>
                  <dt className="col-sm-4">Người giới thiệu 1</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.nguoigioithieu1}
                  </dd>
                  <dt className="col-sm-4">Người giới thiệu 2</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.nguoigioithieu2}
                  </dd>
                  <dt className="col-sm-4">Nơi sinh hoạt Đảng</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.noisinhhoatdang}
                  </dd>
                  <dt className="col-sm-4">Trạng thái</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.trangthaidangvien === "chinhthuc"
                      ? "Chính thức"
                      : selectedDangVien.trangthaidangvien === "dubi"
                      ? "Dự bị"
                      : selectedDangVien.trangthaidangvien === "khaitru"
                      ? "Khai trừ"
                      : "Không xác định"}
                  </dd>
                </dl>
              </div>
            </Tab>
            <Tab eventKey="position" title="Chức vụ">
              <div className="p-3">
                <dl className="row">
                  <dt className="col-sm-4">Chức vụ chính quyền</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.chucvuchinhquyen}
                  </dd>
                  <dt className="col-sm-4">Chức vụ chi bộ</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvuchibo}</dd>
                  <dt className="col-sm-4">Chức vụ Đảng ủy</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvudanguy}</dd>
                  <dt className="col-sm-4">Chức vụ đoàn thể</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvudoanthe}</dd>
                  <dt className="col-sm-4">Chức danh</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucdanh}</dd>
                </dl>
              </div>
            </Tab>
          </Tabs>
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

export default DangVienDetailModal;
