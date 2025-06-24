import React from "react";
import { Badge, Button } from "react-bootstrap";

const DangPhiTable = ({
  trangThaiList,
  kyDangPhiList,
  searchTerm,
  searchType,
  selectedKyDangPhi,
  selectedDangVien,
  loading,
  error,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleConfirmDangPhi,
}) => {
  // Filter trạng thái based on search term
  const filteredTrangThai = trangThaiList.filter((item) => {
    const hoten = item.hotenDangvien?.toLowerCase() || "";
    const tenKy =
      kyDangPhiList
        .find((ky) => ky.id === item.kydangphiId)
        ?.ten?.toLowerCase() || "";
    return (
      hoten.includes(searchTerm.toLowerCase()) ||
      tenKy.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredTrangThai.length / itemsPerPage);
  const currentItems = filteredTrangThai.slice(
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

      {!selectedKyDangPhi && !selectedDangVien ? (
        <div className="text-center py-4 text-muted">
          Vui lòng chọn {searchType === "ky" ? "kỳ Đảng phí" : "Đảng viên"} để
          xem danh sách
        </div>
      ) : filteredTrangThai.length === 0 ? (
        <div className="text-center py-4 text-muted">
          Không có dữ liệu Đảng phí cho{" "}
          {searchType === "ky"
            ? `kỳ ${selectedKyDangPhi?.ten}`
            : `Đảng viên ${selectedDangVien?.hoten}`}
        </div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "5%" }}>STT</th>
                  <th style={{ width: "20%" }}>Họ và tên</th>
                  <th style={{ width: "20%" }}>Kỳ Đảng phí</th>
                  <th style={{ width: "15%" }}>Số tiền</th>
                  <th style={{ width: "10%" }}>Trạng thái</th>
                  <th style={{ width: "15%" }}>Người xác nhận</th>
                  <th style={{ width: "20%" }}>Thời gian xác nhận</th>
                  <th style={{ width: "15%" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.hotenDangvien}</td>
                    <td>{item.tenkydangphi || "N/A"}</td>
                    <td>{item.sotien.toLocaleString() || "N/A"} VNĐ</td>
                    <td>
                      <Badge
                        bg={
                          item.trangthai === "hoanthanh" ? "success" : "warning"
                        }
                      >
                        {item.trangthai === "hoanthanh"
                          ? "Hoàn thành"
                          : "Chưa hoàn thành"}
                      </Badge>
                    </td>
                    <td>{item.nguoixacnhan || "Chưa xác nhận"}</td>
                    {/* <td>{item.thoigianxacnhan || "Chưa xác nhận"}</td> */}
                    <td>
                      {item.thoigianxacnhan
                        ? item.thoigianxacnhan.split('.')[0]
                        : "Chưa xác nhận"}
                    </td>
                    <td>
                      {item.trangthai !== "hoanthanh" && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            handleConfirmDangPhi(
                              item.kydangphiId,
                              item.dangvienId
                            )
                          }
                          disabled={loading}
                          title="Xác nhận đóng Đảng phí"
                        >
                          <i className="fas fa-check"></i>
                          <span className="ms-1">Xác nhận</span>
                        </Button>
                      )}
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

export default DangPhiTable;
