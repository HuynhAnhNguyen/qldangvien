import React, { useState, useEffect } from "react";
import ChiBoTable from "./ChiBoTable";
import ChiBoDetailModal from "./ChiBoDetailModal";
import ChiBoAddModal from "./ChiBoAddModal";
import ChiBoEditModal from "./ChiBoEditModal";
import ChiBoXepLoaiModal from "./ChiBoXepLoaiModal";
import Swal from "sweetalert2";
import {
  fetchChiBo,
  createChiBo,
  updateChiBo,
  createXepLoai,
  updateXepLoai,
  fetchXepLoaiByChiBoId,
} from "../../services/apiService";


const ChiBoList = () => {
  const [chiBo, setChiBo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const itemsPerPage = 10;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showXepLoaiModal, setShowXepLoaiModal] = useState(false);
  const [selectedChiBo, setSelectedChiBo] = useState(null);
  const [xepLoaiList, setXepLoaiList] = useState([]);
  const [xepLoaiForm, setXepLoaiForm] = useState({
    nam: "",
    xeploai: "",
  });
  const [editXepLoaiId, setEditXepLoaiId] = useState(null);

  const [formData, setFormData] = useState({
    tenchibo: "",
    danguycaptren: "",
    diachi: "",
    bithu: "",
    phobithu: "",
    ngaythanhlap: "",
    ghichu: "",
    trangthai: "",
  });

  const token = localStorage.getItem("token");

  const validateForm = () => {
    const errors = {};

    if (!formData.tenchibo.trim()) {
      errors.tenchibo = "Tên chi bộ là bắt buộc";
    } else if (formData.tenchibo.length < 3) {
      errors.tenchibo = "Tên chi bộ phải có ít nhất 3 ký tự";
    } else if (formData.tenchibo.length > 100) {
      errors.tenchibo = "Tên chi bộ không được vượt quá 100 ký tự";
    }

    if (!formData.danguycaptren.trim()) {
      errors.danguycaptren = "Đảng ủy cấp trên là bắt buộc";
    } else if (formData.danguycaptren.length < 3) {
      errors.danguycaptren = "Đảng ủy cấp trên phải có ít nhất 3 ký tự";
    } else if (formData.danguycaptren.length > 100) {
      errors.danguycaptren = "Đảng ủy cấp trên không được vượt quá 100 ký tự";
    }

    if (formData.diachi && formData.diachi.length > 200) {
      errors.diachi = "Địa chỉ không được vượt quá 200 ký tự";
    }

    if (!formData.bithu.trim()) {
      errors.bithu = "Họ và tên bí thư là bắt buộc";
    } else if (formData.bithu.length < 2) {
      errors.bithu = "Họ và tên bí thư phải có ít nhất 2 ký tự";
    } else if (formData.bithu.length > 50) {
      errors.bithu = "Họ và tên bí thư không được vượt quá 50 ký tự";
    }

    if (formData.phobithu && formData.phobithu.length > 50) {
      errors.phobithu = "Họ và tên phó bí thư không được vượt quá 50 ký tự";
    }

    if (!formData.ngaythanhlap) {
      errors.ngaythanhlap = "Ngày thành lập là bắt buộc";
    } else {
      const today = new Date();
      const selectedDate = new Date(formData.ngaythanhlap);
      if (selectedDate > today) {
        errors.ngaythanhlap =
          "Ngày thành lập không được là ngày trong tương lai";
      }
    }

    if (!formData.trangthai) {
      errors.trangthai = "Trạng thái là bắt buộc";
    } else if (
      !["hoatdong", "giaithe", "tamdung"].includes(formData.trangthai)
    ) {
      errors.trangthai = "Trạng thái không hợp lệ";
    }

    if (formData.ghichu && formData.ghichu.length > 500) {
      errors.ghichu = "Ghi chú không được vượt quá 500 ký tự";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateXepLoaiForm = () => {
    const errors = {};

    if (!xepLoaiForm.nam) {
      errors.nam = "Năm là bắt buộc";
    } else if (!/^\d{4}$/.test(xepLoaiForm.nam)) {
      errors.nam = "Năm phải là số có 4 chữ số";
    }

    if (!xepLoaiForm.xeploai) {
      errors.xeploai = "Hình thức xếp loại là bắt buộc";
    } else if (
      !["xuatsac", "tot", "hoanthanh", "khonghoanthanh"].includes(
        xepLoaiForm.xeploai
      )
    ) {
      errors.xeploai = "Hình thức xếp loại không hợp lệ";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const loadChiBo = async () => {
    setLoading(true);
    try {
      const response = await fetchChiBo(token);
      if (response.resultCode === 0) {
        const chiBoData = Array.isArray(response.data) ? response.data : [];
        setChiBo(chiBoData);
        setError(null);
      } else {
        throw new Error(response.message || "Không thể tải danh sách chi bộ");
      }
    } catch (err) {
      setError("Không thể tải danh sách chi bộ");
      console.error("Error loading chiBo:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadXepLoai = async (chiboId) => {
    setLoading(true);
    try {
      const response = await fetchXepLoaiByChiBoId(token, chiboId);
      if (response.resultCode === 0) {
        setXepLoaiList(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } else {
        throw new Error(response.message || "Không thể tải danh sách xếp loại");
      }
    } catch (err) {
      setError("Không thể tải danh sách xếp loại");
      console.error("Error loading xepLoai:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateXepLoai = async () => {
    if (!validateXepLoaiForm()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await createXepLoai(
        token,
        selectedChiBo.id,
        xepLoaiForm.nam,
        xepLoaiForm.xeploai
      );
      if (response.resultCode === 0) {
        setXepLoaiList([...xepLoaiList, response.data]);
        setXepLoaiForm({ nam: "", xeploai: "" });
        setValidationErrors({});
        Swal.fire("Thành công!", "Xếp loại chi bộ thành công", "success");
      } else {
        throw new Error(response.message || "Xếp loại chi bộ thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Xếp loại chi bộ thất bại", "error");
      console.error("Error creating xepLoai:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateXepLoai = async () => {
    if (!validateXepLoaiForm()) {
      Swal.fire("Lỗi!", "Vui lòng chọn hình thức xếp loại!", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await updateXepLoai(
        token,
        editXepLoaiId,
        xepLoaiForm.xeploai
      );
      if (response.resultCode === 0) {
        setXepLoaiList(
          xepLoaiList.map((item) =>
            item.id === editXepLoaiId ? response.data : item
          )
        );
        setEditXepLoaiId(null);
        setXepLoaiForm({ nam: "", xeploai: "" });
        setValidationErrors({});
        Swal.fire("Thành công!", "Cập nhật xếp loại thành công", "success");
      } else {
        throw new Error(response.message || "Cập nhật xếp loại thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Cập nhật xếp loại thất bại", "error");
      console.error("Error updating xepLoai:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChiBo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleXepLoaiInputChange = (e) => {
    const { name, value } = e.target;
    setXepLoaiForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddChiBo = async () => {
    if (!validateForm()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }

    try {
      setLoading(true);
      const newChiBo = await createChiBo(token, formData);
      if (newChiBo.resultCode === 0) {
        setChiBo([...chiBo, newChiBo.data]);
        setShowAddModal(false);
        setValidationErrors({});
        Swal.fire("Thành công!", "Thêm chi bộ thành công", "success");
      } else {
        throw new Error(newChiBo.message || "Thêm chi bộ thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Thêm chi bộ thất bại", "error");
      console.error("Error adding chiBo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChiBo = async () => {
    if (!validateForm()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }
    try {
      setLoading(true);
      const updatedChiBo = await updateChiBo(token, selectedChiBo.id, formData);
      if (updatedChiBo.resultCode === 0) {
        setChiBo(
          chiBo.map((item) =>
            item.id === selectedChiBo.id ? updatedChiBo.data : item
          )
        );
        setShowEditModal(false);
        setValidationErrors({});
        Swal.fire("Thành công!", "Cập nhật chi bộ thành công", "success");
      } else {
        throw new Error(updatedChiBo.message || "Cập nhật chi bộ thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Cập nhật chi bộ thất bại", "error");
      console.error("Error updating chiBo:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredChiBo = chiBo.filter(
    (item) =>
      item.tenchibo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.danguycaptren.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bithu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredChiBo.length / itemsPerPage);
  const currentItems = filteredChiBo.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddModal = () => {
    setFormData({
      tenchibo: "",
      danguycaptren: "",
      diachi: "",
      bithu: "",
      phobithu: "",
      ngaythanhlap: "",
      ghichu: "",
      trangthai: "",
    });
    setValidationErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (chiBoItem) => {
    setSelectedChiBo(chiBoItem);
    setFormData({
      tenchibo: chiBoItem.tenchibo,
      danguycaptren: chiBoItem.danguycaptren,
      diachi: chiBoItem.diachi,
      bithu: chiBoItem.bithu,
      phobithu: chiBoItem.phobithu,
      ngaythanhlap: chiBoItem.ngaythanhlap,
      ghichu: chiBoItem.ghichu,
      trangthai: chiBoItem.trangthai,
    });
    setValidationErrors({});
    setShowEditModal(true);
  };

  const openXepLoaiModal = (chiBoItem) => {
    setSelectedChiBo(chiBoItem);
    setXepLoaiForm({ nam: "", xeploai: "" });
    setEditXepLoaiId(null);
    loadXepLoai(chiBoItem.id);
    setShowXepLoaiModal(true);
  };

  const openDetailModal = (chiBoItem) => {
    setSelectedChiBo(chiBoItem);
    setXepLoaiList([]);
    loadXepLoai(chiBoItem.id);
    setShowDetailModal(true);
  };

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-3 mb-md-0">Danh sách chi bộ</h1>
          <div className="d-flex gap-2">
            <div
              className="d-flex"
              style={{ width: "100%", maxWidth: "450px" }}
            >
              <input
                type="text"
                className="form-control custom-sm-input"
                placeholder="Tìm kiếm chi bộ..."
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
            <button
              className="btn btn-success custom-sm-btn"
              onClick={openAddModal}
            >
              <i className="fas fa-plus me-2"></i>Thêm mới
            </button>
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

        {filteredChiBo.length === 0 && !loading && !error ? (
          <div className="text-center py-4 color-black">
            Không tìm thấy chi bộ phù hợp với yêu cầu!
          </div>
        ) : (
          <ChiBoTable
            currentItems={currentItems}
            filteredChiBo={filteredChiBo} // Added to control pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            openDetailModal={openDetailModal}
            openEditModal={openEditModal}
            openXepLoaiModal={openXepLoaiModal}
          />
        )}

        <ChiBoDetailModal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          selectedChiBo={selectedChiBo}
          xepLoaiList={xepLoaiList}
        />

        <ChiBoAddModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          formData={formData}
          validationErrors={validationErrors}
          handleInputChange={handleInputChange}
          handleAddChiBo={handleAddChiBo}
          loading={loading}
        />

        <ChiBoEditModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          formData={formData}
          validationErrors={validationErrors}
          handleInputChange={handleInputChange}
          handleUpdateChiBo={handleUpdateChiBo}
          loading={loading}
        />

        <ChiBoXepLoaiModal
          show={showXepLoaiModal}
          onHide={() => setShowXepLoaiModal(false)}
          selectedChiBo={selectedChiBo}
          xepLoaiList={xepLoaiList}
          xepLoaiForm={xepLoaiForm}
          editXepLoaiId={editXepLoaiId}
          setEditXepLoaiId={setEditXepLoaiId}
          handleXepLoaiInputChange={handleXepLoaiInputChange}
          handleCreateXepLoai={handleCreateXepLoai}
          handleUpdateXepLoai={handleUpdateXepLoai}
          validationErrors={validationErrors}
          loading={loading}
          setXepLoaiForm={setXepLoaiForm}
        />
      </div>
    </div>
  );
};

export default ChiBoList;