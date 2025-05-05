// import React, { useState, useEffect } from "react";
// import { Form, Button, Modal, Row, Col, Badge } from "react-bootstrap";
// import Swal from "sweetalert2";
// import { approvePheDuyet, createPheDuyet, fetchDangVien, fetchHoSoByDangVienId, fetchPheDuyetByUsername, fetchTinTuc, rejectPheDuyet } from "../services/apiService";

// const PheDuyet = () => {
//   const [dangVienList, setDangVienList] = useState([]);
//   const [hoSoList, setHoSoList] = useState([]);
//   const [tinTucList, setTinTucList] = useState([]);
//   const [pheDuyetList, setPheDuyetList] = useState([]);
//   const [searchType, setSearchType] = useState("all"); // all, thongtin, hoso, tintuc
//   const [searchStatus, setSearchStatus] = useState("all"); // all, pending, approved, reject, saved
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const itemsPerPage = 10;

//   // Form data for creating new phê duyệt
//   const [formData, setFormData] = useState({
//     loaipheduyet: "thongtin",
//     dangvienId: "",
//     listHosoId: [],
//     tintucId: "",
//     ghichu: "",
//   });

// const token = localStorage.getItem("token");
// const username = localStorage.getItem("fullname");

//   // Lấy danh sách Đảng viên
//   const loadDangVien = async () => {
//     try {
//       const response = await fetchDangVien(token);
//       const data = await response.json();
//       if (data.resultCode === 0) {
//         setDangVienList(Array.isArray(data.data) ? data.data : []);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err) {
//       setError("Không thể tải danh sách Đảng viên");
//       console.error("Error loading dangVien:", err);
//     }
//   };

//   // Lấy danh sách tin tức
//   const loadTinTuc = async () => {
//     try {
//       const data = await fetchTinTuc(token);
//       if (data.resultCode === 0) {
//         setTinTucList(Array.isArray(data.data) ? data.data : []);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err) {
//       setError("Không thể tải danh sách tin tức");
//       console.error("Error loading tinTuc:", err);
//     }
//   };

//   // Lấy danh sách phê duyệt
//   const loadPheDuyet = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchPheDuyetByUsername(token, username);
//       if (data.resultCode === 0) {
//         setPheDuyetList(Array.isArray(data.data) ? data.data : []);
//         setError(null);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err) {
//       setError("Không thể tải danh sách phê duyệt");
//       console.error("Error loading pheDuyet:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Lấy danh sách hồ sơ theo Đảng viên
//   const loadHoSoByDangVien = async (dangvienId) => {
//     if (!dangvienId) {
//       setHoSoList([]);
//       return;
//     }
//     try {
//       const data = await fetchHoSoByDangVienId(token, dangvienId);
//       if (data.resultCode === 0) {
//         setHoSoList(Array.isArray(data.data) ? data.data : []);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err) {
//       setError("Không thể tải danh sách hồ sơ");
//       console.error("Error loading hoSo:", err);
//     }
//   };

//   // Gửi yêu cầu phê duyệt
//   const handleCreatePheDuyet = async () => {
//     if (
//       (formData.loaipheduyet === "thongtin" && !formData.dangvienId) ||
//       (formData.loaipheduyet === "hoso" && formData.listHosoId.length === 0) ||
//       (formData.loaipheduyet === "tintuc" && !formData.tintucId)
//     ) {
//       Swal.fire("Lỗi!", "Vui lòng chọn đối tượng phê duyệt!", "error");
//       return;
//     }

//     try {
//       setLoading(true);
//       const pheDuyetData = {
//         loaipheduyet: formData.loaipheduyet,
//         nguoipheduyet: username,
//         ghichu: formData.ghichu,
//         ...(formData.loaipheduyet === "thongtin" && {
//           dangvienId: parseInt(formData.dangvienId),
//           listHosoId: [],
//           tintucId: null,
//         }),
//         ...(formData.loaipheduyet === "hoso" && {
//           dangvienId: null,
//           listHosoId: formData.listHosoId.map(Number),
//           tintucId: null,
//         }),
//         ...(formData.loaipheduyet === "tintuc" && {
//           dangvienId: null,
//           listHosoId: [],
//           tintucId: parseInt(formData.tintucId),
//         }),
//       };

//       const data = await createPheDuyet(token, pheDuyetData);
//       if (data.resultCode === 0) {
//         setPheDuyetList([data.data, ...pheDuyetList]);
//         setShowAddModal(false);
//         setFormData({
//           loaipheduyet: "thongtin",
//           dangvienId: "",
//           listHosoId: [],
//           tintucId: "",
//           ghichu: "",
//         });
//         setHoSoList([]);
//         Swal.fire("Thành công!", "Gửi yêu cầu phê duyệt thành công", "success");
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err) {
//       Swal.fire("Lỗi!", err.message || "Gửi yêu cầu phê duyệt thất bại", "error");
//       console.error("Error creating pheDuyet:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Phê duyệt yêu cầu
//   const handleApprovePheDuyet = async (pheduyetId) => {
//     const result = await Swal.fire({
//       title: "Xác nhận phê duyệt?",
//       text: "Bạn có chắc chắn muốn phê duyệt yêu cầu này?",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Phê duyệt",
//       cancelButtonText: "Hủy",
//     });

//     if (result.isConfirmed) {
//       try {
//         setLoading(true);
//         const data = await approvePheDuyet(token, pheduyetId);
//         if (data.resultCode === 0) {
//           setPheDuyetList(
//             pheDuyetList.map((item) =>
//               item.id === pheduyetId ? { ...item, trangthai: "approved" } : item
//             )
//           );
//           Swal.fire("Thành công!", "Phê duyệt thành công", "success");
//         } else {
//           throw new Error(data.message);
//         }
//       } catch (err) {
//         Swal.fire("Lỗi!", err.message || "Phê duyệt thất bại", "error");
//         console.error("Error approving pheDuyet:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Từ chối yêu cầu
//   const handleRejectPheDuyet = async (pheduyetId) => {
//     const result = await Swal.fire({
//       title: "Xác nhận từ chối?",
//       text: "Bạn có chắc chắn muốn từ chối yêu cầu này?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Từ chối",
//       cancelButtonText: "Hủy",
//     });

//     if (result.isConfirmed) {
//       try {
//         setLoading(true);
//         const data = await rejectPheDuyet(token, pheduyetId);
//         if (data.resultCode === 0) {
//           setPheDuyetList(
//             pheDuyetList.map((item) =>
//               item.id === pheduyetId ? { ...item, trangthai: "reject" } : item
//             )
//           );
//           Swal.fire("Thành công!", "Từ chối thành công", "success");
//         } else {
//           throw new Error(data.message);
//         }
//       } catch (err) {
//         Swal.fire("Lỗi!", err.message || "Từ chối phê duyệt thất bại", "error");
//         console.error("Error rejecting pheDuyet:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Xử lý thay đổi form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (name === "dangvienId") {
//       loadHoSoByDangVien(value);
//     }
//     if (name === "loaipheduyet") {
//       setFormData((prev) => ({
//         ...prev,
//         dangvienId: "",
//         listHosoId: [],
//         tintucId: "",
//         ghichu: "",
//       }));
//       setHoSoList([]);
//     }
//   };

//   // Xử lý thay đổi checkbox hồ sơ
//   const handleHoSoCheckboxChange = (hosoId) => {
//     setFormData((prev) => {
//       const newListHosoId = prev.listHosoId.includes(hosoId)
//         ? prev.listHosoId.filter((id) => id !== hosoId)
//         : [...prev.listHosoId, hosoId];
//       return { ...prev, listHosoId: newListHosoId };
//     });
//   };

//   // Lọc danh sách phê duyệt
//   const filteredPheDuyet = pheDuyetList.filter((item) => {
//     const matchesType =
//       searchType === "all" || item.loaipheduyet === searchType;
//     const matchesStatus =
//       searchStatus === "all" || item.trangthai === searchStatus;
//     const matchesSearchTerm =
//       searchTerm === "" ||
//       (item.ghichu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (item.dangvienId &&
//           dangVienList
//             .find((dv) => dv.id === item.dangvienId)
//             ?.hoten?.toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//         (item.tintucId &&
//           tinTucList
//             .find((tt) => tt.id === item.tintucId)
//             ?.tieude?.toLowerCase()
//             .includes(searchTerm.toLowerCase())) ||
//         (item.listHosoId.length > 0 &&
//           hoSoList
//             .filter((hs) => item.listHosoId.includes(hs.id))
//             .some((hs) =>
//               hs.taphoso?.toLowerCase().includes(searchTerm.toLowerCase())
//             )));
//     return matchesType && matchesStatus && matchesSearchTerm;
//   });

//   // Phân trang
//   const totalPages = Math.ceil(filteredPheDuyet.length / itemsPerPage);
//   const currentItems = filteredPheDuyet.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Load dữ liệu khi component mount
//   useEffect(() => {
//     loadDangVien();
//     loadTinTuc();
//     loadPheDuyet();
//   }, []);

//   // Reset form khi mở modal
//   const openAddModal = () => {
//     setFormData({
//       loaipheduyet: "thongtin",
//       dangvienId: "",
//       listHosoId: [],
//       tintucId: "",
//       ghichu: "",
//     });
//     setHoSoList([]);
//     setShowAddModal(true);
//   };

//   return (
//     <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
//       <div className="p-4 flex-grow-1">
//         <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
//           <h1 className="h3 mb-3 mb-md-0">Quản lý Phê duyệt</h1>
//           <div className="d-flex gap-2 align-items-center">
//             <Form.Select
//               value={searchType}
//               onChange={(e) => {
//                 setSearchType(e.target.value);
//                 setCurrentPage(1);
//               }}
//               style={{ width: "200px" }}
//             >
//               <option value="all">Tất cả loại</option>
//               <option value="thongtin">Thông tin Đảng viên</option>
//               <option value="hoso">Hồ sơ Đảng</option>
//               <option value="tintuc">Tin tức</option>
//             </Form.Select>
//             <Form.Select
//               value={searchStatus}
//               onChange={(e) => {
//                 setSearchStatus(e.target.value);
//                 setCurrentPage(1);
//               }}
//               style={{ width: "200px" }}
//             >
//               <option value="all">Tất cả trạng thái</option>
//               <option value="pending">Chờ duyệt</option>
//               <option value="approved">Đã duyệt</option>
//               <option value="reject">Từ chối</option>
//               <option value="saved">Đã lưu</option>
//             </Form.Select>
//             <div className="d-flex" style={{ width: "100%", maxWidth: "400px" }}>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Tìm kiếm..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//               <button className="btn btn-primary">
//                 <i className="fas fa-search"></i>
//               </button>
//             </div>
//             <Button className="custom-sm-btn-dangvien"
//               variant="success"
//               onClick={openAddModal}
//               disabled={loading}
//             >
//               <i className="fas fa-plus me-2"></i>Thêm yêu cầu
//             </Button>
//           </div>
//         </div>

//         {loading && (
//           <div className="text-center py-4">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         )}

//         {error && <div className="alert alert-danger">{error}</div>}

//         {filteredPheDuyet.length === 0 ? (
//           <div className="text-center py-4 text-muted">
//             Không có yêu cầu phê duyệt nào
//           </div>
//         ) : (
//           <>
//             <div className="table-responsive mb-4">
//               <table className="table table-hover">
//                 <thead className="table-light">
//                   <tr>
//                     <th style={{ width: "5%" }}>STT</th>
//                     <th style={{ width: "15%" }}>Loại phê duyệt</th>
//                     <th style={{ width: "25%" }}>Đối tượng</th>
//                     <th style={{ width: "15%" }}>Thời gian gửi</th>
//                     <th style={{ width: "15%" }}>Trạng thái</th>
//                     <th style={{ width: "15%" }}>Ghi chú</th>
//                     <th style={{ width: "10%" }}>Thao tác</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentItems.map((item, index) => (
//                     <tr key={item.id}>
//                       <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                       <td>
//                         {item.loaipheduyet === "thongtin"
//                           ? "Thông tin Đảng viên"
//                           : item.loaipheduyet === "hoso"
//                           ? "Hồ sơ Đảng"
//                           : "Tin tức"}
//                       </td>
//                       <td>
//                         {item.loaipheduyet === "thongtin" &&
//                           (dangVienList.find((dv) => dv.id === item.dangvienId)
//                             ?.hoten || "N/A")}
//                         {item.loaipheduyet === "hoso" &&
//                           (item.listHosoId.length > 0
//                             ? item.listHosoId
//                                 .map(
//                                   (id) =>
//                                     hoSoList.find((hs) => hs.id === id)?.taphoso
//                                 )
//                                 .join(", ") || "N/A"
//                             : "N/A")}
//                         {item.loaipheduyet === "tintuc" &&
//                           (tinTucList.find((tt) => tt.id === item.tintucId)
//                             ?.tieude || "N/A")}
//                       </td>
//                       <td>
//                         {new Date(item.thoigianguipheduyet).toLocaleString()}
//                       </td>
//                       <td>
//                         <Badge
//                           bg={
//                             item.trangthai === "approved"
//                               ? "success"
//                               : item.trangthai === "reject"
//                               ? "danger"
//                               : item.trangthai === "pending"
//                               ? "warning"
//                               : "secondary"
//                           }
//                         >
//                           {item.trangthai === "approved"
//                             ? "Đã duyệt"
//                             : item.trangthai === "reject"
//                             ? "Từ chối"
//                             : item.trangthai === "pending"
//                             ? "Chờ duyệt"
//                             : "Đã lưu"}
//                         </Badge>
//                       </td>
//                       <td>{item.ghichu || "N/A"}</td>
//                       <td>
//                         {item.trangthai === "pending" && (
//                           <div className="d-flex gap-1">
//                             <Button
//                               variant="outline-success"
//                               size="sm"
//                               onClick={() => handleApprovePheDuyet(item.id)}
//                               disabled={loading}
//                               title="Phê duyệt"
//                             >
//                               <i className="fas fa-check"></i>
//                             </Button>
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               onClick={() => handleRejectPheDuyet(item.id)}
//                               disabled={loading}
//                               title="Từ chối"
//                             >
//                               <i className="fas fa-times"></i>
//                             </Button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-auto p-3 bg-light border-top">
//                 <nav aria-label="Page navigation">
//                   <ul className="pagination justify-content-center mb-0">
//                     <li
//                       className={`page-item ${
//                         currentPage === 1 ? "disabled" : ""
//                       }`}
//                     >
//                       <button
//                         className="page-link"
//                         onClick={() =>
//                           setCurrentPage((prev) => Math.max(prev - 1, 1))
//                         }
//                         disabled={currentPage === 1}
//                       >
//                         « Trước
//                       </button>
//                     </li>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (page) => (
//                         <li
//                           key={page}
//                           className={`page-item ${
//                             page === currentPage ? "active" : ""
//                           }`}
//                         >
//                           <button
//                             className="page-link"
//                             onClick={() => setCurrentPage(page)}
//                           >
//                             {page}
//                           </button>
//                         </li>
//                       )
//                     )}
//                     <li
//                       className={`page-item ${
//                         currentPage === totalPages ? "disabled" : ""
//                       }`}
//                     >
//                       <button
//                         className="page-link"
//                         onClick={() =>
//                           setCurrentPage((prev) =>
//                             Math.min(prev + 1, totalPages)
//                           )
//                         }
//                         disabled={currentPage === totalPages}
//                       >
//                         Tiếp »
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Add PheDuyet Modal */}
//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Thêm yêu cầu phê duyệt</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>Loại phê duyệt</Form.Label>
//                   <Form.Select
//                     name="loaipheduyet"
//                     value={formData.loaipheduyet}
//                     onChange={handleInputChange}
//                   >
//                     <option value="thongtin">Thông tin Đảng viên</option>
//                     <option value="hoso">Hồ sơ Đảng</option>
//                     <option value="tintuc">Tin tức</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>
//             {formData.loaipheduyet === "thongtin" && (
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Đảng viên</Form.Label>
//                     <Form.Select
//                       name="dangvienId"
//                       value={formData.dangvienId}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Chọn Đảng viên</option>
//                       {dangVienList.map((dv) => (
//                         <option key={dv.id} value={dv.id}>
//                           {dv.hoten}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                 </Col>
//               </Row>
//             )}
//             {formData.loaipheduyet === "hoso" && (
//               <>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Đảng viên</Form.Label>
//                       <Form.Select
//                         name="dangvienId"
//                         value={formData.dangvienId}
//                         onChange={handleInputChange}
//                       >
//                         <option value="">Chọn Đảng viên</option>
//                         {dangVienList.map((dv) => (
//                           <option key={dv.id} value={dv.id}>
//                             {dv.hoten}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//                 {hoSoList.length > 0 && (
//                   <Row className="mb-3">
//                     <Col md={12}>
//                       <Form.Group>
//                         <Form.Label>Chọn hồ sơ</Form.Label>
//                         {hoSoList.map((hoso) => (
//                           <Form.Check
//                             key={hoso.id}
//                             type="checkbox"
//                             label={hoso.taphoso}
//                             checked={formData.listHosoId.includes(hoso.id)}
//                             onChange={() => handleHoSoCheckboxChange(hoso.id)}
//                           />
//                         ))}
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                 )}
//               </>
//             )}
//             {formData.loaipheduyet === "tintuc" && (
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>Tin tức</Form.Label>
//                     <Form.Select
//                       name="tintucId"
//                       value={formData.tintucId}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Chọn tin tức</option>
//                       {tinTucList.map((tt) => (
//                         <option key={tt.id} value={tt.id}>
//                           {tt.tieude}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                 </Col>
//               </Row>
//             )}
//             <Row className="mb-3">
//               <Col md={12}>
//                 <Form.Group>
//                   <Form.Label>Ghi chú</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     name="ghichu"
//                     value={formData.ghichu}
//                     onChange={handleInputChange}
//                     placeholder="Nhập ghi chú"
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowAddModal(false)}
//             disabled={loading}
//           >
//             Hủy
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleCreatePheDuyet}
//             disabled={loading}
//           >
//             {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default PheDuyet;

import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Badge } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  approvePheDuyet,
  createPheDuyet,
  fetchDangVien,
  fetchHoSoByDangVienId,
  fetchPheDuyetByUsername,
  fetchTinTuc,
  rejectPheDuyet,
} from "../services/apiService";

const PheDuyet = () => {
  const [dangVienList, setDangVienList] = useState([]);
  const [hoSoList, setHoSoList] = useState([]);
  const [tinTucList, setTinTucList] = useState([]);
  const [pheDuyetList, setPheDuyetList] = useState([]);
  const [searchType, setSearchType] = useState("all");
  const [searchStatus, setSearchStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  // Thêm state để lọc các đối tượng saved
  const [filteredDangVien, setFilteredDangVien] = useState([]);
  const [filteredHoSo, setFilteredHoSo] = useState([]);
  const [filteredTinTuc, setFilteredTinTuc] = useState([]);

  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    loaipheduyet: "thongtin",
    dangvienId: "",
    listHosoId: [],
    tintucId: "",
    ghichu: "",
  });

  // Hàm lọc các đối tượng saved
  const filterSavedItems = () => {
    setFilteredDangVien(
      dangVienList.filter((dv) => dv.trangthaithongtin === "saved")
    );
    // setFilteredHoSo(hoSoList.filter((hs) => hs.trangthai === "saved"));
    setFilteredTinTuc(tinTucList.filter((tt) => tt.trangthai === "saved"));
  };

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Load data functions
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
      const data = await fetchTinTuc(token);
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

  const loadHoSoByDangVien = async (dangvienId) => {
    if (!dangvienId) {
      setHoSoList([]);
      setFilteredHoSo([]);
      return;
    }
    // if (!dangvienId) {
    //   setHoSoList([]);
    //   return;
    // }
    try {
      const data = await fetchHoSoByDangVienId(token, dangvienId);
      if (data.resultCode === 0) {
        // setHoSoList(Array.isArray(data.data) ? data.data : []);
        const allHoSo = Array.isArray(data.data) ? data.data : [];
        setHoSoList(allHoSo);
        const savedHoSo = allHoSo.filter(hs => hs.trangthai === "saved");
        if (savedHoSo.length > 0) {
          setFilteredHoSo(savedHoSo);
        } else {
          // Nếu không có saved thì hiển thị pending
          setFilteredHoSo(allHoSo.filter(hs => hs.trangthai === "pending"));
        }
        // Chỉ lấy hồ sơ chưa được duyệt
        // setFilteredHoSo(allHoSo.filter((hs) => hs.trangthai === "saved"));
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
      (formData.loaipheduyet === "tintuc" && !formData.tintucId)
    ) {
      Swal.fire("Lỗi!", "Vui lòng chọn đối tượng phê duyệt!", "error");
      return;
    }

    try {
      setLoading(true);
      const pheDuyetData = {
        loaipheduyet: formData.loaipheduyet,
        nguoipheduyet: username,
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

      const data = await createPheDuyet(token, pheDuyetData);
      if (data.resultCode === 0) {
        setPheDuyetList([data.data, ...pheDuyetList]);
        setShowAddModal(false);
        setFormData({
          loaipheduyet: "thongtin",
          dangvienId: "",
          listHosoId: [],
          tintucId: "",
          ghichu: "",
        });
        setHoSoList([]);
        Swal.fire("Thành công!", "Gửi yêu cầu phê duyệt thành công", "success");
        loadPheDuyet();
      } else {
        throw new Error(data.message);
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
        console.log(data);
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
        console.log(data);
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

  const filteredPheDuyet = (pheDuyetList || []).filter((item) => {
    if (!item) return false; // Skip null/undefined items

    const matchesType =
      searchType === "all" || item.loaipheduyet === searchType;
    const matchesStatus =
      searchStatus === "all" || item.trangthai === searchStatus;
    const matchesSearchTerm =
      searchTerm === "" ||
      (item.ghichu &&
        item.ghichu.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.dangvienId &&
        dangVienList
          .find((dv) => dv.id === item.dangvienId)
          ?.hoten?.toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (item.tintucId &&
        tinTucList
          .find((tt) => tt.id === item.tintucId)
          ?.tieude?.toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (item.listHosoId &&
        item.listHosoId.length > 0 &&
        hoSoList
          .filter((hs) => item.listHosoId.includes(hs.id))
          .some((hs) =>
            hs.taphoso?.toLowerCase().includes(searchTerm.toLowerCase())
          ));

    return matchesType && matchesStatus && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredPheDuyet.length / itemsPerPage);
  const currentItems = filteredPheDuyet.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    loadDangVien();
    loadTinTuc();
    loadPheDuyet();
  }, []);

  const openAddModal = () => {
    setFormData({
      loaipheduyet: "thongtin",
      dangvienId: "",
      listHosoId: [],
      tintucId: "",
      ghichu: "",
    });
    setHoSoList([]);
    filterSavedItems();
    setShowAddModal(true);
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
                    <th style={{ width: "25%" }}>Đối tượng</th>
                    <th style={{ width: "15%" }}>Thời gian gửi</th>
                    <th style={{ width: "15%" }}>Trạng thái</th>
                    <th style={{ width: "15%" }}>Ghi chú</th>
                    <th style={{ width: "10%" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => {
                    if (!item) return null;
                    return (
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
                            (dangVienList.find(
                              (dv) => dv.id === item.dangvienId
                            )?.hoten ||
                              "N/A")}
                          {item.loaipheduyet === "hoso" &&
                            (item.listHosoId.length > 0
                              ? item.listHosoId
                                  .map(
                                    (id) =>
                                      hoSoList.find((hs) => hs.id === id)
                                        ?.taphoso
                                  )
                                  .join(", ") || "N/A"
                              : "N/A")}
                          {item.loaipheduyet === "tintuc" &&
                            (tinTucList.find((tt) => tt.id === item.tintucId)
                              ?.tieude ||
                              "N/A")}
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
                        <td>{item.ghichu || "N/A"}</td>
                        <td>
                          {item.trangthai === "pending" && (
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleApprovePheDuyet(item.id)}
                                disabled={loading}
                                title="Phê duyệt"
                              >
                                <i className="fas fa-check"></i>
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRejectPheDuyet(item.id)}
                                disabled={loading}
                                title="Từ chối"
                              >
                                <i className="fas fa-times"></i>
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
                  <Form.Label>Loại phê duyệt</Form.Label>
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
            </Row>
            {formData.loaipheduyet === "thongtin" && (
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Đảng viên</Form.Label>
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
                      <Form.Label>Đảng viên</Form.Label>
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
                {hoSoList.length > 0 && (
                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Chọn hồ sơ</Form.Label>
                        {filteredHoSo.map((hoso) => (
                          <Form.Check
                            key={hoso.id}
                            type="checkbox"
                            label={`${hoso.taphoso} (${hoso.trangthai})`}
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
                    <Form.Label>Tin tức</Form.Label>
                    <Form.Select
                      name="tintucId"
                      value={formData.tintucId}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn tin tức</option>
                      {filteredTinTuc.map((tt) => (
                        <option key={tt.id} value={tt.id}>
                          {tt.tieude}
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
    </div>
  );
};

export default PheDuyet;
