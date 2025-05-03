import React from "react";

const ChiBoTable = ({
  currentItems,
  filteredChiBo,
  currentPage,
  itemsPerPage,
  totalPages,
  setCurrentPage,
  openDetailModal,
  openEditModal,
  openXepLoaiModal,
}) => {
  return (
    <>
      <div className="table-responsive mb-4">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th style={{ width: "5%" }}>STT</th>
              <th style={{ width: "20%" }}>Tên chi bộ</th>
              <th style={{ width: "20%" }}>Đảng ủy cấp trên</th>
              <th style={{ width: "15%" }}>Bí thư</th>
              <th style={{ width: "15%" }}>Ngày thành lập</th>
              <th style={{ width: "15%" }}>Trạng thái chi bộ</th>
              <th style={{ width: "10%" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{item.tenchibo}</td>
                <td>{item.danguycaptren}</td>
                <td>{item.bithu}</td>
                <td>{new Date(item.ngaythanhlap).toLocaleDateString()}</td>
                <td className={`status-cell ${item.trangthai}`}>
                  {item.trangthai === "hoatdong"
                    ? "Hoạt động"
                    : item.trangthai === "giaithe"
                    ? "Giải thể"
                    : item.trangthai === "tamdung"
                    ? "Tạm dừng"
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
                      onClick={() => openXepLoaiModal(item)}
                      title="Xếp loại chi bộ"
                    >
                      <i className="fa-solid fa-code-branch"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredChiBo.length > 10 && (
        <div className="mt-auto p-3 bg-light border-top">
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  « Trước
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${page === currentPage ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
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
  );
};

export default ChiBoTable;