import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Modal,
  Row,
  Col,
  Badge,
  Tabs,
  Tab,
} from "react-bootstrap";
import Swal from "sweetalert2";
import {
  approvePheDuyet,
  createPheDuyet,
  fetchDangVien,
  fetchHoSoByDangVienId,
  fetchPheDuyetByUsername,
  fetchTinTuc,
  rejectPheDuyet,
  getPheDuyetDetail,
  fetchAllAccounts,
  downloadFile,
  fetchDanhSachTinTuc,
} from "../services/apiService";

const PheDuyet = () => {
  const [dangVienList, setDangVienList] = useState([]);
  const [hoSoList, setHoSoList] = useState([]);
  const [tinTucList, setTinTucList] = useState([]);
  const [pheDuyetList, setPheDuyetList] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [searchType, setSearchType] = useState("all");
  const [searchStatus, setSearchStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filteredDangVien, setFilteredDangVien] = useState([]);
  const [filteredHoSo, setFilteredHoSo] = useState([]);
  const [filteredTinTuc, setFilteredTinTuc] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailType, setDetailType] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);

  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    loaipheduyet: "thongtin",
    dangvienId: "",
    listHosoId: [],
    tintucId: "",
    ghichu: "",
    nguoipheduyet: "",
  });

  const filterSavedItems = () => {
    setFilteredDangVien(
      dangVienList.filter((dv) => dv.trangthaithongtin === "saved")
    );
    setFilteredTinTuc(tinTucList.filter((tt) => tt.trangthai === "saved"));
  };

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const loadDangVien = async () => {
    try {
      const response = await fetchDangVien(token);
      const data = await response.json();
      if (data.resultCode === 0) {
        setDangVienList(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("Không thể tải danh sách Đảng viên");
      console.error("Error loading dangVien:", err);
    }
  };

  const loadTinTuc = async () => {
    try {
      const data = await fetchDanhSachTinTuc(token);
      if (data.resultCode === 0) {
        setTinTucList(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("Không thể tải danh sách tin tức");
      console.error("Error loading tinTuc:", err);
    }
  };

  const loadPheDuyet = async () => {
    setLoading(true);
    try {
      const data = await fetchPheDuyetByUsername(token, username);
      if (data.resultCode === 0) {
        setPheDuyetList(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("Không thể tải danh sách phê duyệt");
      console.error("Error loading pheDuyet:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      const data = await fetchAllAccounts(token);
      if (data.resultCode === 0) {
        setAccountsList(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Error loading accounts:", err);
    }
  };

  const loadHoSoByDangVien = async (dangvienId) => {
    if (!dangvienId) {
      setHoSoList([]);
      setFilteredHoSo([]);
      setFormData((prev) => ({ ...prev, listHosoId: [] }));
      return;
    }
    try {
      const data = await fetchHoSoByDangVienId(token, dangvienId);
      if (data.resultCode === 0) {
        const allHoSoData = Array.isArray(data.data) ? data.data : [];
        setHoSoList(allHoSoData);

        const filtered = allHoSoData.filter((hs) => hs.trangthai === "saved");
        setFilteredHoSo(filtered);
        setFormData((prev) => ({ ...prev, listHosoId: [] }));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("Không thể tải danh sách hồ sơ");
      console.error("Error loading hoSo:", err);
    }
  };

  const handleCreatePheDuyet = async () => {
    if (
      (formData.loaipheduyet === "thongtin" && !formData.dangvienId) ||
      (formData.loaipheduyet === "hoso" && formData.listHosoId.length === 0) ||
      (formData.loaipheduyet === "tintuc" && !formData.tintucId) ||
      !formData.nguoipheduyet
    ) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    try {
      setLoading(true);
      const pheDuyetData = {
        loaipheduyet: formData.loaipheduyet,
        nguoipheduyet: formData.nguoipheduyet,
        ghichu: formData.ghichu,
        trangthai: "pending",
        ...(formData.loaipheduyet === "thongtin" && {
          dangvienId: parseInt(formData.dangvienId),
          listHosoId: [],
          tintucId: null,
        }),
        ...(formData.loaipheduyet === "hoso" && {
          dangvienId: null,
          listHosoId: formData.listHosoId.map(Number),
          tintucId: null,
        }),
        ...(formData.loaipheduyet === "tintuc" && {
          dangvienId: null,
          listHosoId: [],
          tintucId: parseInt(formData.tintucId),
        }),
      };

      const response = await createPheDuyet(token, pheDuyetData);
      if (response.resultCode === 0) {
        await loadPheDuyet();
        setFormData({
          loaipheduyet: "thongtin",
          dangvienId: "",
          listHosoId: [],
          tintucId: "",
          ghichu: "",
          nguoipheduyet: "",
        });
        setShowAddModal(false);
        Swal.fire("Thành công!", "Gửi yêu cầu thành công", "success");
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      Swal.fire(
        "Lỗi!",
        err.message || "Gửi yêu cầu phê duyệt thất bại",
        "error"
      );
      console.error("Error creating pheDuyet:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePheDuyet = async (pheduyetId) => {
    const result = await Swal.fire({
      title: "Xác nhận phê duyệt?",
      text: "Bạn có chắc chắn muốn phê duyệt yêu cầu này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Phê duyệt",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const data = await approvePheDuyet(token, pheduyetId);
        if (data.resultCode === 0) {
          setPheDuyetList(
            pheDuyetList.map((item) =>
              item.id === pheduyetId ? { ...item, trangthai: "approved" } : item
            )
          );
          Swal.fire("Thành công!", "Phê duyệt thành công", "success");
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        Swal.fire("Lỗi!", err.message || "Phê duyệt thất bại", "error");
        console.error("Error approving pheDuyet:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRejectPheDuyet = async (pheduyetId) => {
    const result = await Swal.fire({
      title: "Xác nhận từ chối?",
      text: "Bạn có chắc chắn muốn từ chối yêu cầu này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Từ chối",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const data = await rejectPheDuyet(token, pheduyetId);
        if (data.resultCode === 0) {
          setPheDuyetList(
            pheDuyetList.map((item) =>
              item.id === pheduyetId ? { ...item, trangthai: "reject" } : item
            )
          );
          Swal.fire("Thành công!", "Từ chối thành công", "success");
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        Swal.fire("Lỗi!", err.message || "Từ chối phê duyệt thất bại", "error");
        console.error("Error rejecting pheDuyet:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "dangvienId") {
      loadHoSoByDangVien(value);
    }
    if (name === "loaipheduyet") {
      setFormData((prev) => ({
        ...prev,
        dangvienId: "",
        listHosoId: [],
        tintucId: "",
        ghichu: "",
      }));
      setHoSoList([]);
    }
  };

  const handleHoSoCheckboxChange = (hosoId) => {
    setFormData((prev) => {
      const newListHosoId = prev.listHosoId.includes(hosoId)
        ? prev.listHosoId.filter((id) => id !== hosoId)
        : [...prev.listHosoId, hosoId];
      return { ...prev, listHosoId: newListHosoId };
    });
  };

  const handleViewDetail = async (pheduyetId, loaipheduyet) => {
    setDetailLoading(true);
    setShowDetailModal(true);
    setDetailType(loaipheduyet);

    try {
      const data = await getPheDuyetDetail(token, pheduyetId);
      if (data.resultCode === 0) {
        setDetailData(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      Swal.fire(
        "Lỗi!",
        err.message || "Không thể tải chi tiết phê duyệt",
        "error"
      );
      setShowDetailModal(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredPheDuyet = (pheDuyetList || []).filter((item) => {
    if (!item) return false;
    const matchesType =
      searchType === "all" || item.loaipheduyet === searchType;
    const matchesStatus =
      searchStatus === "all" || item.trangthai === searchStatus;
    const matchesSearchTerm =
      searchTerm === "" ||
      (item.ghichu &&
        item.ghichu.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tendangvien &&
        item.tendangvien.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tieude &&
        item.tieude.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tenhoso &&
        item.tenhoso.some((hs) =>
          hs.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    return matchesType && matchesStatus && matchesSearchTerm;
  });

  const sortByStatus = (list) => {
    const statusOrder = { pending: 1, approved: 2, reject: 3 };
    return [...list].sort(
      (a, b) => statusOrder[a.trangthai] - statusOrder[b.trangthai]
    );
  };

  const totalPages = Math.ceil(filteredPheDuyet.length / itemsPerPage);
  const currentItems = sortByStatus(filteredPheDuyet).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    loadDangVien();
    loadTinTuc();
    loadPheDuyet();
    loadAccounts();
  }, []);

  const openAddModal = () => {
    setFormData({
      loaipheduyet: "thongtin",
      dangvienId: "",
      listHosoId: [],
      tintucId: "",
      ghichu: "",
      nguoipheduyet: "",
    });
    setHoSoList([]);
    filterSavedItems();
    setShowAddModal(true);
  };

  const handleDownloadFile = async (fileUrl) => {
    try {
      setLoading(true);
      // Lấy filename từ URL (phần sau cùng sau dấu /)
      const filename = fileUrl.split("/").pop();

      // Gọi API download file
      const response = await downloadFile(token, filename);

      // Tạo URL tạm thời từ blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Lấy tên file từ header nếu có
      const contentDisposition = response.headers["content-disposition"];
      let downloadFilename = filename;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          downloadFilename = filenameMatch[1];
        }
      }

      // Thiết lập thuộc tính download
      link.setAttribute("download", downloadFilename);
      document.body.appendChild(link);
      link.click();

      // Hiển thị thông báo thành công
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Tải file thành công!",
        confirmButtonText: "Đóng",
      });

      // Dọn dẹp
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data?.message || "Tải file thất bại",
        confirmButtonText: "Đóng",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-3 mb-md-0">Quản lý Phê duyệt</h1>
          <div className="d-flex gap-2 align-items-center">
            <Form.Select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: "200px" }}
            >
              <option value="all">Tất cả loại</option>
              <option value="thongtin">Thông tin Đảng viên</option>
              <option value="hoso">Hồ sơ Đảng</option>
              <option value="tintuc">Tin tức</option>
            </Form.Select>
            <Form.Select
              value={searchStatus}
              onChange={(e) => {
                setSearchStatus(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: "200px" }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="reject">Từ chối</option>
            </Form.Select>
            <div
              className="d-flex"
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button className="btn btn-primary">
                <i className="fas fa-search"></i>
              </button>
            </div>
            <Button
              className="custom-sm-btn-dangvien"
              variant="success"
              onClick={openAddModal}
              disabled={loading}
            >
              <i className="fas fa-plus me-2"></i>Thêm yêu cầu
            </Button>
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

        {filteredPheDuyet.length === 0 ? (
          <div className="text-center py-4 text-muted">
            Không có yêu cầu phê duyệt nào
          </div>
        ) : (
          <>
            <div className="table-responsive mb-4">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }}>STT</th>
                    <th style={{ width: "15%" }}>Loại phê duyệt</th>
                    <th style={{ width: "20%" }}>Đối tượng</th>
                    <th style={{ width: "15%" }}>Thời gian gửi</th>
                    <th style={{ width: "15%" }}>Trạng thái</th>
                    <th style={{ width: "15%" }}>Ghi chú</th>
                    <th style={{ width: "15%" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {item.loaipheduyet === "thongtin"
                          ? "Thông tin Đảng viên"
                          : item.loaipheduyet === "hoso"
                          ? "Hồ sơ Đảng"
                          : "Tin tức"}
                      </td>
                      <td>
                        {item.loaipheduyet === "thongtin" &&
                          (item.tendangvien || "N/A")}
                        {item.loaipheduyet === "hoso" && (
                          <div className="d-flex flex-column gap-1">
                            {item.tenhoso && item.tenhoso.length > 0
                              ? item.tenhoso.map((hs, idx) => {
                                  // Chuyển đổi từ "tap1 - Admin" thành "Tập 1 - Admin"
                                  const formattedText = hs.replace(
                                    /^tap(\d+)/i,
                                    "Tập $1"
                                  );
                                  return <div key={idx}>{formattedText}</div>;
                                })
                              : "N/A"}
                          </div>
                        )}
                        {item.loaipheduyet === "tintuc" &&
                          (item.tieude || "N/A")}
                      </td>
                      <td>
                        {new Date(item.thoigianguipheduyet).toLocaleString()}
                      </td>
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
                      <td>{item.ghichu || ""}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary btn-outline-primary-detail"
                            onClick={() =>
                              handleViewDetail(item.id, item.loaipheduyet)
                            }
                            title="Xem chi tiết"
                          >
                            <i className="fas fa-eye"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleApprovePheDuyet(item.id)}
                            title="Phê duyệt"
                            disabled={item.trangthai !== "pending"}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRejectPheDuyet(item.id)}
                            title="Từ chối"
                            disabled={item.trangthai !== "pending"}
                          >
                            <i className="fas fa-times"></i>
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
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
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

      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tạo yêu cầu phê duyệt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Loại phê duyệt <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="loaipheduyet"
                    value={formData.loaipheduyet}
                    onChange={handleInputChange}
                  >
                    <option value="thongtin">Thông tin Đảng viên</option>
                    <option value="hoso">Hồ sơ Đảng</option>
                    <option value="tintuc">Tin tức</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Người phê duyệt <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="nguoipheduyet"
                    value={formData.nguoipheduyet}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn người phê duyệt</option>
                    {accountsList.map((account) => (
                      <option key={account.username} value={account.username}>
                        {account.fullname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {formData.loaipheduyet === "thongtin" && (
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Đảng viên <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="dangvienId"
                      value={formData.dangvienId}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn Đảng viên</option>
                      {filteredDangVien.map((dv) => (
                        <option key={dv.id} value={dv.id}>
                          {dv.hoten}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
            {formData.loaipheduyet === "hoso" && (
              <>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Đảng viên <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="dangvienId"
                        value={formData.dangvienId}
                        onChange={handleInputChange}
                      >
                        <option value="">Chọn Đảng viên</option>
                        {dangVienList.map((dv) => (
                          <option key={dv.id} value={dv.id}>
                            {dv.hoten}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                {!loading &&
                  formData.dangvienId &&
                  filteredHoSo.length === 0 &&
                  dangVienList.length > 0 && (
                    <div className="alert alert-danger">
                      Không có hồ sơ nào ở trạng thái "Đã lưu" của Đảng viên
                      này.
                    </div>
                  )}
                {filteredHoSo.length > 0 && (
                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>
                          Chọn hồ sơ <span className="text-danger">*</span>
                        </Form.Label>
                        {filteredHoSo.map((hoso) => (
                          <Form.Check
                            key={hoso.id}
                            type="checkbox"
                            label={`Tập ${hoso.taphoso.replace("tap", "")} - ${
                              hoso.loaihoso || ""
                            } - ${
                              hoso.trangthai === "saved"
                                ? "Trạng thái: đã lưu"
                                : "Trạng thái: từ chối"
                            }`}
                            checked={formData.listHosoId.includes(hoso.id)}
                            onChange={() => handleHoSoCheckboxChange(hoso.id)}
                          />
                        ))}
                      </Form.Group>
                    </Col>
                  </Row>
                )}
              </>
            )}
            {formData.loaipheduyet === "tintuc" && (
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Tin tức <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="tintucId"
                      value={formData.tintucId}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn tin tức</option>
                      {filteredTinTuc.map((tt) => (
                        <option key={tt.id} value={tt.id}>
                          {tt.tieude.length > 90
                            ? tt.tieude.slice(0, 90) + "..."
                            : tt.tieude}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Ghi chú</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="ghichu"
                    value={formData.ghichu}
                    onChange={handleInputChange}
                    placeholder="Nhập ghi chú"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleCreatePheDuyet}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết yêu cầu phê duyệt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div>
              {detailType === "thongtin" && detailData && (
                <div>
                  <Tabs defaultActiveKey="personal" className="mb-3">
                    <Tab eventKey="personal" title="Thông tin cá nhân">
                      <div className="p-3">
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <th>Họ và tên</th>
                              <td>{detailData.hoten || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Ngày sinh</th>
                              <td>
                                {detailData.ngaysinh
                                  ? new Date(
                                      detailData.ngaysinh
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <th>Giới tính</th>
                              <td>{detailData.gioitinh || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Quê quán</th>
                              <td>{detailData.quequan || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Dân tộc</th>
                              <td>{detailData.dantoc || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Trình độ văn hóa</th>
                              <td>{detailData.trinhdovanhoa || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Nơi ở hiện nay</th>
                              <td>{detailData.noihiennay || "N/A"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Tab>

                    <Tab eventKey="party" title="Thông tin Đảng">
                      <div className="p-3">
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <th>Ngày vào Đảng</th>
                              <td>
                                {detailData.ngayvaodang
                                  ? new Date(
                                      detailData.ngayvaodang
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <th>Ngày chính thức</th>
                              <td>
                                {detailData.ngaychinhthuc
                                  ? new Date(
                                      detailData.ngaychinhthuc
                                    ).toLocaleDateString()
                                  : "Chưa chính thức"}
                              </td>
                            </tr>
                            <tr>
                              <th>Người giới thiệu 1</th>
                              <td>{detailData.nguoigioithieu1 || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Người giới thiệu 2</th>
                              <td>{detailData.nguoigioithieu2 || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Nơi sinh hoạt Đảng</th>
                              <td>{detailData.noisinhhoatdang || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Trạng thái</th>
                              <td>
                                {detailData.trangthaidangvien === "chinhthuc"
                                  ? "Chính thức"
                                  : detailData.trangthaidangvien === "dubi"
                                  ? "Dự bị"
                                  : detailData.trangthaidangvien === "khaitru"
                                  ? "Khai trừ"
                                  : "Không xác định"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Tab>

                    <Tab eventKey="position" title="Chức vụ">
                      <div className="p-3">
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <th>Chức vụ chính quyền</th>
                              <td>{detailData.chucvuchinhquyen || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Chức vụ chi bộ</th>
                              <td>{detailData.chucvuchibo || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Chức vụ Đảng ủy</th>
                              <td>{detailData.chucvudanguy || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Chức vụ đoàn thể</th>
                              <td>{detailData.chucvudoanthe || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Chức danh</th>
                              <td>{detailData.chucdanh || "N/A"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              )}

              {detailType === "hoso" && Array.isArray(detailData) && (
                <div>
                  <h5>Danh sách hồ sơ</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tập hồ sơ</th>
                        <th>Loại hồ sơ</th>
                        <th>Trạng thái</th>
                        <th>File đính kèm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.map((hoso, index) => (
                        <tr key={hoso.id}>
                          <td>{index + 1}</td>
                          <td>{`Tập ${
                            hoso.taphoso?.replace("tap", "") || "N/A"
                          }`}</td>
                          <td>{hoso.loaihoso || "N/A"}</td>
                          <td>
                            <Badge
                              bg={
                                hoso.trangthai === "approved"
                                  ? "success"
                                  : hoso.trangthai === "rejected"
                                  ? "danger"
                                  : "warning"
                              }
                            >
                              {hoso.trangthai === "approved"
                                ? "Đã duyệt"
                                : hoso.trangthai === "rejected"
                                ? "Từ chối"
                                : "Chờ duyệt"}
                            </Badge>
                          </td>
                          <td>
                            {hoso.fileUrl ? (
                              <button
                                className="btn btn-link p-0 border-0 bg-transparent"
                                onClick={() => handleDownloadFile(hoso.fileUrl)}
                              >
                                <i className="fas fa-download me-1"></i> Tải
                                xuống
                              </button>
                            ) : (
                              "Không có file"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailType === "tintuc" && detailData && (
                <div>
                  <h5>Thông tin tin tức</h5>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th>Tiêu đề</th>
                        <td>{detailData.tieude || "N/A"}</td>
                      </tr>
                      <tr>
                        <th>Người tạo</th>
                        <td>{detailData.nguoitao || "N/A"}</td>
                      </tr>
                      <tr>
                        <th>Thời gian tạo</th>
                        <td>
                          {new Date(detailData.thoigiantao).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <th>Xem nội dung</th>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              (window.location.href = `/chi-tiet-tin-tuc/${detailData.id}`)
                            }
                          >
                            <i className="fas fa-external-link-alt me-1"></i>
                            Xem chi tiết tin tức
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PheDuyet;
