import React from "react";

const KyDangPhiTable = ({
  kyDangPhiList,
  searchTerm,
  loading,
  error,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  openEditModal,
}) => {
  // Filter data based on search term
  const filteredData = kyDangPhiList.filter((item) =>
    item.ten.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
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

      {currentItems.length === 0 ? (
        <div className="text-center py-4 color-black">
          Không có Kỳ Đảng phí nào!
        </div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "5%" }}>STT</th>
                  <th style={{ width: "30%" }}>Tên kỳ đảng phí</th>
                  <th style={{ width: "15%" }}>Số tiền</th>
                  <th style={{ width: "15%" }}>Người tạo</th>
                  <th style={{ width: "25%" }}>Thời gian tạo</th>
                  <th style={{ width: "10%" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.ten}</td>
                    <td>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "decimal",
                      }).format(item.sotien)}{" "}
                      VND
                    </td>
                    <td>{item.nguoitao}</td>
                    <td>{item.thoigiantao}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => openEditModal(item)}
                          title="Chỉnh sửa"
                          disabled={loading}
                        >
                          <i className="fas fa-edit"></i>
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
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
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

export default KyDangPhiTable;