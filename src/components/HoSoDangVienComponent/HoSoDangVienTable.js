import React from "react";
import { Badge } from "react-bootstrap";

const HoSoDangVienTable = ({
  hoSoList,
  selectedDangVien,
  searchTerm,
  loading,
  error,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  openEditModal,
  handleDeleteHoSo,
  searchType,
}) => {
  // Filter hồ sơ based on search term
  const filteredHoSo = hoSoList.filter(
    (item) =>
      item.taphoso?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item.loaihoso?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredHoSo.length / itemsPerPage);
  const currentItems = filteredHoSo.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!selectedDangVien ? (
        <div className="text-center py-4 text-muted">
          Vui lòng chọn Đảng viên để xem danh sách hồ sơ
        </div>
      ) : filteredHoSo.length === 0 ? (
        <div className="text-center py-4 text-muted">
          Không có hồ sơ {searchType === "approved" ? "đã duyệt" : ""} của Đảng
          viên <strong>{selectedDangVien.hoten}</strong>
        </div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "5%" }}>STT</th>
                  <th style={{ width: "15%" }}>Tập hồ sơ</th>
                  <th style={{ width: "20%" }}>Loại hồ sơ</th>
                  <th style={{ width: "15%" }}>Trạng thái</th>
                  <th style={{ width: "15%" }}>Thời gian tạo</th>
                  <th style={{ width: "15%" }}>Người phê duyệt</th>
                  <th style={{ width: "15%" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                          item.trangthai === "saved"
                            ? "info"
                            : item.trangthai === "approved"
                            ? "success"
                            : item.trangthai === "rejected"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {item.trangthai === "saved"
                          ? "Đã lưu"
                          : item.trangthai === "approved"
                          ? "Đã duyệt"
                          : item.trangthai === "rejected"
                          ? "Từ chối"
                          : "Chờ duyệt"}
                      </Badge>
                    </td>
                    {/* <td>{item.thoigiantao}</td> */}
                    <td>
                      {item.thoigiantao
                        ? new Date(item.thoigiantao).toLocaleString()
                        : "Không có"}
                    </td>
                    <td>{item.nguoipheduyet || "Chưa phê duyệt"}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary btn-outline-primary-detail"
                          onClick={() => openEditModal(item)}
                          title="Chỉnh sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteHoSo(item.id)}
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-auto p-3 bg-light border-top">
              <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      « Trước
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <li
                        key={page}
                        className={`page-item ${
                          page === currentPage ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Tiếp »
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default HoSoDangVienTable;
