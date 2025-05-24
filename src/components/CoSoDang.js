import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Tabs, Tab } from "react-bootstrap";
import {
  fetchDanguy,
  fetchDangBoByDangUyId,
  fetchChiBoByDangBoId,
  createChiBo,
  updateChiBo,
  createXepLoai,
  updateXepLoai,
  fetchXepLoaiByChiBoId,
  fetchDangVienByChiBo,
} from "../services/apiService";
import Swal from "sweetalert2";

const CoSoDang = () => {
  const [dangUyList, setDangUyList] = useState([]);
  const [dangBoList, setDangBoList] = useState([]);
  const [chiBoList, setChiBoList] = useState([]);
  const [dangVienList, setDangVienList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDangUyId, setSelectedDangUyId] = useState("alldanguy");
  const [selectedDangBoId, setSelectedDangBoId] = useState("");
  const [selectedChiBoId, setSelectedChiBoId] = useState("allchibo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const itemsPerPage = 10;

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showXepLoaiModal, setShowXepLoaiModal] = useState(false);
  const [showDangVienModal, setShowDangVienModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [xepLoaiList, setXepLoaiList] = useState([]);
  const [xepLoaiForm, setXepLoaiForm] = useState({
    nam: "",
    xeploai: "",
  });
  const [editXepLoaiId, setEditXepLoaiId] = useState(null);

  // Form data for adding/editing
  const [formData, setFormData] = useState({
    tenchibo: "",
    danguycaptren: "",
    diachi: "",
    bithu: "",
    phobithu: "",
    ngaythanhlap: "",
    ghichu: "",
    trangthai: "",
    loai: "",
    danguyCaptrenId: 0,
  });

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.tenchibo.trim()) {
      errors.tenchibo = "Tên là bắt buộc";
    } else if (formData.tenchibo.length < 3) {
      errors.tenchibo = "Tên phải có ít nhất 3 ký tự";
    } else if (formData.tenchibo.length > 100) {
      errors.tenchibo = "Tên không được vượt quá 100 ký tự";
    }

    if (selectedDangUyId !== "alldanguy" && !formData.danguycaptren.trim()) {
      errors.danguycaptren = "Đảng ủy/Đảng bộ cấp trên là bắt buộc";
    } else if (formData.danguycaptren && formData.danguycaptren.length > 100) {
      errors.danguycaptren =
        "Đảng ủy/Đảng bộ cấp trên không được vượt quá 100 ký tự";
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

    if (!formData.loai) {
      errors.loai = "Loại là bắt buộc";
    }

    if (formData.ghichu && formData.ghichu.length > 500) {
      errors.ghichu = "Ghi chú không được vượt quá 500 ký tự";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate XepLoai form
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

  // Load initial data (Tất cả Đảng ủy)
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const dangUyResponse = await fetchDanguy(token);
      if (dangUyResponse.resultCode === 0) {
        setDangUyList(dangUyResponse.data || []);
        setDangBoList([]);
        setChiBoList([]);

        if (dangUyResponse.data.length > 0) {
        const firstDangUyId = dangUyResponse.data[0].id;
        setSelectedDangUyId(firstDangUyId);
        await loadDangBoByDangUy(firstDangUyId); // gọi load tiếp Đảng bộ nếu cần
    }

      } else {
        throw new Error(
          dangUyResponse.message || "Không thể tải danh sách đảng ủy"
        );
      }
    } catch (err) {
      setError(err.message);
      console.error("Error loading initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load Đảng bộ by Đảng ủy ID
  const loadDangBoByDangUy = async (dangUyId) => {
    setLoading(true);
    try {
      const response = await fetchDangBoByDangUyId(token, dangUyId);
      if (response.resultCode === 0) {
        setDangBoList(response.data || []);
        setChiBoList([]);
      } else {
        throw new Error(response.message || "Không thể tải danh sách đảng bộ");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error loading dang bo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load Chi bộ by Đảng bộ ID
  const loadChiBoByDangBo = async (dangBoId) => {
    setLoading(true);
    try {
      const response = await fetchChiBoByDangBoId(token, dangBoId);
      if (response.resultCode === 0) {
        setChiBoList(response.data || []);
      } else {
        throw new Error(response.message || "Không thể tải danh sách chi bộ");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error loading chi bo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch XepLoai by ChiBoId
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

  // Fetch Dangvien By ChiBoId
  const loadDangVienByChiBoId = async (chiboId) => {
    setLoading(true);
    try {
      const response = await fetchDangVienByChiBo(token, chiboId);
      if (response.resultCode === 0) {
        setDangVienList(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } else {
        throw new Error(
          response.message || "Không thể tải danh sách Đảng viên"
        );
      }
    } catch (err) {
      setError("Không thể tải danh sách Đảng viên");
      console.error("Error loading xepLoai:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new XepLoai
  const handleCreateXepLoai = async () => {
    if (!validateXepLoaiForm()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await createXepLoai(
        token,
        selectedItem.id,
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

  // Update XepLoai
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
    loadInitialData();
  }, []);

  // Handle Đảng ủy selection change
  const handleDangUyChange = async (e) => {
    const dangUyId = e.target.value;
    setSelectedDangUyId(dangUyId);
    setSelectedDangBoId("");
    setSelectedChiBoId("allchibo");
    setCurrentPage(1);

    if (dangUyId === "alldanguy") {
      // loadInitialData();
      const dangUyResponse = await fetchDanguy(token);
      if (dangUyResponse.resultCode === 0) {
        setDangUyList(dangUyResponse.data || []);
        setDangBoList([]); // Reset danh sách Đảng bộ
        setChiBoList([]); // Reset danh sách Chi bộ
      }
    } else if (dangUyId) {
      await loadDangBoByDangUy(dangUyId);
    }
  };

  // Handle Đảng bộ selection change
  const handleDangBoChange = async (e) => {
    const dangBoId = e.target.value;
    setSelectedDangBoId(dangBoId);
    setSelectedChiBoId("allchibo");
    setCurrentPage(1);

    if (dangBoId === "alldangbo") {
      await loadDangBoByDangUy(selectedDangUyId);
    } else if (dangBoId) {
      await loadChiBoByDangBo(dangBoId);
    }
  };

  // Handle Chi bộ selection change
  const handleChiBoChange = async (e) => {
    const chiBoId = e.target.value;
    setSelectedChiBoId(chiBoId);
    setCurrentPage(1);

    if (chiBoId === "allchibo") {
      // Nếu chọn "Tất cả Chi bộ" thì load lại toàn bộ Chi bộ
      await loadChiBoByDangBo(selectedDangBoId);
    }
  };

  // Determine which data to display based on selections
  const getDataToDisplay = () => {
    if (selectedDangUyId === "alldanguy") {
      return dangUyList;
    } else if (selectedDangBoId === "" || selectedDangBoId === "alldangbo") {
      return dangBoList;
    } else {
      // Xử lý trường hợp Chi bộ
      if (selectedChiBoId === "allchibo") {
        return chiBoList; // Hiển thị tất cả Chi bộ
      } else {
        // Hiển thị Chi bộ được chọn
        return chiBoList.filter((cb) => cb.id === parseInt(selectedChiBoId));
      }
    }
  };

  // Pagination
  const totalItems = getDataToDisplay().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = getDataToDisplay().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle XepLoai form input changes
  const handleXepLoaiInputChange = (e) => {
    const { name, value } = e.target;
    setXepLoaiForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle add item
  const handleAddItem = async () => {
    if (!validateForm()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }

    try {
      setLoading(true);
      let requestData = { ...formData };

      // Set loai based on current view
      // if (selectedDangUyId === "alldanguy") {
      //   requestData.loai = "danguy";
      //   requestData.danguyCaptrenId = 0;
      // } else if (selectedDangBoId === "" || selectedDangBoId === "alldangbo") {
      //   requestData.loai = "dangbo";
      //   requestData.danguyCaptrenId = parseInt(selectedDangUyId);
      // } else {
      //   requestData.loai = "chibo";
      //   requestData.danguyCaptrenId = parseInt(selectedDangBoId);
      // }
      // Xác định danguyCaptrenId từ tên được chọn
      if (selectedDangUyId === "alldanguy") {
        requestData.loai = "danguy";
        requestData.danguyCaptrenId = 0;
      } else if (selectedDangBoId === "" || selectedDangBoId === "alldangbo") {
        requestData.loai = "dangbo";
        const selectedDangUy = dangUyList.find(
          (du) => du.tenchibo === formData.danguycaptren
        );
        requestData.danguyCaptrenId = selectedDangUy?.id || 0;
      } else {
        requestData.loai = "chibo";
        const selectedDangBo = dangBoList.find(
          (db) => db.tenchibo === formData.danguycaptren
        );
        requestData.danguyCaptrenId = selectedDangBo?.id || 0;
      }

      const newItem = await createChiBo(token, requestData);
      if (newItem.resultCode === 0) {
        // Refresh the current view
        if (selectedDangUyId === "alldanguy") {
          await loadInitialData();
        } else if (
          selectedDangBoId === "" ||
          selectedDangBoId === "alldangbo"
        ) {
          await loadDangBoByDangUy(selectedDangUyId);
        } else {
          await loadChiBoByDangBo(selectedDangBoId);
        }

        setShowAddModal(false);
        setValidationErrors({});
        Swal.fire("Thành công!", "Thêm thành công", "success");
      } else {
        throw new Error(newItem.message || "Thêm thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Thêm thất bại", "error");
      console.error("Error adding item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle update item
  const handleUpdateItem = async () => {
    if (!validateForm()) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ các trường bắt buộc!", "error");
      return;
    }
    try {
      setLoading(true);
      let requestData = { ...formData };

      // Set loai based on current view
      // if (selectedDangUyId === "alldanguy") {
      //   requestData.loai = "danguy";
      //   requestData.danguyCaptrenId = 0;
      // } else if (selectedDangBoId === "" || selectedDangBoId === "alldangbo") {
      //   requestData.loai = "dangbo";
      //   requestData.danguyCaptrenId = parseInt(selectedDangUyId);
      // } else {
      //   requestData.loai = "chibo";
      //   requestData.danguyCaptrenId = parseInt(selectedDangBoId);
      // }
      if (selectedItem.loai === "dangbo") {
        const selectedDangUy = dangUyList.find(
          (du) => du.tenchibo === formData.danguycaptren
        );
        requestData.danguyCaptrenId = selectedDangUy?.id || 0;
      } else if (selectedItem.loai === "chibo") {
        const selectedDangBo = dangBoList.find(
          (db) => db.tenchibo === formData.danguycaptren
        );
        requestData.danguyCaptrenId = selectedDangBo?.id || 0;
      }

      const updatedItem = await updateChiBo(
        token,
        selectedItem.id,
        requestData
      );
      if (updatedItem.resultCode === 0) {
        // Refresh the current view
        if (selectedDangUyId === "alldanguy") {
          await loadInitialData();
        } else if (
          selectedDangBoId === "" ||
          selectedDangBoId === "alldangbo"
        ) {
          await loadDangBoByDangUy(selectedDangUyId);
        } else {
          await loadChiBoByDangBo(selectedDangBoId);
        }

        setShowEditModal(false);
        setValidationErrors({});
        Swal.fire("Thành công!", "Cập nhật thành công", "success");
      } else {
        throw new Error(updatedItem.message || "Cập nhật thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi!", "Cập nhật thất bại", "error");
      console.error("Error updating item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form when opening add modal
  const openAddModal = () => {
    // setFormData({
    //   tenchibo: "",
    //   danguycaptren:
    //     selectedDangUyId === "alldanguy"
    //       ? ""
    //       : selectedDangBoId === "" || selectedDangBoId === "alldangbo"
    //       ? dangUyList.find((du) => du.id === parseInt(selectedDangUyId))
    //           ?.tenchibo || ""
    //       : dangBoList.find((db) => db.id === parseInt(selectedDangBoId))
    //           ?.tenchibo || "",
    //   diachi: "",
    //   bithu: "",
    //   phobithu: "",
    //   ngaythanhlap: "",
    //   ghichu: "",
    //   trangthai: "",
    //   loai:
    //     selectedDangUyId === "alldanguy"
    //       ? "danguy"
    //       : selectedDangBoId === "" || selectedDangBoId === "alldangbo"
    //       ? "dangbo"
    //       : "chibo",
    //   danguyCaptrenId: 0,
    // });
    // setValidationErrors({});
    // setShowAddModal(true);
    let danguycaptren = "";
    if (selectedDangUyId !== "alldanguy") {
      if (selectedDangBoId === "" || selectedDangBoId === "alldangbo") {
        // Thêm Đảng bộ - lấy tên Đảng ủy cấp trên
        danguycaptren =
          dangUyList.find((du) => du.id === parseInt(selectedDangUyId))
            ?.tenchibo || "";
      } else {
        // Thêm Chi bộ - lấy tên Đảng bộ cấp trên
        danguycaptren =
          dangBoList.find((db) => db.id === parseInt(selectedDangBoId))
            ?.tenchibo || "";
      }
    }

    setFormData({
      tenchibo: "",
      danguycaptren: danguycaptren,
      diachi: "",
      bithu: "",
      phobithu: "",
      ngaythanhlap: "",
      ghichu: "",
      trangthai: "",
      loai:
        selectedDangUyId === "alldanguy"
          ? "danguy"
          : selectedDangBoId === "" || selectedDangBoId === "alldangbo"
          ? "dangbo"
          : "chibo",
      danguyCaptrenId: 0,
    });
    setValidationErrors({});
    setShowAddModal(true);
  };

  // Open edit modal with selected item data
  const openEditModal = (item) => {
    setSelectedItem(item);
    // setFormData({
    //   tenchibo: item.tenchibo,
    //   danguycaptren: item.danguycaptren,
    //   diachi: item.diachi,
    //   bithu: item.bithu,
    //   phobithu: item.phobithu,
    //   ngaythanhlap: item.ngaythanhlap,
    //   ghichu: item.ghichu,
    //   trangthai: item.trangthai,
    //   loai: item.loai,
    //   danguyCaptrenId: item.danguyCaptrenId,
    // });
    // Xác định tên Đảng ủy/Đảng bộ cấp trên từ ID
    let danguycaptren = "";
    if (item.loai === "dangbo") {
      const dangUy = dangUyList.find((du) => du.id === item.danguyCaptrenId);
      danguycaptren = dangUy?.tenchibo || "";
    } else if (item.loai === "chibo") {
      const dangBo = dangBoList.find((db) => db.id === item.danguyCaptrenId);
      danguycaptren = dangBo?.tenchibo || "";
    }

    setFormData({
      ...item,
      danguycaptren: danguycaptren,
    });
    setShowEditModal(true);
    setValidationErrors({});
    // setShowEditModal(true);
  };

  // Open XepLoai modal
  const openXepLoaiModal = (item) => {
    setSelectedItem(item);
    setXepLoaiForm({ nam: "", xeploai: "" });
    setEditXepLoaiId(null);
    loadXepLoai(item.id);
    setShowXepLoaiModal(true);
  };

  const openDangVienModal = (item) => {
    setSelectedItem(item);
    loadDangVienByChiBoId(item.id);
    setShowDangVienModal(true);
  };

  // Open detail modal and load XepLoai
  const openDetailModal = (item) => {
    setSelectedItem(item);
    if (selectedDangBoId && selectedDangBoId !== "alldangbo") {
      loadXepLoai(item.id);
    }
    setShowDetailModal(true);
  };

  const renderDangUyForm = () => (
    <Form>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Tên Đảng Ủy <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="tenchibo"
              value={formData.tenchibo}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.tenchibo}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.tenchibo}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Họ và tên bí thư Đảng Ủy <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="bithu"
              value={formData.bithu}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.bithu}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.bithu}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Họ và tên phó bí thư Đảng Ủy</Form.Label>
            <Form.Control
              type="text"
              name="phobithu"
              value={formData.phobithu}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.phobithu}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.phobithu}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="diachi"
              value={formData.diachi}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.diachi}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.diachi}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Ngày thành lập Đảng Ủy <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="ngaythanhlap"
              value={formData.ngaythanhlap}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.ngaythanhlap}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.ngaythanhlap}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Trạng thái hoạt động <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="trangthai"
              value={formData.trangthai}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.trangthai}
            >
              <option value="">Chọn trạng thái</option>
              <option value="hoatdong">Hoạt động</option>
              <option value="giaithe">Giải thể</option>
              <option value="tamdung">Tạm dừng</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.trangthai}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Loại</Form.Label>
        <Form.Control
          type="text"
          name="loai"
          value={
            formData.loai === "danguy"
              ? "Đảng ủy"
              : formData.loai === "dangbo"
              ? "Đảng bộ"
              : "Chi bộ"
          }
          readOnly
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ghi chú</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="ghichu"
          value={formData.ghichu}
          onChange={handleInputChange}
          isInvalid={!!validationErrors.ghichu}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.ghichu}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );

  const renderDangBoForm = () => (
    <Form>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Tên Đảng bộ <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="tenchibo"
              value={formData.tenchibo}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.tenchibo}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.tenchibo}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        {selectedDangUyId !== "alldanguy" && (
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                Đảng ủy cấp trên <span className="text-danger">*</span>
              </Form.Label>
              {showAddModal ? (
                <Form.Control
                  type="text"
                  name="danguycaptren"
                  value={formData.danguycaptren}
                  readOnly
                />
              ) : (
                <Form.Select
                  name="danguycaptren"
                  value={formData.danguycaptren}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.danguycaptren}
                >
                  <option value="">Chọn Đảng Ủy</option>
                  {dangUyList.map((du) => (
                    <option key={du.id} value={du.tenchibo}>
                      {du.tenchibo}
                    </option>
                  ))}
                </Form.Select>
              )}
              <Form.Control.Feedback type="invalid">
                {validationErrors.danguycaptren}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        )}
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Họ và tên bí thư Đảng bộ <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="bithu"
              value={formData.bithu}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.bithu}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.bithu}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Họ và tên phó bí thư Đảng bộ</Form.Label>
            <Form.Control
              type="text"
              name="phobithu"
              value={formData.phobithu}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.phobithu}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.phobithu}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="diachi"
              value={formData.diachi}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.diachi}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.diachi}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Ngày thành lập <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="ngaythanhlap"
              value={formData.ngaythanhlap}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.ngaythanhlap}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.ngaythanhlap}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Trạng thái hoạt động <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="trangthai"
              value={formData.trangthai}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.trangthai}
            >
              <option value="">Chọn trạng thái</option>
              <option value="hoatdong">Hoạt động</option>
              <option value="giaithe">Giải thể</option>
              <option value="tamdung">Tạm dừng</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.trangthai}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Loại</Form.Label>
            <Form.Control
              type="text"
              name="loai"
              value={
                formData.loai === "danguy"
                  ? "Đảng ủy"
                  : formData.loai === "dangbo"
                  ? "Đảng bộ"
                  : "Chi bộ"
              }
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Ghi chú</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="ghichu"
          value={formData.ghichu}
          onChange={handleInputChange}
          isInvalid={!!validationErrors.ghichu}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.ghichu}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );

  const renderChiBoForm = () => (
    <Form>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Tên Chi bộ <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="tenchibo"
              value={formData.tenchibo}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.tenchibo}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.tenchibo}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        {selectedDangUyId !== "alldanguy" && (
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                Đảng bộ cấp trên <span className="text-danger">*</span>
              </Form.Label>
              {showAddModal ? (
                <Form.Control
                  type="text"
                  name="danguycaptren"
                  value={formData.danguycaptren}
                  readOnly
                />
              ) : (
                <Form.Select
                  name="danguycaptren"
                  value={formData.danguycaptren}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.danguycaptren}
                >
                  <option value="">Chọn Đảng bộ</option>
                  {dangBoList.map((db) => (
                    <option key={db.id} value={db.tenchibo}>
                      {db.tenchibo}
                    </option>
                  ))}
                </Form.Select>
              )}
              <Form.Control.Feedback type="invalid">
                {validationErrors.danguycaptren}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        )}
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Họ và tên bí thư Chi bộ <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="bithu"
              value={formData.bithu}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.bithu}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.bithu}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Họ và tên phó bí thư Chi bộ</Form.Label>
            <Form.Control
              type="text"
              name="phobithu"
              value={formData.phobithu}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.phobithu}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.phobithu}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="diachi"
              value={formData.diachi}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.diachi}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.diachi}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Ngày thành lập <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="ngaythanhlap"
              value={formData.ngaythanhlap}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.ngaythanhlap}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.ngaythanhlap}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Trạng thái hoạt động <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="trangthai"
              value={formData.trangthai}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.trangthai}
            >
              <option value="">Chọn trạng thái</option>
              <option value="hoatdong">Hoạt động</option>
              <option value="giaithe">Giải thể</option>
              <option value="tamdung">Tạm dừng</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.trangthai}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Loại</Form.Label>
            <Form.Control
              type="text"
              name="loai"
              value={
                formData.loai === "danguy"
                  ? "Đảng ủy"
                  : formData.loai === "dangbo"
                  ? "Đảng bộ"
                  : "Chi bộ"
              }
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Ghi chú</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="ghichu"
          value={formData.ghichu}
          onChange={handleInputChange}
          isInvalid={!!validationErrors.ghichu}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.ghichu}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );

  const renderForm = () => {
    if (showAddModal) {
      if (selectedDangUyId === "alldanguy") return renderDangUyForm();
      if (selectedDangBoId === "" || selectedDangBoId === "alldangbo")
        return renderDangBoForm();
      return renderChiBoForm();
    } else {
      // Trường hợp edit
      if (selectedItem?.loai === "danguy") return renderDangUyForm();
      if (selectedItem?.loai === "dangbo") return renderDangBoForm();
      return renderChiBoForm();
    }
  };

  // Render table headers based on current view
  const renderTableHeaders = () => {
    if (selectedDangUyId === "alldanguy") {
      return (
        <tr>
          <th style={{ width: "5%" }}>STT</th>
          <th style={{ width: "30%" }}>Tên Đảng ủy</th>
          <th style={{ width: "30%" }}>Địa chỉ</th>
          <th style={{ width: "20%" }}>Trạng thái</th>
          <th style={{ width: "15%" }}>Thao tác</th>
        </tr>
      );
    } else if (selectedDangBoId === "" || selectedDangBoId === "alldangbo") {
      return (
        <tr>
          <th style={{ width: "5%" }}>STT</th>
          <th style={{ width: "30%" }}>Tên Đảng bộ</th>
          <th style={{ width: "30%" }}>Đảng ủy cấp trên</th>
          <th style={{ width: "20%" }}>Trạng thái</th>
          <th style={{ width: "15%" }}>Thao tác</th>
        </tr>
      );
    } else {
      return (
        <tr>
          <th style={{ width: "5%" }}>STT</th>
          <th style={{ width: "25%" }}>Tên Chi bộ</th>
          <th style={{ width: "25%" }}>Đảng bộ cấp trên</th>
          <th style={{ width: "20%" }}>Bí thư</th>
          <th style={{ width: "15%" }}>Trạng thái</th>
          <th style={{ width: "15%" }}>Thao tác</th>
        </tr>
      );
    }
  };

  // Render table rows based on current view
  const renderTableRows = () => {
    return currentItems.map((item, index) => {
      if (selectedDangUyId === "alldanguy") {
        return (
          <tr key={index}>
            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td>{item.tenchibo}</td>
            <td>{item.diachi}</td>
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
              </div>
            </td>
          </tr>
        );
      } else if (selectedDangBoId === "" || selectedDangBoId === "alldangbo") {
        return (
          <tr key={index}>
            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td>{item.tenchibo}</td>
            <td>{item.danguycaptren}</td>
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
              </div>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={index}>
            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td>{item.tenchibo}</td>
            <td>{item.danguycaptren}</td>
            <td>{item.bithu}</td>
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
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => openDangVienModal(item)}
                  title="Danh sách Đảng viên"
                >
                  <i className="fa-solid fa-user-tie"></i>
                </button>
              </div>
            </td>
          </tr>
        );
      }
    });
  };

  // Sửa lại phần render table
  const renderTableContent = () => {
    // const dataToDisplay = getDataToDisplay();
    const dataToDisplay =
      selectedChiBoId !== "allchibo" && selectedChiBoId
        ? chiBoList.filter((cb) => cb.id === parseInt(selectedChiBoId))
        : getDataToDisplay();

    if (loading) {
      return (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    if (dataToDisplay.length === 0) {
      let message = "";
      if (selectedDangUyId === "alldanguy" && dangUyList.length === 0) {
        message = "Không có Đảng ủy nào";
      } else if (selectedDangBoId === "" || selectedDangBoId === "alldangbo") {
        message = "Không có Đảng bộ nào trực thuộc Đảng ủy này";
      } else {
        message = "Không có Chi bộ nào trực thuộc Đảng bộ này";
      }

      return (
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle me-2"></i>
          {message}
        </div>
      );
    }

    return (
      <div className="table-responsive mb-4">
        <table className="table table-hover">
          <thead className="table-light">{renderTableHeaders()}</thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </div>
    );
  };

  // Thêm hàm kiểm tra có nên hiển thị phân trang không
  const shouldShowPagination = () => {
    const data = getDataToDisplay();
    return data.length > itemsPerPage;
  };

  // Sửa lại phần render phân trang
  const renderPagination = () => {
    if (!shouldShowPagination()) {
      return null;
    }

    return (
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
    );
  };

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-3 mb-md-0"></h1>
          {/* <h1 className="h3 mb-3 mb-md-0">Danh sách cơ sở Đảng</h1> */}
          <div className="d-flex gap-2 align-items-center">
            {/* Đảng ủy - luôn hiển thị */}
            <Form.Select
              value={selectedDangUyId}
              onChange={handleDangUyChange}
              style={{ width: "200px" }}
            >
              <option value="alldanguy">Tất cả Đảng ủy</option>
              {dangUyList.map((du) => (
                <option key={du.id} value={du.id}>
                  {du.tenchibo.length > 40
                    ? `${du.tenchibo.substring(0, 40)}...`
                    : du.tenchibo}
                  {/* {du.tenchibo} */}
                </option>
              ))}
            </Form.Select>

            {/* Đảng bộ - chỉ hiển thị nếu chọn Đảng ủy cụ thể */}
            {selectedDangUyId && selectedDangUyId !== "alldanguy" && (
              <Form.Select
                value={selectedDangBoId}
                onChange={handleDangBoChange}
                style={{ width: "200px" }}
              >
                <option value="alldangbo">Tất cả Đảng bộ</option>
                {dangBoList.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.tenchibo.length > 100
                      ? `${db.tenchibo.substring(0, 100)}...`
                      : db.tenchibo}
                    {/* {db.tenchibo} */}
                  </option>
                ))}
              </Form.Select>
            )}

            {/* Chi bộ - chỉ hiển thị nếu chọn Đảng bộ cụ thể */}
            {selectedDangBoId && selectedDangBoId !== "alldangbo" && (
              <Form.Select
                value={selectedChiBoId}
                onChange={handleChiBoChange}
                style={{ width: "200px" }}
              >
                <option value="allchibo">Tất cả Chi bộ</option>
                {chiBoList.map((cb) => (
                  <option key={cb.id} value={cb.id}>
                    {cb.tenchibo}
                  </option>
                ))}
              </Form.Select>
            )}

            {/* Nút thêm mới */}
            <button
              className="btn btn-success custom-sm-btn-dangvien"
              onClick={openAddModal}
            >
              <i className="fas fa-plus me-2"></i>Thêm mới
            </button>
          </div>
        </div>
        {renderTableContent()}
      </div>

      {renderPagination()}

      {/* Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Chi tiết{" "}
            {selectedItem?.loai === "danguy"
              ? "Đảng ủy"
              : selectedItem?.loai === "dangbo"
              ? "Đảng bộ"
              : "Chi bộ"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <Tabs defaultActiveKey="info" className="mb-3">
              {/* Tab Thông tin */}
              <Tab
                eventKey="info"
                title={`Thông tin ${
                  selectedItem.loai === "danguy"
                    ? "Đảng ủy"
                    : selectedItem.loai === "dangbo"
                    ? "Đảng bộ"
                    : "Chi bộ"
                }`}
              >
                <div className="p-3">
                  <dl className="row">
                    <dt className="col-sm-4">
                      Tên{" "}
                      {selectedItem.loai === "danguy"
                        ? "Đảng ủy"
                        : selectedItem.loai === "dangbo"
                        ? "Đảng bộ"
                        : "Chi bộ"}
                    </dt>
                    <dd className="col-sm-8">{selectedItem.tenchibo}</dd>

                    {selectedItem.loai !== "danguy" && (
                      <>
                        <dt className="col-sm-4">
                          {selectedItem.loai === "dangbo"
                            ? "Đảng ủy cấp trên"
                            : "Đảng bộ cấp trên"}
                        </dt>
                        <dd className="col-sm-8">
                          {selectedItem.danguycaptren}
                        </dd>
                      </>
                    )}

                    <dt className="col-sm-4">Họ và tên bí thư</dt>
                    <dd className="col-sm-8">{selectedItem.bithu}</dd>

                    <dt className="col-sm-4">Họ và tên phó bí thư</dt>
                    <dd className="col-sm-8">
                      {selectedItem.phobithu || "Không có"}
                    </dd>

                    <dt className="col-sm-4">Địa chỉ</dt>
                    <dd className="col-sm-8">{selectedItem.diachi}</dd>

                    <dt className="col-sm-4">Ngày thành lập</dt>
                    <dd className="col-sm-8">{selectedItem.ngaythanhlap}</dd>

                    <dt className="col-sm-4">Trạng thái hoạt động</dt>
                    <dd className="col-sm-8">
                      {selectedItem.trangthai === "hoatdong" ? (
                        <span className="badge bg-success">Hoạt động</span>
                      ) : selectedItem.trangthai === "giaithe" ? (
                        <span className="badge bg-warning text-dark">
                          Giải thể
                        </span>
                      ) : (
                        <span className="badge bg-danger">Tạm dừng</span>
                      )}
                    </dd>

                    <dt className="col-sm-4">Ghi chú</dt>
                    <dd className="col-sm-8">
                      {selectedItem.ghichu || "Không có"}
                    </dd>
                  </dl>
                </div>
              </Tab>

              {/* Tab Xếp loại - chỉ hiển thị cho Chi bộ */}
              {selectedItem.loai === "chibo" && (
                <Tab eventKey="classification" title="Xếp loại chi bộ">
                  <div className="p-3">
                    {xepLoaiList.length === 0 ? (
                      <div className="text-muted">
                        Chi bộ chưa được xếp loại
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Năm</th>
                              <th>Xếp loại</th>
                            </tr>
                          </thead>
                          <tbody>
                            {xepLoaiList.map((item) => (
                              <tr key={item.id}>
                                <td>{item.nam}</td>
                                <td>
                                  {item.xeploai === "xuatsac"
                                    ? "Hoàn thành xuất sắc nhiệm vụ"
                                    : item.xeploai === "tot"
                                    ? "Hoàn thành tốt nhiệm vụ"
                                    : item.xeploai === "hoanthanh"
                                    ? "Hoàn thành nhiệm vụ"
                                    : "Không hoàn thành nhiệm vụ"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </Tab>
              )}
            </Tabs>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Modal */}
      <Modal
        show={showAddModal || showEditModal}
        onHide={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {showAddModal
              ? `Thêm ${
                  selectedDangUyId === "alldanguy"
                    ? "Đảng ủy"
                    : selectedDangBoId === "" ||
                      selectedDangBoId === "alldangbo"
                    ? "Đảng bộ"
                    : "Chi bộ"
                }`
              : `Cập nhật ${
                  selectedItem?.loai === "danguy"
                    ? "Đảng ủy"
                    : selectedItem?.loai === "dangbo"
                    ? "Đảng bộ"
                    : "Chi bộ"
                }`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderForm()}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
            }}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={showAddModal ? handleAddItem : handleUpdateItem}
          >
            {showAddModal ? "Thêm mới" : "Cập nhật"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* XepLoai Modal */}
      <Modal
        show={showXepLoaiModal}
        onHide={() => setShowXepLoaiModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xếp loại chi bộ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Năm</Form.Label>
                  <Form.Control
                    type="text"
                    name="nam"
                    value={xepLoaiForm.nam}
                    onChange={handleXepLoaiInputChange}
                    isInvalid={!!validationErrors.nam}
                    disabled={editXepLoaiId !== null}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.nam}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Hình thức xếp loại</Form.Label>
                  <Form.Select
                    name="xeploai"
                    value={xepLoaiForm.xeploai}
                    onChange={handleXepLoaiInputChange}
                    isInvalid={!!validationErrors.xeploai}
                  >
                    <option value="">Chọn xếp loại</option>
                    <option value="xuatsac">
                      Hoàn thành xuất sắc nhiệm vụ
                    </option>
                    <option value="tot">Hoàn thành tốt nhiệm vụ</option>
                    <option value="hoanthanh">Hoàn thành nhiệm vụ</option>
                    <option value="khonghoanthanh">
                      Không hoàn thành nhiệm vụ
                    </option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.xeploai}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Button
            variant="primary"
            onClick={editXepLoaiId ? handleUpdateXepLoai : handleCreateXepLoai}
            disabled={loading}
            className="mb-3"
          >
            {loading
              ? "Đang xử lý..."
              : editXepLoaiId
              ? "Cập nhật xếp loại"
              : "Xếp loại chi bộ"}
          </Button>
          {xepLoaiList.length === 0 ? (
            <div className="text-muted">Chi bộ chưa được xếp loại</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Năm</th>
                    <th>Xếp loại</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {xepLoaiList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nam}</td>
                      <td>
                        {item.xeploai === "xuatsac"
                          ? "Hoàn thành xuất sắc nhiệm vụ"
                          : item.xeploai === "tot"
                          ? "Hoàn thành tốt nhiệm vụ"
                          : item.xeploai === "hoanthanh"
                          ? "Hoàn thành nhiệm vụ"
                          : "Không hoàn thành nhiệm vụ"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => {
                            setEditXepLoaiId(item.id);
                            setXepLoaiForm({
                              nam: item.nam,
                              xeploai: item.xeploai,
                            });
                          }}
                          title="Chỉnh sửa xếp loại"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowXepLoaiModal(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* DangVien Modal */}
      <Modal
        show={showDangVienModal}
        onHide={() => setShowDangVienModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Danh sách Đảng viên thuộc chi bộ <strong>{selectedItem?.tenchibo || ""}</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dangVienList.length === 0 ? (
            <div className="alert alert-info">
              Không có Đảng viên nào thuộc chi bộ này
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ tên</th>
                    <th>Ngày sinh</th>
                    <th>Giới tính</th>
                    <th>Quê quán</th>
                    <th>Ngày vào Đảng</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {dangVienList.map((dangVien, index) => (
                    <tr key={dangVien.id}>
                      <td>{index + 1}</td>
                      <td>{dangVien.hoten}</td>
                      <td>
                        {new Date(dangVien.ngaysinh).toLocaleDateString()}
                      </td>
                      <td>{dangVien.gioitinh}</td>
                      <td>{dangVien.quequan}</td>
                      <td>
                        {new Date(dangVien.ngayvaodang).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            dangVien.trangthaidangvien === "chinhthuc"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {dangVien.trangthaidangvien === "chinhthuc"
                            ? "Chính thức"
                            : "Dự bị"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDangVienModal(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoSoDang;
