import React from "react";
import { Form } from "react-bootstrap";

const TaiKhoanTable = ({
  accounts,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  handleActivate,
  handleDeactivate,
  openChangePwModal,
  openChangeRoleModal,
  handleDeleteAccount,
  loading,
  error,
}) => {
  const itemsPerPage = 10;

  // Pagination and search
  const filteredAccounts = accounts.filter(
    (item) =>
      item.username?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item.fullname?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item.phoneNumber?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const currentItems = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 flex-grow-1">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h1 className="h3 mb-3 mb-md-0">Danh sách tài khoản</h1>
        <div className="d-flex gap-2 align-items-center">
          <div className="d-flex" style={{ width: "100%", maxWidth: "450px" }}>
            <input
              type="text"
              className="form-control custom-sm-input"
              placeholder="Tìm kiếm tài khoản..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            />
            <button
              className="btn btn-primary custom-sm-btn"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

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
          Không tìm thấy tài khoản nào phù hợp!
        </div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "5%" }}>STT</th>
                  <th style={{ width: "20%" }}>Họ và tên</th>
                  <th style={{ width: "15%" }}>Tên đăng nhập</th>
                  <th style={{ width: "20%" }}>Email</th>
                  <th style={{ width: "10%" }}>Số điện thoại</th>
                  <th style={{ width: "15%" }}>Trạng thái</th>
                  <th style={{ width: "15%" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.fullname}</td>
                    <td>{item.username}</td>
                    <td>{item.email}</td>
                    <td>{item.phoneNumber}</td>
                    <td>
                      {item.status === 1 ? (
                        <span className="badge bg-success">Kích hoạt</span>
                      ) : (
                        <span className="badge bg-danger">Vô hiệu</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {item.status === 1 ? (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeactivate(item.username)}
                            title="Vô hiệu hóa"
                          >
                            <i className="fas fa-ban"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleActivate(item.username)}
                            title="Kích hoạt"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => openChangePwModal(item)}
                          title="Đổi mật khẩu"
                        >
                          <i className="fas fa-key"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => openChangeRoleModal(item)}
                          title="Thay đổi vai trò"
                        >
                          <i className="fas fa-user-tag"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteAccount(item.username)}
                          title="Xóa tài khoản"
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
    </div>
  );
};

export default TaiKhoanTable;