import React from "react";

const DangVienTable = ({
  searchType,
  selectedChiBoId,
  currentItems,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  openDetailModal,
  openEditModal,
  openTheDangModal,
  openQuyetDinhModal,
  handleExportExcel,
}) => {
  return (
    <>
      {searchType === "chibo" &&
      selectedChiBoId &&
      currentItems.length === 0 ? (
        <div className="text-center py-4 color-black">
          Không có Đảng viên thuộc chi bộ này!
        </div>
      ) : searchType === "approved" && currentItems.length === 0 ? (
        <div className="text-center py-4 color-black">
          Không có Đảng viên nào được phê duyệt!
        </div>
      ) : currentItems.length === 0 ? (
        <div className="text-center py-4 color-black">
          Không tìm thấy Đảng viên nào phù hợp!
        </div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "5%" }}>STT</th>
                  <th style={{ width: "20%" }}>Họ và tên</th>
                  <th style={{ width: "20%" }}>Ngày sinh</th>
                  <th style={{ width: "20%" }}>Nơi sinh hoạt Đảng</th>
                  <th style={{ width: "15%" }}>Trạng thái</th>
                  <th style={{ width: "20%" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 &&
                  currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{item.hoten}</td>
                      <td>{new Date(item.ngaysinh).toLocaleDateString()}</td>
                      <td>{item.noisinhhoatdang}</td>
                      <td className={`status-cell ${item.trangthaidangvien}`}>
                        {item.trangthaidangvien === "chinhthuc"
                          ? "Chính thức"
                          : item.trangthaidangvien === "dubi"
                          ? "Dự bị"
                          : item.trangthaidangvien === "khaitru"
                          ? "Khai trừ"
                          : "Không xác định"}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary btn-outline-primary-detail"
                            onClick={() => openDetailModal(item)}
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => openEditModal(item)}
                            title="Chỉnh sửa"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => openTheDangModal(item)}
                            title="Xem thẻ Đảng"
                          >
                            <i className="fas fa-id-card"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => openQuyetDinhModal(item)}
                            title="Quyết định"
                          >
                            <i className="fas fa-file-alt"></i>
                          </button>
                          
                          <button
                            className="btn btn-sm btn-outline-excel"
                            onClick={() => handleExportExcel(item)}
                            title="Xuất thông tin ra Excel"
                          >
                            <i className="fas fa-file-excel"></i>
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

export default DangVienTable;
