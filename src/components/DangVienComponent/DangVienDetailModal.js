import React from "react";
import { Modal, Button, Tab, Tabs, Accordion } from "react-bootstrap";

const DangVienDetailModal = ({ show, onHide, selectedDangVien }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết Đảng viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedDangVien && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Thông tin cá nhân 1</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Họ và tên:</span>
                      <span>{selectedDangVien.hoten}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Ngày sinh:</span>
                      <span>
                        {new Date(selectedDangVien.ngaysinh).toLocaleDateString()}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Giới tính:</span>
                      <span>{selectedDangVien.gioitinh}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Quê quán:</span>
                      <span>{selectedDangVien.quequan}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Dân tộc:</span>
                      <span>{selectedDangVien.dantoc}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Trình độ văn hóa:</span>
                      <span>{selectedDangVien.trinhdovanhoa}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Nơi ở hiện nay:</span>
                      <span>{selectedDangVien.noihiennay}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chuyên môn:</span>
                      <span>{selectedDangVien.chuyennmon}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Thông tin Đảng</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chi bộ:</span>
                      <span>
                        {selectedDangVien.chibo?.tenchibo || "Không xác định"}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Ngày vào Đảng:</span>
                      <span>
                        {new Date(
                          selectedDangVien.ngayvaodang
                        ).toLocaleDateString()}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Ngày chính thức:</span>
                      <span>
                        {selectedDangVien.ngaychinhthuc
                          ? new Date(
                              selectedDangVien.ngaychinhthuc
                            ).toLocaleDateString()
                          : "Chưa chính thức"}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Người giới thiệu 1:</span>
                      <span>{selectedDangVien.nguoigioithieu1}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Người giới thiệu 2:</span>
                      <span>{selectedDangVien.nguoigioithieu2}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức vụ chính quyền:</span>
                      <span>{selectedDangVien.chucvuchinhquyen}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức vụ chi bộ:</span>
                      <span>{selectedDangVien.chucvuchibo}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức vụ Đảng ủy:</span>
                      <span>{selectedDangVien.chucvudanguy}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức vụ đoàn thể:</span>
                      <span>{selectedDangVien.chucvudoanthe}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Nơi sinh hoạt Đảng:</span>
                      <span>{selectedDangVien.noisinhhoatdang}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức danh:</span>
                      <span>{selectedDangVien.chucdanh}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Trình độ ngoại ngữ:</span>
                      <span>{selectedDangVien.trinhdongoaingu}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Trình độ chính trị:</span>
                      <span>{selectedDangVien.trinhdochinhtri}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Trạng thái:</span>
                      <span>
                        {selectedDangVien.trangthaidangvien === "chinhthuc"
                          ? "Chính thức"
                          : selectedDangVien.trangthaidangvien === "dubi"
                          ? "Dự bị"
                          : selectedDangVien.trangthaidangvien === "khaitru"
                          ? "Khai trừ"
                          : "Không xác định"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Body>
        {selectedDangVien && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Thông tin cá nhân 2</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Họ và tên:</span>
                      <span>{selectedDangVien.hoten}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Ngày sinh:</span>
                      <span>
                        {new Date(selectedDangVien.ngaysinh).toLocaleDateString()}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Giới tính:</span>
                      <span>{selectedDangVien.gioitinh}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Quê quán:</span>
                      <span>{selectedDangVien.quequan}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Dân tộc:</span>
                      <span>{selectedDangVien.dantoc}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Trình độ văn hóa:</span>
                      <span>{selectedDangVien.trinhdovanhoa}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Nơi ở hiện nay:</span>
                      <span>{selectedDangVien.noihiennay}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chuyên môn:</span>
                      <span>{selectedDangVien.chuyennmon}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Trình độ ngoại ngữ:</span>
                      <span>{selectedDangVien.trinhdongoaingu}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Trình độ chính trị:</span>
                      <span>{selectedDangVien.trinhdochinhtri}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Thông tin Đảng</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chi bộ:</span>
                      <span>
                        {selectedDangVien.chibo?.tenchibo || "Không xác định"}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Ngày vào Đảng:</span>
                      <span>
                        {new Date(
                          selectedDangVien.ngayvaodang
                        ).toLocaleDateString()}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Ngày chính thức:</span>
                      <span>
                        {selectedDangVien.ngaychinhthuc
                          ? new Date(
                              selectedDangVien.ngaychinhthuc
                            ).toLocaleDateString()
                          : "Chưa chính thức"}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Người giới thiệu 1:</span>
                      <span>{selectedDangVien.nguoigioithieu1}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Người giới thiệu 2:</span>
                      <span>{selectedDangVien.nguoigioithieu2}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức vụ chính quyền:</span>
                      <span>{selectedDangVien.chucvuchinhquyen}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức vụ chi bộ:</span>
                      <span>{selectedDangVien.chucvuchibo}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức vụ Đảng ủy:</span>
                      <span>{selectedDangVien.chucvudanguy}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức vụ đoàn thể:</span>
                      <span>{selectedDangVien.chucvudoanthe}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Nơi sinh hoạt Đảng:</span>
                      <span>{selectedDangVien.noisinhhoatdang}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Chức danh:</span>
                      <span>{selectedDangVien.chucdanh}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Trạng thái:</span>
                      <span>
                        {selectedDangVien.trangthaidangvien === "chinhthuc"
                          ? "Chính thức"
                          : selectedDangVien.trangthaidangvien === "dubi"
                          ? "Dự bị"
                          : selectedDangVien.trangthaidangvien === "khaitru"
                          ? "Khai trừ"
                          : "Không xác định"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>


      <Modal.Body>
        {selectedDangVien && (
          <Tabs defaultActiveKey="personal" className="mb-3">
            <Tab eventKey="personal" title="Thông tin cá nhân 3">
              <div className="p-3">
                <dl className="row">
                  <dt className="col-sm-4">Họ và tên:</dt>
                  <dd className="col-sm-8">{selectedDangVien.hoten}</dd>
                  <dt className="col-sm-4">Ngày sinh:</dt>
                  <dd className="col-sm-8">
                    {new Date(selectedDangVien.ngaysinh).toLocaleDateString()}
                  </dd>
                  <dt className="col-sm-4">Giới tính:</dt>
                  <dd className="col-sm-8">{selectedDangVien.gioitinh}</dd>
                  <dt className="col-sm-4">Quê quán:</dt>
                  <dd className="col-sm-8">{selectedDangVien.quequan}</dd>
                  <dt className="col-sm-4">Dân tộc:</dt>
                  <dd className="col-sm-8">{selectedDangVien.dantoc}</dd>
                  <dt className="col-sm-4">Trình độ văn hóa:</dt>
                  <dd className="col-sm-8">{selectedDangVien.trinhdovanhoa}</dd>
                  <dt className="col-sm-4">Nơi ở hiện nay:</dt>
                  <dd className="col-sm-8">{selectedDangVien.noihiennay}</dd>
                  <dt className="col-sm-4">Chuyên môn:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chuyennmon}</dd>
                  <dt className="col-sm-4">Trình độ ngoại ngữ:</dt>
                  <dd className="col-sm-8">{selectedDangVien.trinhdongoaingu}</dd>
                  <dt className="col-sm-4">Trình độ chính trị:</dt>
                  <dd className="col-sm-8">{selectedDangVien.trinhdochinhtri}</dd>
                </dl>
              </div>
            </Tab>
            <Tab eventKey="party" title="Thông tin Đảng">
              <div className="p-3">
                <dl className="row">
                  <dt className="col-sm-4">Chi bộ:</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.chibo?.tenchibo || "Không xác định"}
                  </dd>
                  <dt className="col-sm-4">Ngày vào Đảng:</dt>
                  <dd className="col-sm-8">
                    {new Date(selectedDangVien.ngayvaodang).toLocaleDateString()}
                  </dd>
                  <dt className="col-sm-4">Ngày chính thức:</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.ngaychinhthuc
                      ? new Date(selectedDangVien.ngaychinhthuc).toLocaleDateString()
                      : "Chưa chính thức"}
                  </dd>
                  <dt className="col-sm-4">Người giới thiệu 1:</dt>
                  <dd className="col-sm-8">{selectedDangVien.nguoigioithieu1}</dd>
                  <dt className="col-sm-4">Người giới thiệu 2:</dt>
                  <dd className="col-sm-8">{selectedDangVien.nguoigioithieu2}</dd>
                  <dt className="col-sm-4">Nơi sinh hoạt Đảng:</dt>
                  <dd className="col-sm-8">{selectedDangVien.noisinhhoatdang}</dd>
                  <dt className="col-sm-4">Trạng thái:</dt>
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
                  <dt className="col-sm-4">Chức vụ chính quyền:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvuchinhquyen}</dd>
                  <dt className="col-sm-4">Chức vụ chi bộ:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvuchibo}</dd>
                  <dt className="col-sm-4">Chức vụ Đảng ủy:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvudanguy}</dd>
                  <dt className="col-sm-4">Chức vụ đoàn thể:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvudoanthe}</dd>
                  <dt className="col-sm-4">Chức danh:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucdanh}</dd>
                </dl>
              </div>
            </Tab>
          </Tabs>
        )}
      </Modal.Body>

      <Modal.Body>
        {selectedDangVien && (
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Thông tin cá nhân 4</Accordion.Header>
              <Accordion.Body>
                <dl className="row">
                  <dt className="col-sm-4">Họ và tên:</dt>
                  <dd className="col-sm-8">{selectedDangVien.hoten}</dd>
                  <dt className="col-sm-4">Ngày sinh:</dt>
                  <dd className="col-sm-8">
                    {new Date(selectedDangVien.ngaysinh).toLocaleDateString()}
                  </dd>
                  <dt className="col-sm-4">Giới tính:</dt>
                  <dd className="col-sm-8">{selectedDangVien.gioitinh}</dd>
                  <dt className="col-sm-4">Quê quán:</dt>
                  <dd className="col-sm-8">{selectedDangVien.quequan}</dd>
                  <dt className="col-sm-4">Dân tộc:</dt>
                  <dd className="col-sm-8">{selectedDangVien.dantoc}</dd>
                  <dt className="col-sm-4">Trình độ văn hóa:</dt>
                  <dd className="col-sm-8">{selectedDangVien.trinhdovanhoa}</dd>
                  <dt className="col-sm-4">Nơi ở hiện nay:</dt>
                  <dd className="col-sm-8">{selectedDangVien.noihiennay}</dd>
                  <dt className="col-sm-4">Chuyên môn:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chuyennmon}</dd>
                  <dt className="col-sm-4">Trình độ ngoại ngữ:</dt>
                  <dd className="col-sm-8">{selectedDangVien.trinhdongoaingu}</dd>
                  <dt className="col-sm-4">Trình độ chính trị:</dt>
                  <dd className="col-sm-8">{selectedDangVien.trinhdochinhtri}</dd>
                </dl>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Thông tin Đảng</Accordion.Header>
              <Accordion.Body>
                <dl className="row">
                  <dt className="col-sm-4">Chi bộ:</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.chibo?.tenchibo || "Không xác định"}
                  </dd>
                  <dt className="col-sm-4">Ngày vào Đảng:</dt>
                  <dd className="col-sm-8">
                    {new Date(selectedDangVien.ngayvaodang).toLocaleDateString()}
                  </dd>
                  <dt className="col-sm-4">Ngày chính thức:</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.ngaychinhthuc
                      ? new Date(selectedDangVien.ngaychinhthuc).toLocaleDateString()
                      : "Chưa chính thức"}
                  </dd>
                  <dt className="col-sm-4">Người giới thiệu 1:</dt>
                  <dd className="col-sm-8">{selectedDangVien.nguoigioithieu1}</dd>
                  <dt className="col-sm-4">Người giới thiệu 2:</dt>
                  <dd className="col-sm-8">{selectedDangVien.nguoigioithieu2}</dd>
                  <dt className="col-sm-4">Nơi sinh hoạt Đảng:</dt>
                  <dd className="col-sm-8">{selectedDangVien.noisinhhoatdang}</dd>
                  <dt className="col-sm-4">Trạng thái:</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.trangthaidangvien === "chinhthuc"
                      ? "Chính thức"
                      : selectedDangVien.trangthaidangvien === "dubi"
                      ? "Dự bị"
                      : selectedDangVien.trangthaidangvien === "khaitru"
                      ? "Khai trừ"
                      : "Không xác định"}
                  </dd>
                  <dt className="col-sm-4">Chức vụ chính quyền:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvuchinhquyen}</dd>
                  <dt className="col-sm-4">Chức vụ chi bộ:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvuchibo}</dd>
                  <dt className="col-sm-4">Chức vụ Đảng ủy:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvudanguy}</dd>
                  <dt className="col-sm-4">Chức vụ đoàn thể:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvudoanthe}</dd>
                  <dt className="col-sm-4">Chức danh:</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucdanh}</dd>
                </dl>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
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