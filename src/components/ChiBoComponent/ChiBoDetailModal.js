import React from "react";
import { Modal, Button, Tabs, Tab } from "react-bootstrap";

const ChiBoDetailModal = ({ show, onHide, selectedChiBo, xepLoaiList }) => {
  // Function to pair xepLoaiList items for display in rows
  const pairedXepLoaiList = [];
  if (xepLoaiList.length > 1) {
    for (let i = 0; i < xepLoaiList.length; i += 2) {
      pairedXepLoaiList.push({
        first: xepLoaiList[i],
        second: xepLoaiList[i + 1] || null, // Handle odd number of items
      });
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết chi bộ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedChiBo && (
          <Tabs defaultActiveKey="info" className="mb-3">
            <Tab eventKey="info" title="Thông tin chi bộ">
              <div className="p-3">
                <dl className="row">
                  <dt className="col-sm-4">Tên chi bộ</dt>
                  <dd className="col-sm-8">{selectedChiBo.tenchibo}</dd>
                  <dt className="col-sm-4">Tên Đảng ủy cấp trên</dt>
                  <dd className="col-sm-8">{selectedChiBo.danguycaptren}</dd>
                  <dt className="col-sm-4">Họ và tên bí thư</dt>
                  <dd className="col-sm-8">{selectedChiBo.bithu}</dd>
                  <dt className="col-sm-4">Họ và tên phó bí thư</dt>
                  <dd className="col-sm-8">{selectedChiBo.phobithu}</dd>
                  <dt className="col-sm-4">Địa chỉ</dt>
                  <dd className="col-sm-8">{selectedChiBo.diachi}</dd>
                  <dt className="col-sm-4">Ngày thành lập chi bộ</dt>
                  <dd className="col-sm-8">{selectedChiBo.ngaythanhlap}</dd>
                  <dt className="col-sm-4">Trạng thái hoạt động</dt>
                  <dd className="col-sm-8">
                    {selectedChiBo.trangthai === "hoatdong"
                      ? "Hoạt động"
                      : selectedChiBo.trangthai === "giaithe"
                      ? "Giải thể"
                      : selectedChiBo.trangthai === "tamdung"
                      ? "Tạm dừng"
                      : ""}
                  </dd>
                  <dt className="col-sm-4">Ghi chú</dt>
                  <dd className="col-sm-8">{selectedChiBo.ghichu}</dd>
                </dl>
              </div>
            </Tab>
            <Tab eventKey="classification" title="Xếp loại chi bộ">
              <div className="p-3">
                {xepLoaiList.length === 0 ? (
                  <div className="text-muted">Chi bộ chưa được xếp loại</div>
                ) : xepLoaiList.length === 1 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Năm</th>
                          <th>Xếp loại</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr key={xepLoaiList[0].id}>
                          <td>{xepLoaiList[0].nam}</td>
                          <td>
                            {xepLoaiList[0].xeploai === "xuatsac"
                              ? "Hoàn thành xuất sắc nhiệm vụ"
                              : xepLoaiList[0].xeploai === "tot"
                              ? "Hoàn thành tốt nhiệm vụ"
                              : xepLoaiList[0].xeploai === "hoanthanh"
                              ? "Hoàn thành nhiệm vụ"
                              : "Không hoàn thành nhiệm vụ"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Năm</th>
                          <th>Xếp loại</th>
                          <th>Năm</th>
                          <th>Xếp loại</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pairedXepLoaiList.map((pair, index) => (
                          <tr key={index}>
                            <td>{pair.first.nam}</td>
                            <td>
                              {pair.first.xeploai === "xuatsac"
                                ? "Hoàn thành xuất sắc nhiệm vụ"
                                : pair.first.xeploai === "tot"
                                ? "Hoàn thành tốt nhiệm vụ"
                                : pair.first.xeploai === "hoanthanh"
                                ? "Hoàn thành nhiệm vụ"
                                : "Không hoàn thành nhiệm vụ"}
                            </td>
                            <td>{pair.second ? pair.second.nam : ""}</td>
                            <td>
                              {pair.second
                                ? pair.second.xeploai === "xuatsac"
                                  ? "Hoàn thành xuất sắc nhiệm vụ"
                                  : pair.second.xeploai === "tot"
                                  ? "Hoàn thành tốt nhiệm vụ"
                                  : pair.second.xeploai === "hoanthanh"
                                  ? "Hoàn thành nhiệm vụ"
                                  : "Không hoàn thành nhiệm vụ"
                                : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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

export default ChiBoDetailModal;