import React from "react";
import { Table, Alert, Spinner } from "react-bootstrap";

const QuyetDinhTabContent = ({
  quyetDinhList,
  onDownload,
  loading
}) => {
  return (
    <div className="p-3">
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : quyetDinhList.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại quyết định</th>
              <th>Tên quyết định</th>
              <th>Năm</th>
              <th>File đính kèm</th>
            </tr>
          </thead>
          <tbody>
            {quyetDinhList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.loaiquyetdinh}</td>
                <td>{item.tenquyetdinh}</td>
                <td>{item.nam}</td>
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
          <Alert variant="info">
            Đảng viên chưa có quyết định nào
          </Alert>
        </div>
      )}
    </div>
  );
};

export default QuyetDinhTabContent;