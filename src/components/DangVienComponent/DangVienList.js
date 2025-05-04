import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import DangVienTable from "./DangVienTable";
import DangVienDetailModal from "./DangVienDetailModal";
import DangVienAddModal from "./DangVienAddModal";
import DangVienEditModal from "./DangVienEditModal";
import Swal from "sweetalert2";
import {
  createDangVien,
  fetchChiBoDangHoatDong,
  fetchDangVien,
  updateDangVien,
  fetchTheDang,
  createTheDang,
  updateTheDang,
  deleteTheDang,
  exportDangVienToExcel,
} from "../../services/apiService";
import TheDangModal from "../TheDangComponent/TheDangModal";
import QuyetDinhModal from "../QuyetDinhComponent/QuyetDinhModal";

const DangVienList = () => {
  const [dangVien, setDangVien] = useState([]);
  const [chiBoList, setChiBoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [selectedChiBoId, setSelectedChiBoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const itemsPerPage = 10;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDangVien, setSelectedDangVien] = useState(null);

  const [showTheDangModal, setShowTheDangModal] = useState(false);
  const [showAddTheDangForm, setShowAddTheDangForm] = useState(false);
  const [theDangData, setTheDangData] = useState({
    mathe: "",
    ngaycap: new Date().toISOString().split("T")[0],
    noicapthe: "",
  });
  const [theDangFormData, setTheDangFormData] = useState({
    mathe: "",
    ngaycap: new Date().toISOString().split("T")[0],
    noicapthe: "",
  });

  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  const [showQuyetDinhModal, setShowQuyetDinhModal] = useState(false);

   // Kiểm tra quyền trước khi thực hiện các hành động
   const checkPermission = (requiredRole = 'ROLE_ADMIN') => {
    return userRole === requiredRole;
  };

  // Thêm điều kiện vào các nút chức năng
  const renderActionButtons = (dangVienItem) => {
    return (
      <div className="d-flex gap-2">
        <button 
          className="btn btn-primary btn-sm" 
          onClick={() => openDetailModal(dangVienItem)}
        >
          <i className="fas fa-eye"></i>
        </button>
        
        {checkPermission() && (
          <>
            <button 
              className="btn btn-warning btn-sm" 
              onClick={() => openEditModal(dangVienItem)}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button 
              className="btn btn-info btn-sm" 
              onClick={() => openTheDangModal(dangVienItem)}
            >
              <i className="fas fa-id-card"></i>
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => openQuyetDinhModal(dangVienItem)}
            >
              <i className="fas fa-file-alt"></i>
            </button>
            <button 
              className="btn btn-success btn-sm" 
              onClick={() => handleExportExcel(dangVienItem)}
            >
              <i className="fas fa-file-excel"></i>
            </button>
          </>
        )}
      </div>
    );
  };

  // Thêm hàm này trong component
const handleExportExcel = (dangVien) => {
  try {
    setLoading(true);
    exportDangVienToExcel(dangVien);
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: `Đã xuất file Excel cho Đảng viên ${dangVien.hoten}`,
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Xuất file thất bại',
    });
  } finally {
    setLoading(false);
  }
};

  const [formData, setFormData] = useState({
    hoten: "",
    ngaysinh: "",
    gioitinh: "",
    quequan: "",
    dantoc: "",
    trinhdovanhoa: "",
    noihiennay: "",
    chuyennmon: "",
    ngayvaodang: "",
    ngaychinhthuc: "",
    nguoigioithieu1: "",
    nguoigioithieu2: "",
    chucvuchinhquyen: "",
    chucvuchibo: "",
    chucvudanguy: "",
    chucvudoanthe: "",
    noisinhhoatdang: "",
    chucdanh: "",
    trinhdongoaingu: "",
    trinhdochinhtri: "",
    trangthaidangvien: "",
    chiboId: "",
  });

  const token = localStorage.getItem("token");

  const validateForm = () => {
    const errors = {};
    if (!formData.hoten.trim()) {
      errors.hoten = "Họ và tên Đảng viên là bắt buộc";
    } else if (formData.hoten.length < 2) {
      errors.hoten = "Họ và tên Đảng viên phải có ít nhất 2 ký tự";
    } else if (formData.hoten.length > 50) {
      errors.hoten = "Họ và tên Đảng viên không được vượt quá 50 ký tự";
    }

    if (!formData.ngaysinh) {
      errors.ngaysinh = "Ngày sinh của Đảng viên là bắt buộc";
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.ngaysinh);
      if (selectedDate > today) {
        errors.ngaysinh =
          "Ngày sinh của Đảng viên không được là ngày trong tương lai";
      }
    }

    if (!formData.gioitinh) {
      errors.gioitinh = "Giới tính của Đảng viên là bắt buộc";
    }

    if (formData.quequan && formData.quequan.length > 200) {
      errors.quequan = "Quê quán của Đảng viên không được vượt quá 200 ký tự";
    }

    if (formData.dantoc && formData.dantoc.length > 50) {
      errors.dantoc = "Dân tộc của Đảng viên không được vượt quá 50 ký tự";
    }

    if (formData.trinhdovanhoa && formData.trinhdovanhoa.length > 100) {
      errors.trinhdovanhoa =
        "Trình độ văn hóa của Đảng viên không được vượt quá 100 ký tự";
    }

    if (formData.noihiennay && formData.noihiennay.length > 200) {
      errors.noihiennay =
        "Nơi ở hiện nay của Đảng viên không được vượt quá 200 ký tự";
    }

    if (formData.chuyennmon && formData.chuyennmon.length > 100) {
      errors.chuyennmon =
        "Trình độ chuyên môn của Đảng viên không được vượt quá 100 ký tự";
    }

    if (!formData.ngayvaodang) {
      errors.ngayvaodang = "Ngày vào Đảng là bắt buộc";
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.ngayvaodang);
      if (selectedDate > today) {
        errors.ngayvaodang = "Ngày vào Đảng không được là ngày trong tương lai";
      }
    }

    if (formData.ngaychinhthuc) {
      const selectedDate = new Date(formData.ngaychinhthuc);
      const ngayVaoDang = new Date(formData.ngayvaodang);
      if (selectedDate < ngayVaoDang) {
        errors.ngaychinhthuc =
          "Ngày vào Đảng chính thức phải sau ngày vào Đảng";
      }
    }

    if (!formData.trangthaidangvien) {
      errors.trangthaidangvien = "Trạng thái Đảng viên là bắt buộc";
    } else if (
      !["chinhthuc", "dubi", "khaitru"].includes(formData.trangthaidangvien)
    ) {
      errors.trangthaidangvien = "Trạng thái Đảng viên không hợp lệ";
    }

    if (!formData.chiboId) {
      errors.chiboId = "Chi bộ là bắt buộc";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    const errors = {};
    if (!formData.hoten.trim()) {
      errors.hoten = "Họ và tên Đảng viên là bắt buộc";
    } else if (formData.hoten.length < 2) {
      errors.hoten = "Họ và tên Đảng viên phải có ít nhất 2 ký tự";
    } else if (formData.hoten.length > 50) {
      errors.hoten = "Họ và tên Đảng viên không được vượt quá 50 ký tự";
    }

    if (!formData.ngaysinh) {
      errors.ngaysinh = "Ngày sinh của Đảng viên là bắt buộc";
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.ngaysinh);
      if (selectedDate > today) {
        errors.ngaysinh =
          "Ngày sinh của Đảng viên không được là ngày trong tương lai";
      }
    }

    if (!formData.gioitinh) {
      errors.gioitinh = "Giới tính của Đảng viên là bắt buộc";
    }

    if (formData.quequan && formData.quequan.length > 200) {
      errors.quequan = "Quê quán của Đảng viên không được vượt quá 200 ký tự";
    }

    if (formData.dantoc && formData.dantoc.length > 50) {
      errors.dantoc = "Dân tộc của Đảng viên không được vượt quá 50 ký tự";
    }

    if (formData.trinhdovanhoa && formData.trinhdovanhoa.length > 100) {
      errors.trinhdovanhoa =
        "Trình độ văn hóa của Đảng viên không được vượt quá 100 ký tự";
    }

    if (formData.noihiennay && formData.noihiennay.length > 200) {
      errors.noihiennay =
        "Nơi ở hiện nay của Đảng viên không được vượt quá 200 ký tự";
    }

    if (formData.chuyennmon && formData.chuyennmon.length > 100) {
      errors.chuyennmon =
        "Trình độ chuyên môn của Đảng viên không được vượt quá 100 ký tự";
    }

    if (!formData.ngayvaodang) {
      errors.ngayvaodang = "Ngày vào Đảng là bắt buộc";
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.ngayvaodang);
      if (selectedDate > today) {
        errors.ngayvaodang = "Ngày vào Đảng không được là ngày trong tương lai";
      }
    }

    if (formData.ngaychinhthuc) {
      const selectedDate = new Date(formData.ngaychinhthuc);
      const ngayVaoDang = new Date(formData.ngayvaodang);
      if (selectedDate < ngayVaoDang) {
        errors.ngaychinhthuc =
          "Ngày vào Đảng chính thức phải sau ngày vào Đảng";
      }
    }

    if (!formData.trangthaidangvien) {
      errors.trangthaidangvien = "Trạng thái Đảng viên là bắt buộc";
    } else if (
      !["chinhthuc", "dubi", "khaitru"].includes(formData.trangthaidangvien)
    ) {
      errors.trangthaidangvien = "Trạng thái Đảng viên không hợp lệ";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadChiBo = async () => {
    try {
      const response = await fetchChiBoDangHoatDong(token);
      const data = await response.json();
      if (data.resultCode === 0) {
        setChiBoList(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data.message || "Không thể tải danh sách chi bộ");
      }
    } catch (err) {
      console.error("Error loading chiBo:", err);
      Swal.fire("Lỗi!", "Không thể tải danh sách chi bộ", "error");
    }
  };

  const loadDangVien = async () => {
    setLoading(true);
    try {
      const response = await fetchDangVien(token, searchType, selectedChiBoId);
      const data = await response.json();
      if (data.resultCode === 0) {
        setDangVien(Array.isArray(data.data) ? data.data : []);
        setError(null);
        setCurrentPage(1);
      } else {
        throw new Error(data.message || "Không thể tải danh sách Đảng viên");
      }
    } catch (err) {
      setError("Không thể tải danh sách Đảng viên");
      console.error("Error loading dangVien:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDangVien = async () => {
    if (!validateForm()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }

    try {
      setLoading(true);
      const { chiboId, ...dangVienData } = formData;
      const data = await createDangVien(token, chiboId, dangVienData);
      if (data.resultCode === 0) {
        setDangVien([...dangVien, data.data]);
        setShowAddModal(false);
        setValidationErrors({});
        Swal.fire("Thành công!", "Thêm Đảng viên thành công", "success");
      } else {
        throw new Error(data.message || "Thêm Đảng viên thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Thêm Đảng viên thất bại", "error");
      console.error("Error adding dangVien:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDangVien = async () => {
    if (!validateEditForm()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }

    try {
      setLoading(true);
      const { chiboId, ...dangVienData } = formData;
      const data = await updateDangVien(
        token,
        selectedDangVien.id,
        dangVienData
      );
      if (data.resultCode === 0) {
        setDangVien(
          dangVien.map((item) =>
            item.id === selectedDangVien.id ? data.data : item
          )
        );
        setShowEditModal(false);
        setValidationErrors({});
        Swal.fire("Thành công!", "Cập nhật Đảng viên thành công", "success");
      } else {
        throw new Error(data.message || "Cập nhật Đảng viên thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Cập nhật Đảng viên thất bại", "error");
      console.error("Error updating dangVien:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChiBo();
    loadDangVien();
  }, [searchType, selectedChiBoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSelectedChiBoId("");
    setSearchTerm("");
  };

  const filteredDangVien =
    searchType === "all"
      ? dangVien.filter(
          (item) =>
            item.hoten?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            item.ngaysinh?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            item.noisinhhoatdang
              ?.toLowerCase()
              ?.includes(searchTerm.toLowerCase())
        )
      : dangVien;

  const totalPages = Math.ceil(filteredDangVien.length / itemsPerPage);
  const currentItems = filteredDangVien.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddModal = () => {
    setFormData({
      hoten: "",
      ngaysinh: "",
      gioitinh: "",
      quequan: "",
      dantoc: "",
      trinhdovanhoa: "",
      noihiennay: "",
      chuyennmon: "",
      ngayvaodang: "",
      ngaychinhthuc: "",
      nguoigioithieu1: "",
      nguoigioithieu2: "",
      chucvuchinhquyen: "",
      chucvuchibo: "",
      chucvudanguy: "",
      chucvudoanthe: "",
      noisinhhoatdang: "",
      chucdanh: "",
      trinhdongoaingu: "",
      trinhdochinhtri: "",
      trangthaidangvien: "",
      chiboId: "",
    });
    setValidationErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (dangVienItem) => {
    setSelectedDangVien(dangVienItem);
    setFormData({
      hoten: dangVienItem.hoten,
      ngaysinh: dangVienItem.ngaysinh,
      gioitinh: dangVienItem.gioitinh,
      quequan: dangVienItem.quequan,
      dantoc: dangVienItem.dantoc,
      trinhdovanhoa: dangVienItem.trinhdovanhoa,
      noihiennay: dangVienItem.noihiennay,
      chuyennmon: dangVienItem.chuyennmon,
      ngayvaodang: dangVienItem.ngayvaodang,
      ngaychinhthuc: dangVienItem.ngaychinhthuc,
      nguoigioithieu1: dangVienItem.nguoigioithieu1,
      nguoigioithieu2: dangVienItem.nguoigioithieu2,
      chucvuchinhquyen: dangVienItem.chucvuchinhquyen,
      chucvuchibo: dangVienItem.chucvuchibo,
      chucvudanguy: dangVienItem.chucvudanguy,
      chucvudoanthe: dangVienItem.chucvudoanthe,
      noisinhhoatdang: dangVienItem.noisinhhoatdang,
      chucdanh: dangVienItem.chucdanh,
      trinhdongoaingu: dangVienItem.trinhdongoaingu,
      trinhdochinhtri: dangVienItem.trinhdochinhtri,
      trangthaidangvien: dangVienItem.trangthaidangvien,
      chiboId: dangVienItem.chibo?.id || dangVienItem.chiboId || "",
    });
    setValidationErrors({});
    setShowEditModal(true);
  };

  const openDetailModal = (dangVienItem) => {
    setSelectedDangVien(dangVienItem);
    setShowDetailModal(true);
  };

  const openTheDangModal = async (dangVienItem) => {
    setSelectedDangVien(dangVienItem);
    try {
      const response = await fetchTheDang(token, dangVienItem.id);
      if (response.resultCode === 0) {
        setTheDangData(response.data || null);
        setShowAddTheDangForm(response.data === null);
        setTheDangFormData({
          mathe: response.data?.mathe || "",
          ngaycap:
            response.data?.ngaycap || new Date().toISOString().split("T")[0],
          noicapthe: response.data?.noicapthe || "",
        });
      } else {
        throw new Error(response.message || "Không thể tải thông tin thẻ Đảng");
      }
      setShowTheDangModal(true);
    } catch (error) {
      console.error("Error fetching theDang:", error);
      Swal.fire("Lỗi", "Không thể tải thông tin thẻ Đảng", "error");
      setTheDangData(null);
      setShowAddTheDangForm(true);
      setTheDangFormData({
        mathe: "",
        ngaycap: new Date().toISOString().split("T")[0],
        noicapthe: "",
      });
      setShowTheDangModal(true);
    }
  };

  const openQuyetDinhModal = (dangVienItem) => {
    setSelectedDangVien(dangVienItem);
    setShowQuyetDinhModal(true);
  };

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-3 mb-md-0">Danh sách Đảng viên</h1>
          <div className="d-flex gap-2 align-items-center">
            <Form.Select
              value={searchType}
              onChange={handleSearchTypeChange}
              style={{ width: "200px" }}
            >
              <option value="all">Tất cả</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="chibo">Theo chi bộ</option>
            </Form.Select>
            {searchType === "chibo" && (
              <Form.Select
                value={selectedChiBoId}
                onChange={(e) => setSelectedChiBoId(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="">Chọn chi bộ</option>
                {chiBoList.map((chiBo) => (
                  <option key={chiBo.id} value={chiBo.id}>
                    {chiBo.tenchibo}
                  </option>
                ))}
              </Form.Select>
            )}
            <div
              className="d-flex"
              style={{ width: "100%", maxWidth: "450px" }}
            >
              <input
                type="text"
                className="form-control custom-sm-input"
                placeholder="Tìm kiếm Đảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={searchType !== "all"}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              />
              <button
                className="btn btn-primary custom-sm-btn"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
            {/* <button
              className="btn btn-success custom-sm-btn-dangvien"
              onClick={openAddModal}
            >
              <i className="fas fa-plus me-2"></i>Thêm mới
            </button> */}
            {checkPermission() && (
          <button
            className="btn btn-success custom-sm-btn-dangvien"
            onClick={openAddModal}
          >
            <i className="fas fa-plus me-2"></i>Thêm mới
          </button>
        )}
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

        <DangVienTable
          searchType={searchType}
          selectedChiBoId={selectedChiBoId}
          currentItems={currentItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          openDetailModal={openDetailModal}
          openEditModal={openEditModal}
          openTheDangModal={openTheDangModal}
          openQuyetDinhModal={openQuyetDinhModal}
          handleExportExcel={handleExportExcel}
        />

        <DangVienDetailModal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          selectedDangVien={selectedDangVien}
          token={token}
        />

        <DangVienAddModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          formData={formData}
          validationErrors={validationErrors}
          chiBoList={chiBoList}
          handleInputChange={handleInputChange}
          handleAddDangVien={handleAddDangVien}
          loading={loading}
        />

        <DangVienEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          formData={formData}
          validationErrors={validationErrors}
          chiBoList={chiBoList}
          handleInputChange={handleInputChange}
          handleUpdateDangVien={handleUpdateDangVien}
          loading={loading}
        />

        <TheDangModal
          show={showTheDangModal}
          onHide={() => setShowTheDangModal(false)}
          selectedDangVien={selectedDangVien}
          theDangData={theDangData}
          setTheDangData={setTheDangData}
          showAddTheDangForm={showAddTheDangForm}
          setShowAddTheDangForm={setShowAddTheDangForm}
          theDangFormData={theDangFormData}
          setTheDangFormData={setTheDangFormData}
          validationErrors={validationErrors}
          token={token}
          fetchTheDang={fetchTheDang}
          createTheDang={createTheDang}
          updateTheDang={updateTheDang}
          deleteTheDang={deleteTheDang}
          loading={loading}
          setLoading={setLoading}
        />

        <QuyetDinhModal
          show={showQuyetDinhModal}
          onHide={() => setShowQuyetDinhModal(false)}
          selectedDangVien={selectedDangVien}
          token={token}
        />
      </div>
    </div>
  );
};

export default DangVienList;
