import React from "react";
import { Table, Alert, Spinner, Badge } from "react-bootstrap";

const HoSoDangVienTabContent = ({ hoSoList, onDownload, loading }) => {
  return (
    <div className="p-3">
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : hoSoList.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tập hồ sơ</th>
              <th>Loại hồ sơ</th>
              <th>Trạng thái</th>
              <th>Thời gian tạo</th>
              <th>File đính kèm</th>
            </tr>
          </thead>
          <tbody>
            {hoSoList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>
                  {item.taphoso === "tap1"
                    ? "Tập 1"
                    : item.taphoso === "tap2"
                    ? "Tập 2"
                    : "Tập 3"}
                </td>
                <td>{item.loaihoso}</td>
                <td>
                  <Badge
                    bg={
                      item.trangthai === "approved"
                        ? "success"
                        : item.trangthai === "reject"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {item.trangthai === "approved"
                      ? "Đã duyệt"
                      : item.trangthai === "reject"
                      ? "Từ chối"
                      : "Chờ duyệt"}
                  </Badge>
                </td>
                <td>
                  {" "}
                  {item.thoigiantao
                    ? new Date(item.thoigiantao).toLocaleString()
                    : "Không có"}
                </td>

                <td>
                  {item.fileUrl ? (
                    <button
                      className="btn btn-link p-0 border-0 bg-transparent"
                      onClick={() => onDownload(item.fileUrl)}
                    >
                      <i className="fas fa-download me-1"></i> Tải xuống
                    </button>
                  ) : (
                    "Không có file"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center py-4">
          <Alert variant="info">Đảng viên chưa có hồ sơ nào</Alert>
        </div>
      )}
    </div>
  );
};

export default HoSoDangVienTabContent;
