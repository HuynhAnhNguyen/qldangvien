import React from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

const BackupComponent = ({ loading, onBackup }) => {
  const handleBackup = async () => {
    const result = await Swal.fire({
      title: "Xác nhận sao lưu?",
      text: "Bạn có muốn sao lưu dữ liệu không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sao lưu",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      onBackup();
    }
  };

  return (
    <Button
      variant="success"
      size="lg"
      onClick={handleBackup}
      disabled={loading}
      className="w-100"
    >
      <i className="fas fa-download me-2"></i> Sao lưu dữ liệu
    </Button>
  );
};

export default BackupComponent;