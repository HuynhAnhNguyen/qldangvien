// import React, { useState, useEffect } from "react";
// import { Form, Button, Modal, Row, Col, Badge } from "react-bootstrap";
// import Swal from "sweetalert2";
// import {
//   approvePheDuyet,
//   createPheDuyet,
//   fetchDangVien,
//   fetchHoSoByDangVienId,
//   fetchPheDuyetByUsername,
//   fetchTinTuc,
//   rejectPheDuyet,
//   getPheDuyetDetail,
//   fetchAllAccounts,
// } from "../services/apiService";

// const PheDuyet = () => {
//   const [dangVienList, setDangVienList] = useState([]);
//   const [hoSoList, setHoSoList] = useState([]);
//   const [tinTucList, setTinTucList] = useState([]);
//   const [pheDuyetList, setPheDuyetList] = useState([]);
//   const [accountsList, setAccountsList] = useState([]);
//   const [searchType, setSearchType] = useState("all");
//   const [searchStatus, setSearchStatus] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [filteredDangVien, setFilteredDangVien] = useState([]);
//   const [filteredHoSo, setFilteredHoSo] = useState([]);
//   const [filteredTinTuc, setFilteredTinTuc] = useState([]);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [detailData, setDetailData] = useState(null);
//   const [detailType, setDetailType] = useState("");
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [allHoSo, setAllHoSo] = useState([]);

//   const itemsPerPage = 10;

//   const [formData, setFormData] = useState({
//     loaipheduyet: "thongtin",
//     dangvienId: "",
//     listHosoId: [],
//     tintucId: "",
//     ghichu: "",
//     nguoipheduyet: "",
//   });

//   // Hàm lọc các đối tượng saved
//   const filterSavedItems = () => {
//     setFilteredDangVien(
//       dangVienList.filter((dv) => dv.trangthaithongtin === "saved")
//     );
//     setFilteredTinTuc(tinTucList.filter((tt) => tt.trangthai === "saved"));
//   };

//   const token = localStorage.getItem("token");
//   const username = localStorage.getItem("username");

//   // Load data functions
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

//   const loadPheDuyet = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchPheDuyetByUsername(token, username);
//       if (data.resultCode === 0) {
//         setPheDuyetList(Array.isArray(data.data) ? data.data : []);
//         // setError(null);
//         // Tải tất cả hồ sơ liên quan đến các yêu cầu phê duyệt
//         const hosoIds = data.data
//           .filter(
//             (item) =>
//               item.loaipheduyet === "hoso" && item.listHosoId?.length > 0
//           )
//           .flatMap((item) => item.listHosoId);
//         if (hosoIds.length > 0) {
//           await loadAllHoSoForPheDuyet(hosoIds);
//         }
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

//   const loadAccounts = async () => {
//     try {
//       const data = await fetchAllAccounts(token);
//       if (data.resultCode === 0) {
//         setAccountsList(Array.isArray(data.data) ? data.data : []);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err) {
//       console.error("Error loading accounts:", err);
//     }
//   };

//   const loadHoSoByDangVien = async (dangvienId) => {
//     if (!dangvienId) {
//       setHoSoList([]);
//       setFilteredHoSo([]);
//       setFormData((prev) => ({ ...prev, listHosoId: [] })); // Reset danh sách hồ sơ đã chọn
//       return;
//     }
//     try {
//       const data = await fetchHoSoByDangVienId(token, dangvienId);
//       if (data.resultCode === 0) {
//         const allHoSo = Array.isArray(data.data) ? data.data : [];
//         setHoSoList(allHoSo);
//         // const savedHoSo = allHoSo.filter((hs) => hs.trangthai === "saved");
//         // if (savedHoSo.length > 0) {
//         //   setFilteredHoSo(savedHoSo);
//         // } else {
//         //   Swal.fire({
//         //     icon: 'info',
//         //     title: 'Thông báo',
//         //     text: 'Không có hồ sơ nào cần gửi yêu cầu!',
//         //     timer: 2000
//         //   });
//         // }
//         setAllHoSo((prev) => {
//           const newHoSo = [...prev];
//           allHoSo.forEach((hs) => {
//             if (!newHoSo.some((h) => h.id === hs.id)) {
//               newHoSo.push(hs);
//             }
//           });
//           return newHoSo;
//         });
//         const filtered = allHoSo.filter(
//           (hs) => hs.trangthai === "saved" || hs.trangthai === "reject"
//         );
//         setFilteredHoSo(filtered);
//         setFormData((prev) => ({ ...prev, listHosoId: [] }));
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err) {
//       setError("Không thể tải danh sách hồ sơ");
//       console.error("Error loading hoSo:", err);
//     }
//   };

//   // Hàm mới để tải tất cả hồ sơ liên quan đến yêu cầu phê duyệt
//   const loadAllHoSoForPheDuyet = async (hosoIds) => {
//     try {
//       // Giả sử có API để lấy danh sách hồ sơ theo danh sách ID
//       // Nếu không có API này, cần lấy hồ sơ từ từng đảng viên
//       const uniqueDangVienIds = [
//         ...new Set(
//           pheDuyetList
//             .filter(
//               (item) =>
//                 item.loaipheduyet === "hoso" && item.listHosoId?.length > 0
//             )
//             .map((item) => {
//               const hoso = allHoSo.find((hs) =>
//                 item.listHosoId.includes(hs.id)
//               );
//               return hoso?.dangvienId;
//             })
//             .filter((id) => id)
//         ),
//       ];

//       for (const dangvienId of uniqueDangVienIds) {
//         const data = await fetchHoSoByDangVienId(token, dangvienId);
//         if (data.resultCode === 0) {
//           const hoSoData = Array.isArray(data.data) ? data.data : [];
//           setAllHoSo((prev) => {
//             const newHoSo = [...prev];
//             hoSoData.forEach((hs) => {
//               if (!newHoSo.some((h) => h.id === hs.id)) {
//                 newHoSo.push(hs);
//               }
//             });
//             return newHoSo;
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Error loading all hoSo for pheDuyet:", err);
//     }
//   };

//   const handleCreatePheDuyet = async () => {
//     if (
//       (formData.loaipheduyet === "thongtin" && !formData.dangvienId) ||
//       (formData.loaipheduyet === "hoso" && formData.listHosoId.length === 0) ||
//       (formData.loaipheduyet === "tintuc" && !formData.tintucId) ||
//       !formData.nguoipheduyet
//     ) {
//       Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin!", "error");
//       return;
//     }

//     try {
//       setLoading(true);
//       const pheDuyetData = {
//         loaipheduyet: formData.loaipheduyet,
//         nguoipheduyet: formData.nguoipheduyet,
//         ghichu: formData.ghichu,
//         trangthai: "pending",
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
//         if (formData.loaipheduyet === "hoso" && formData.dangvienId) {
//           await loadHoSoByDangVien(formData.dangvienId); // Tải lại hồ sơ
//         }
//         await loadPheDuyet();
//         // Cập nhật danh sách phê duyệt
//         // const newPheDuyetList = [data.data, ...pheDuyetList];
//         // setPheDuyetList(newPheDuyetList);

//         // Reset form
//         setFormData({
//           loaipheduyet: "thongtin",
//           dangvienId: "",
//           listHosoId: [],
//           tintucId: "",
//           ghichu: "",
//           nguoipheduyet: "",
//         });

//         setShowAddModal(false);
//         Swal.fire("Thành công!", "Gửi yêu cầu thành công", "success");
//         // setPheDuyetList([data.data, ...pheDuyetList]);
//         // setShowAddModal(false);
//         // setFormData({
//         //   loaipheduyet: "thongtin",
//         //   dangvienId: "",
//         //   listHosoId: [],
//         //   tintucId: "",
//         //   ghichu: "",
//         //   nguoipheduyet: "",
//         // });
//         // setHoSoList([]);
//         // if (formData.loaipheduyet === "hoso" && formData.dangvienId) {
//         //   await loadHoSoByDangVien(formData.dangvienId); // Tải lại hồ sơ
//         // }
//         // // Tải lại danh sách phê duyệt
//         // await loadPheDuyet();
//         // setShowAddModal(false);
//         // Swal.fire("Thành công!", "Gửi yêu cầu thành công", "success");
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err) {
//       Swal.fire(
//         "Lỗi!",
//         err.message || "Gửi yêu cầu phê duyệt thất bại",
//         "error"
//       );
//       console.error("Error creating pheDuyet:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

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
//         console.log(data);
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
//         console.log(data);
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

//   const handleHoSoCheckboxChange = (hosoId) => {
//     setFormData((prev) => {
//       const newListHosoId = prev.listHosoId.includes(hosoId)
//         ? prev.listHosoId.filter((id) => id !== hosoId)
//         : [...prev.listHosoId, hosoId];
//       return { ...prev, listHosoId: newListHosoId };
//     });
//   };

//   const handleViewDetail = async (pheduyetId, loaipheduyet) => {
//     setDetailLoading(true);
//     setShowDetailModal(true);
//     setDetailType(loaipheduyet);

//     try {
//       const data = await getPheDuyetDetail(token, pheduyetId);
//       if (data.resultCode === 0) {
//         setDetailData(data.data);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (err) {
//       Swal.fire(
//         "Lỗi!",
//         err.message || "Không thể tải chi tiết phê duyệt",
//         "error"
//       );
//       setShowDetailModal(false);
//     } finally {
//       setDetailLoading(false);
//     }
//   };

//   const filteredPheDuyet = (pheDuyetList || []).filter((item) => {
//     if (!item) return false; // Skip null/undefined items

//     const matchesType =
//       searchType === "all" || item.loaipheduyet === searchType;
//     const matchesStatus =
//       searchStatus === "all" || item.trangthai === searchStatus;
//     const matchesSearchTerm =
//       searchTerm === "" ||
//       (item.ghichu &&
//         item.ghichu.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (item.dangvienId &&
//         dangVienList
//           .find((dv) => dv.id === item.dangvienId)
//           ?.hoten?.toLowerCase()
//           .includes(searchTerm.toLowerCase())) ||
//       (item.tintucId &&
//         tinTucList
//           .find((tt) => tt.id === item.tintucId)
//           ?.tieude?.toLowerCase()
//           .includes(searchTerm.toLowerCase())) ||
//       (item.listHosoId &&
//         item.listHosoId.length > 0 &&
//         hoSoList
//           .filter((hs) => item.listHosoId.includes(hs.id))
//           .some((hs) =>
//             hs.taphoso?.toLowerCase().includes(searchTerm.toLowerCase())
//           ));

//     return matchesType && matchesStatus && matchesSearchTerm;
//   });

//   const sortByStatus = (list) => {
//     const statusOrder = {
//       pending: 1,
//       approved: 2,
//       reject: 3,
//     };

//     return [...list].sort((a, b) => {
//       return statusOrder[a.trangthai] - statusOrder[b.trangthai];
//     });
//   };

//   // const statusMapping = {
//   //   saved: "Đã lưu",
//   //   reject: "Từ chối",
//   // };

//   const totalPages = Math.ceil(filteredPheDuyet.length / itemsPerPage);
//   const currentItems = sortByStatus(filteredPheDuyet).slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   useEffect(() => {
//     loadDangVien();
//     loadTinTuc();
//     loadPheDuyet();
//     loadAccounts();
//   }, []);

//   const openAddModal = () => {
//     setFormData({
//       loaipheduyet: "thongtin",
//       dangvienId: "",
//       listHosoId: [],
//       tintucId: "",
//       ghichu: "",
//       nguoipheduyet: "",
//     });
//     setHoSoList([]);
//     filterSavedItems();
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
//             </Form.Select>
//             <div
//               className="d-flex"
//               style={{ width: "100%", maxWidth: "400px" }}
//             >
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
//             <Button
//               className="custom-sm-btn-dangvien"
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
//                     <th style={{ width: "20%" }}>Đối tượng</th>
//                     <th style={{ width: "15%" }}>Thời gian gửi</th>
//                     <th style={{ width: "15%" }}>Trạng thái</th>
//                     <th style={{ width: "15%" }}>Ghi chú</th>
//                     <th style={{ width: "15%" }}>Thao tác</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentItems.map((item, index) => {
//                     if (!item) return null;
//                     return (
//                       <tr key={item.id}>
//                         <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
//                         <td>
//                           {item.loaipheduyet === "thongtin"
//                             ? "Thông tin Đảng viên"
//                             : item.loaipheduyet === "hoso"
//                             ? "Hồ sơ Đảng"
//                             : "Tin tức"}
//                         </td>
//                         <td>
//                           {item.loaipheduyet === "thongtin" &&
//                             (dangVienList.find(
//                               (dv) => dv.id === item.dangvienId
//                             )?.hoten ||
//                               "N/A")}

//                           {/* {item.loaipheduyet === "hoso" &&
//                             (item.listHosoId.length > 0 ? (
//                               <div className="d-flex flex-column gap-1">
//                                 {detailData // Ưu tiên dùng detailData nếu có
//                                   ? detailData
//                                       .filter((hs) =>
//                                         item.listHosoId.includes(hs.id)
//                                       )
//                                       .map((hs) => (
//                                         <div key={hs.id}>
//                                           Tập {hs.taphoso.replace("tap", "")} -{" "}
//                                           {hs.loaihoso || "N/A"}
//                                         </div>
//                                       ))
//                                   : item.listHosoId.map((id) => {
//                                       const hoso = hoSoList.find(
//                                         (hs) => hs.id === id
//                                       );
//                                       return (
//                                         <div key={id}>
//                                           {hoso
//                                             ? `Tập ${hoso.taphoso.replace(
//                                                 "tap",
//                                                 ""
//                                               )} - ${hoso.loaihoso || "N/A"}`
//                                             : `ID ${id} (Không tìm thấy)`}
//                                         </div>
//                                       );
//                                     })}
//                               </div>
//                             ) : (
//                               "N/A"
//                             ))} */}

//                           {/* Trong phần hiển thị đối tượng phê duyệt */}
//                           {/* {item.loaipheduyet === "hoso" && (
//   <div className="d-flex flex-column gap-1">
//     {item.listHosoId.length > 0 ? (
//       item.listHosoId.map((id) => {
//         const hoso = allHoSo.find((hs) => hs.id === id) ||
//                     hoSoList.find((hs) => hs.id === id) ||
//                     { id, taphoso: "N/A", loaihoso: "N/A" };
//         return (
//           <div key={id}>
//             {hoso.taphoso !== "N/A"
//               ? `Tập ${hoso.taphoso.replace("tap", "")} - ${hoso.loaihoso || "N/A"}`
//               : `ID ${id} (Không tìm thấy)`}
//           </div>
//         );
//       })
//     ) : (
//       "N/A"
//     )}
//   </div>
// )} */}

//                           {item.loaipheduyet === "hoso" && (
//                             <div className="d-flex flex-column gap-1">
//                               {item.listHosoId.length > 0
//                                 ? item.listHosoId.map((id) => {
//                                     const hoso = allHoSo.find(
//                                       (hs) => hs.id === id
//                                     ) ||
//                                       hoSoList.find((hs) => hs.id === id) || {
//                                         id,
//                                         taphoso: "N/A",
//                                         loaihoso: "N/A",
//                                       };
//                                     return (
//                                       <div key={id}>
//                                         {hoso.taphoso !== "N/A"
//                                           ? `Tập ${hoso.taphoso.replace(
//                                               "tap",
//                                               ""
//                                             )} - ${hoso.loaihoso || "N/A"}`
//                                           : `ID ${id} (Không tìm thấy)`}
//                                       </div>
//                                     );
//                                   })
//                                 : "N/A"}
//                             </div>
//                           )}
//                           {item.loaipheduyet === "tintuc" &&
//                             (tinTucList.find((tt) => tt.id === item.tintucId)
//                               ?.tieude ||
//                               "N/A")}
//                         </td>
//                         <td>
//                           {new Date(item.thoigianguipheduyet).toLocaleString()}
//                         </td>
//                         <td>
//                           <Badge
//                             bg={
//                               item.trangthai === "approved"
//                                 ? "success"
//                                 : item.trangthai === "reject"
//                                 ? "danger"
//                                 : "warning"
//                             }
//                           >
//                             {item.trangthai === "approved"
//                               ? "Đã duyệt"
//                               : item.trangthai === "reject"
//                               ? "Từ chối"
//                               : "Chờ duyệt"}
//                           </Badge>
//                         </td>
//                         <td>{item.ghichu || ""}</td>
//                         <td>
//                           {item.trangthai === "pending" && (
//                             <div className="d-flex gap-1">
//                               <Button
//                                 variant="outline-success"
//                                 size="sm"
//                                 onClick={() => handleApprovePheDuyet(item.id)}
//                                 disabled={loading}
//                                 title="Phê duyệt"
//                               >
//                                 <i className="fas fa-check"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => handleRejectPheDuyet(item.id)}
//                                 disabled={loading}
//                                 title="Từ chối"
//                               >
//                                 <i className="fas fa-times"></i>
//                               </Button>
//                               <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 onClick={() =>
//                                   handleViewDetail(item.id, item.loaipheduyet)
//                                 }
//                                 title="Xem chi tiết"
//                               >
//                                 <i className="fas fa-eye"></i>
//                               </Button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
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

//       <Modal
//         show={showAddModal}
//         onHide={() => setShowAddModal(false)}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Tạo yêu cầu phê duyệt</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>
//                     Loại phê duyệt <span className="text-danger">*</span>
//                   </Form.Label>
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
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label>
//                     Người phê duyệt <span className="text-danger">*</span>
//                   </Form.Label>
//                   <Form.Select
//                     name="nguoipheduyet"
//                     value={formData.nguoipheduyet}
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="">Chọn người phê duyệt</option>
//                     {accountsList.map((account) => (
//                       <option key={account.username} value={account.username}>
//                         {account.fullname}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>
//             {formData.loaipheduyet === "thongtin" && (
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <Form.Group>
//                     <Form.Label>
//                       Đảng viên <span className="text-danger">*</span>
//                     </Form.Label>
//                     <Form.Select
//                       name="dangvienId"
//                       value={formData.dangvienId}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Chọn Đảng viên</option>
//                       {filteredDangVien.map((dv) => (
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
//                       <Form.Label>
//                         Đảng viên <span className="text-danger">*</span>
//                       </Form.Label>
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

//                 {/* Thêm điều kiện hiển thị thông báo khi không có hồ sơ */}
//                 {formData.dangvienId && filteredHoSo.length === 0 && (
//                   <div className="alert alert-danger">
//                     Không có hồ sơ nào ở trạng thái "Đã lưu" hoặc "Từ chối" cho
//                     Đảng viên này
//                   </div>
//                 )}

//                 {filteredHoSo.length > 0 && (
//                   <Row className="mb-3">
//                     <Col md={12}>
//                       <Form.Group>
//                         <Form.Label>
//                           Chọn hồ sơ <span className="text-danger">*</span>
//                         </Form.Label>
//                         {filteredHoSo.map((hoso) => (
//                           <Form.Check
//                             key={hoso.id}
//                             type="checkbox"
//                             label={`Tập ${hoso.taphoso.replace("tap", "")} - ${
//                               hoso.loaihoso || ""
//                             } - ${
//                               hoso.trangthai === "saved"
//                                 ? "Trạng thái: đã lưu"
//                                 : "Trạng thái: từ chối"
//                             }`}
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
//                       <option value="">
//                         Chọn tin tức <span className="text-danger">*</span>
//                       </option>
//                       {filteredTinTuc.map((tt) => (
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

//       {/* Thêm vào cuối component, sau modal thêm phê duyệt */}
//       <Modal
//         show={showDetailModal}
//         onHide={() => setShowDetailModal(false)}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Chi tiết phê duyệt</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {detailLoading ? (
//             <div className="text-center py-4">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : (
//             <div>
//               {detailType === "thongtin" && detailData && (
//                 <div>
//                   <h5>Thông tin Đảng viên</h5>
//                   <table className="table table-bordered">
//                     <tbody>
//                       <tr>
//                         <th>Họ tên</th>
//                         <td>{detailData.hoten || "N/A"}</td>
//                       </tr>
//                       <tr>
//                         <th>Ngày sinh</th>
//                         <td>{detailData.ngaysinh || "N/A"}</td>
//                       </tr>
//                       <tr>
//                         <th>Giới tính</th>
//                         <td>{detailData.gioitinh || "N/A"}</td>
//                       </tr>
//                       <tr>
//                         <th>Quê quán</th>
//                         <td>{detailData.quequan || "N/A"}</td>
//                       </tr>
//                       <tr>
//                         <th>Dân tộc</th>
//                         <td>{detailData.dantoc || "N/A"}</td>
//                       </tr>
//                       <tr>
//                         <th>Trình độ văn hóa</th>
//                         <td>{detailData.trinhdovanhoa || "N/A"}</td>
//                       </tr>
//                       {/* Thêm các trường khác tương tự */}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {detailType === "hoso" && Array.isArray(detailData) && (
//                 <div>
//                   <h5>Danh sách hồ sơ</h5>
//                   <table className="table table-bordered">
//                     <thead>
//                       <tr>
//                         <th>Tập hồ sơ</th>
//                         <th>Loại hồ sơ</th>
//                         <th>Trạng thái</th>
//                         <th>Ghi chú</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {detailData.map((hoso) => (
//                         <tr key={hoso.id}>
//                           <td>{`Tập ${hoso.taphoso.replace("tap", "")}`}</td>
//                           <td>{hoso.loaihoso || "N/A"}</td>
//                           <td>
//                             <Badge
//                               bg={
//                                 hoso.trangthai === "approved"
//                                   ? "success"
//                                   : "danger"
//                               }
//                             >
//                               {hoso.trangthai === "approved"
//                                 ? "Đã duyệt"
//                                 : "Từ chối"}
//                             </Badge>
//                           </td>
//                           <td>{hoso.ghichu || "N/A"}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {detailType === "tintuc" && detailData && (
//                 <div>
//                   <h5>Thông tin tin tức</h5>
//                   <table className="table table-bordered">
//                     <tbody>
//                       <tr>
//                         <th>Tiêu đề</th>
//                         <td>{detailData.tieude || "N/A"}</td>
//                       </tr>
//                       <tr>
//                         <th>Nội dung</th>
//                         <td
//                           dangerouslySetInnerHTML={{
//                             __html: detailData.noidungtin || "N/A",
//                           }}
//                         ></td>
//                       </tr>
//                       <tr>
//                         <th>Người tạo</th>
//                         <td>{detailData.nguoitao || "N/A"}</td>
//                       </tr>
//                       <tr>
//                         <th>Thời gian tạo</th>
//                         <td>
//                           {new Date(detailData.thoigiantao).toLocaleString()}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
//             Đóng
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
  getPheDuyetDetail,
  fetchAllAccounts,
  fetchHoSoById,
  fetchTinTucById,
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
  const [allHoSo, setAllHoSo] = useState([]);

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
        // const hosoIds = data.data
        //   .filter(
        //     (item) =>
        //       item.loaipheduyet === "hoso" && item.listHosoId?.length > 0
        //   )
        //   .flatMap((item) => item.listHosoId);
        // if (hosoIds.length > 0) {
        //   await loadAllHoSoForPheDuyet(hosoIds);
        // }
        // setError(null);
        // Lấy tất cả hosoId từ tất cả yêu cầu phê duyệt loại hoso
        const allHosoIds = data.data
          .filter(
            (item) =>
              item.loaipheduyet === "hoso" && item.listHosoId?.length > 0
          )
          .flatMap((item) => item.listHosoId);

        // Load chi tiết tất cả hồ sơ nếu có
        if (allHosoIds.length > 0) {
          await loadHoSoDetails(allHosoIds);
        }

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

  // Hàm mới để load chi tiết hồ sơ
  const loadHoSoDetails = async (hosoIds) => {
    try {
      const uniqueIds = [...new Set(hosoIds)]; // Loại bỏ trùng lặp
      const existingIds = allHoSo.map((hs) => hs.id);
      const newIds = uniqueIds.filter((id) => !existingIds.includes(id));

      if (newIds.length === 0) return;

      const hoSoPromises = newIds.map((id) => fetchHoSoById(token, id));
      const hoSoResults = await Promise.all(hoSoPromises);
      const validHoSo = hoSoResults.filter((hs) => hs && hs.resultCode === 0);

      setAllHoSo((prev) => [...prev, ...validHoSo.map((hs) => hs.data)]);
    } catch (err) {
      console.error("Error loading hoSo details:", err);
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
        setAllHoSo((prev) => {
          const newHoSo = [...prev];
          allHoSoData.forEach((hs) => {
            if (!newHoSo.some((h) => h.id === hs.id)) {
              newHoSo.push(hs);
            }
          });
          return newHoSo;
        });
        const filtered = allHoSoData.filter(
          (hs) => hs.trangthai === "saved" || hs.trangthai === "reject"
        );
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

  const loadAllHoSoForPheDuyet = async (hosoIds) => {
    try {
      const hoSoPromises = hosoIds.map((id) => fetchHoSoById(id));
      const hoSoResults = await Promise.all(hoSoPromises);
      const validHoSo = hoSoResults.filter((hs) => hs !== null);
      setAllHoSo((prev) => {
        const newHoSo = [...prev];
        validHoSo.forEach((hs) => {
          if (!newHoSo.some((h) => h.id === hs.id)) {
            newHoSo.push(hs);
          }
        });
        return newHoSo;
      });
    } catch (err) {
      console.error("Error loading all hoSo for pheDuyet:", err);
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
      // if (response.resultCode === 0) {
      //   // Update relevant lists based on loaipheduyet
      //   if (
      //     formData.loaipheduyet === "hoso" &&
      //     formData.listHosoId.length > 0
      //   ) {
      //     await loadAllHoSoForPheDuyet(formData.listHosoId);
      //     if (formData.dangvienId) {
      //       await loadHoSoByDangVien(formData.dangvienId);
      //     }
      //   } else if (
      //     formData.loaipheduyet === "thongtin" &&
      //     formData.dangvienId
      //   ) {
      //     const dangVienData = await fetchHoSoByDangVienId(formData.dangvienId);
      //     if (dangVienData) {
      //       setDangVienList((prev) => {
      //         const newList = [...prev];
      //         if (!newList.some((dv) => dv.id === dangVienData.id)) {
      //           newList.push(dangVienData);
      //         }
      //         return newList;
      //       });
      //     }
      //   } else if (formData.loaipheduyet === "tintuc" && formData.tintucId) {
      //     const tinTucData = await fetchTinTucById(formData.tintucId);
      //     if (tinTucData) {
      //       setTinTucList((prev) => {
      //         const newList = [...prev];
      //         if (!newList.some((tt) => tt.id === tinTucData.id)) {
      //           newList.push(tinTucData);
      //         }
      //         return newList;
      //       });
      //     }
      //   }

      //   await loadPheDuyet();
      //   setFormData({
      //     loaipheduyet: "thongtin",
      //     dangvienId: "",
      //     listHosoId: [],
      //     tintucId: "",
      //     ghichu: "",
      //     nguoipheduyet: "",
      //   });
      //   setShowAddModal(false);
      //   Swal.fire("Thành công!", "Gửi yêu cầu thành công", "success");
      // } else {
      //   throw new Error(response.message);
      // }
      if (response.resultCode === 0) {
        // Nếu là phê duyệt hồ sơ, load chi tiết các hồ sơ mới
        if (
          formData.loaipheduyet === "hoso" &&
          formData.listHosoId.length > 0
        ) {
          await loadHoSoDetails(formData.listHosoId);
        }

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
        allHoSo
          .filter((hs) => item.listHosoId.includes(hs.id))
          .some((hs) =>
            hs.taphoso?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        {/* <td>
                          {item.loaipheduyet === "thongtin" &&
                            (dangVienList.find(
                              (dv) => dv.id === item.dangvienId
                            )?.hoten ||
                              "N/A")}
                          {item.loaipheduyet === "hoso" && (
                            <div className="d-flex flex-column gap-1">
                              {item.listHosoId.length > 0
                                ? item.listHosoId.map((id) => {
                                    const hoso = allHoSo.find(
                                      (hs) => hs.id === id
                                    ) || {
                                      id,
                                      taphoso: "N/A",
                                      loaihoso: "N/A",
                                    };
                                    return (
                                      <div key={id}>
                                        {hoso.taphoso !== "N/A"
                                          ? `Tập ${hoso.taphoso.replace(
                                              "tap",
                                              ""
                                            )} - ${hoso.loaihoso || "N/A"}`
                                          : `ID ${id} (Không tìm thấy)`}
                                      </div>
                                    );
                                  })
                                : "N/A"}
                            </div>
                          )}

                          {item.loaipheduyet === "tintuc" &&
                            (tinTucList.find((tt) => tt.id === item.tintucId)
                              ?.tieude ||
                              "N/A")}
                        </td> */}
                        {/* <td>
                          {item.loaipheduyet === "thongtin" &&
                            (dangVienList.find(
                              (dv) => dv.id === item.dangvienId
                            )?.hoten ||
                              "N/A")}
                          {item.loaipheduyet === "hoso" && (
                            <div className="d-flex flex-column gap-1">
                              {item.listHosoId && item.listHosoId.length > 0
                                ? item.listHosoId.map((id) => {
                                    const hoso = allHoSo.find(
                                      (hs) => hs.id === id
                                    );
                                    return hoso ? (
                                      <div key={id}>
                                        {`Tập ${
                                          hoso.taphoso?.replace("tap", "") || ""
                                        } - ${hoso.loaihoso || "N/A"}`}
                                      </div>
                                    ) : (
                                      <div key={id}>ID {id} (Đang tải...)</div>
                                    );
                                  })
                                : "N/A"}
                            </div>
                          )}
                          {item.loaipheduyet === "tintuc" &&
                            (tinTucList.find((tt) => tt.id === item.tintucId)
                              ?.tieude ||
                              "N/A")}
                        </td> */}
                        <td>
                          {item.loaipheduyet === "thongtin" &&
                            (dangVienList.find(
                              (dv) => dv.id === item.dangvienId
                            )?.hoten ||
                              "N/A")}
                          {item.loaipheduyet === "hoso" && (
                            <div className="d-flex flex-column gap-1">
                              {item.listHosoId && item.listHosoId.length > 0
                                ? item.listHosoId.map((id) => {
                                    const hoso = allHoSo.find(
                                      (hs) => hs.id === id
                                    );
                                    return hoso ? (
                                      <div key={id}>
                                        {`Tập ${
                                          hoso.taphoso?.replace("tap", "") || ""
                                        } - ${hoso.loaihoso || "N/A"}`}
                                      </div>
                                    ) : (
                                      <div key={id}>ID {id} (Đang tải...)</div>
                                    );
                                  })
                                : "N/A"}
                            </div>
                          )}
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
                        <td>{item.ghichu || ""}</td>
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
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  handleViewDetail(item.id, item.loaipheduyet)
                                }
                                title="Xem chi tiết"
                              >
                                <i className="fas fa-eye"></i>
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
                {formData.dangvienId && filteredHoSo.length === 0 && (
                  <div className="alert alert-danger">
                    Không có hồ sơ nào ở trạng thái "Đã lưu" hoặc "Từ chối" cho
                    Đảng viên này
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
                    <Form.Label>Tin tức</Form.Label>
                    <Form.Select
                      name="tintucId"
                      value={formData.tintucId}
                      onChange={handleInputChange}
                    >
                      <option value="">
                        Chọn tin tức <span className="text-danger">*</span>
                      </option>
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

      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết phê duyệt</Modal.Title>
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
                  <h5>Thông tin Đảng viên</h5>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th>Họ tên</th>
                        <td>{detailData.hoten || "N/A"}</td>
                      </tr>
                      <tr>
                        <th>Ngày sinh</th>
                        <td>{detailData.ngaysinh || "N/A"}</td>
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
                    </tbody>
                  </table>
                </div>
              )}
              {detailType === "hoso" && Array.isArray(detailData) && (
                <div>
                  <h5>Danh sách hồ sơ</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Tập hồ sơ</th>
                        <th>Loại hồ sơ</th>
                        <th>Trạng thái</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.map((hoso) => (
                        <tr key={hoso.id}>
                          <td>{`Tập ${hoso.taphoso.replace("tap", "")}`}</td>
                          <td>{hoso.loaihoso || "N/A"}</td>
                          <td>
                            <Badge
                              bg={
                                hoso.trangthai === "approved"
                                  ? "success"
                                  : "danger"
                              }
                            >
                              {hoso.trangthai === "approved"
                                ? "Đã duyệt"
                                : "Từ chối"}
                            </Badge>
                          </td>
                          <td>{hoso.ghichu || "N/A"}</td>
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
                        <th>Nội dung</th>
                        <td
                          dangerouslySetInnerHTML={{
                            __html: detailData.noidungtin || "N/A",
                          }}
                        ></td>
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
