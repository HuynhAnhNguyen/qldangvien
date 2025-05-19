import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DangVienForm from "./DangVienForm";

const DangVienAddModal = ({
  show,
  onHide,
  chiBoList,
  handleAddDangVien,
  loading,
}) => {
  const [formData, setFormData] = useState({
    hoten: "",
    ngaysinh: "",
    gioitinh: "",
    chiboId: "",
    quequan: "",
    dantoc: "",
    trinhdovanhoa: "",
    noihiennay: "",
    ngayvaodang: "",
    ngaychinhthuc: "",
    nguoigioithieu1: "",
    nguoigioithieu2: "",
    chucvuchinhquyen: "",
    chucvuchibo: "",
    chucvudanguy: "",
    chucvudoanthe: "",
    chucdanh: "",
    noisinhhoatdang: "",
    chuyennmon: "",
    trinhdongoaingu: "",
    trinhdochinhtri: "",
    trangthaidangvien: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thêm Đảng viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DangVienForm
          formData={formData}
          validationErrors={validationErrors}
          chiBoList={chiBoList}
          handleInputChange={handleInputChange}
          setFormData={setFormData}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={handleAddDangVien}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Thêm mới"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DangVienAddModal;