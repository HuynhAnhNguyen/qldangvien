import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Table,
  Pagination,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import Swal from "sweetalert2";
// import { FaSearch, FaCheck, FaTimes, FaFilter } from "react-icons/fa";

const DangPhi = () => {
  // State management
  const [dangPhiList, setDangPhiList] = useState([]);
  const [dangVienList, setDangVienList] = useState([]);
  const [kyDangPhiList, setKyDangPhiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filterType, setFilterType] = useState("all"); // all, dangvien, kydangphi
  const [selectedDangVienId, setSelectedDangVienId] = useState("");
  const [selectedKyDangPhiId, setSelectedKyDangPhiId] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

// Get token from localStorage
const token = localStorage.getItem("token");

  // Fetch all data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch all party members
      const dangVienResponse = await fetch(
        "http://3.104.77.30:8080/api/v1/project/dangvien/findAll",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const dangVienData = await dangVienResponse.json();
      if (dangVienData.resultCode === 0) {
        setDangVienList(dangVienData.data);
      }
      
      // Fetch all fee periods
      const kyDangPhiResponse = await fetch(
        "http://3.104.77.30:8080/api/v1/project/kydangphi/findAll",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const kyDangPhiData = await kyDangPhiResponse.json();
      if (kyDangPhiData.resultCode === 0) {
        setKyDangPhiList(kyDangPhiData.data);
      }
      
      // Load initial fee data
      loadDangPhiData();
    } catch (err) {
      setError("Không thể tải dữ liệu ban đầu");
      console.error("Error fetching initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load fee data based on filters
  const loadDangPhiData = async () => {
    setLoading(true);
    try {
      let url = "http://3.104.77.30:8080/api/v1/project/trangthaidangphi/findAll";
      
      if (filterType === "dangvien" && selectedDangVienId) {
        url = `http://3.104.77.30:8080/api/v1/project/trangthaidangphi/findByDangvienId?dangvienId=${selectedDangVienId}`;
      } else if (filterType === "kydangphi" && selectedKyDangPhiId) {
        url = `http://3.104.77.30:8080/api/v1/project/trangthaidangphi/findByKydangphiId?kydangphiId=${selectedKyDangPhiId}`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      
      if (data.resultCode === 0) {
        setDangPhiList(data.data);
        setError(null);
        setCurrentPage(1);
      } else {
        throw new Error(data.message || "Không thể tải dữ liệu đảng phí");
      }
    } catch (err) {
      setError("Không thể tải dữ liệu đảng phí");
      console.error("Error loading dangPhi data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter type change
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setSelectedDangVienId("");
    setSelectedKyDangPhiId("");
  };

  // Confirm payment status
  const handleConfirmPayment = async (kydangphiId, dangvienId) => {
    const result = await Swal.fire({
      title: "Xác nhận đã đóng đảng phí?",
      text: "Bạn có chắc chắn muốn xác nhận đảng viên này đã đóng đảng phí?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await fetch(
          `http://3.104.77.30:8080/api/v1/project/trangthaidangphi/confirm?kydangphiId=${kydangphiId}&dangvienId=${dangvienId}`,
          {
            method: "POST",
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = await response.json();
        
        if (data.resultCode === 0) {
          Swal.fire("Thành công", "Xác nhận đóng đảng phí thành công", "success");
          loadDangPhiData();
        } else {
          throw new Error(data.message || "Xác nhận đóng đảng phí thất bại");
        }
      } catch (error) {
        Swal.fire("Lỗi", error.message || "Xác nhận đóng đảng phí thất bại", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Filtered data for display
  const filteredData = dangPhiList;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get party member name by ID
  const getDangVienName = (id) => {
    const dangVien = dangVienList.find((dv) => dv.id === id);
    return dangVien ? dangVien.hoten : "N/A";
  };

  // Get fee period name by ID
  const getKyDangPhiName = (id) => {
    const kyDangPhi = kyDangPhiList.find((kdp) => kdp.id === id);
    return kyDangPhi ? kyDangPhi.ten : "N/A";
  };

  // Get fee period amount by ID
  const getKyDangPhiAmount = (id) => {
    const kyDangPhi = kyDangPhiList.find((kdp) => kdp.id === id);
    return kyDangPhi ? kyDangPhi.sotien : 0;
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Đảng Phí</h2>
      </div>

      {/* Filter section */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            {/* <FaFilter className="me-2" /> */}
            Bộ lọc
          </h5>
        </div>
        <div className="card-body">
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Loại lọc</Form.Label>
                <Form.Select
                  value={filterType}
                  onChange={handleFilterTypeChange}
                >
                  <option value="all">Tất cả đảng phí</option>
                  <option value="dangvien">Theo đảng viên</option>
                  <option value="kydangphi">Theo kỳ đảng phí</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            {filterType === "dangvien" && (
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Chọn đảng viên</Form.Label>
                  <Form.Select
                    value={selectedDangVienId}
                    onChange={(e) => setSelectedDangVienId(e.target.value)}
                  >
                    <option value="">Chọn đảng viên</option>
                    {dangVienList.map((dv) => (
                      <option key={dv.id} value={dv.id}>
                        {dv.hoten}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
            
            {filterType === "kydangphi" && (
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Chọn kỳ đảng phí</Form.Label>
                  <Form.Select
                    value={selectedKyDangPhiId}
                    onChange={(e) => setSelectedKyDangPhiId(e.target.value)}
                  >
                    <option value="">Chọn kỳ đảng phí</option>
                    {kyDangPhiList.map((kdp) => (
                      <option key={kdp.id} value={kdp.id}>
                        {kdp.ten}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
            
            <Col md={4} className="d-flex align-items-end">
              <Button
                variant="primary"
                onClick={loadDangPhiData}
                disabled={loading || 
                  (filterType === "dangvien" && !selectedDangVienId) ||
                  (filterType === "kydangphi" && !selectedKyDangPhiId)
                }
              >
                {/* <FaSearch className="me-2" /> */}
                Lọc dữ liệu
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Data table */}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Đảng viên</th>
              <th>Kỳ đảng phí</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Người xác nhận</th>
              <th>Thời gian xác nhận</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={`${item.dangvienId}-${item.kydangphiId}`}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{item.hotenDangvien || getDangVienName(item.dangvienId)}</td>
                  <td>{getKyDangPhiName(item.kydangphiId)}</td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(getKyDangPhiAmount(item.kydangphiId))}
                  </td>
                  <td>
                    <Badge
                      bg={
                        item.trangthai === "hoanthanh"
                          ? "success"
                          : "danger"
                      }
                    >
                      {item.trangthai === "hoanthanh"
                        ? "Đã hoàn thành"
                        : "Chưa hoàn thành"}
                    </Badge>
                  </td>
                  <td>{item.nguoixacnhan || "N/A"}</td>
                  <td>{item.thoigianxacnhan || "N/A"}</td>
                  <td>
                    {item.trangthai === "chuahoanthanh" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          handleConfirmPayment(
                            item.kydangphiId,
                            item.dangvienId
                          )
                        }
                        disabled={loading}
                      >
                        {/* <FaCheck className="me-1" /> */}
                        Xác nhận
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default DangPhi;