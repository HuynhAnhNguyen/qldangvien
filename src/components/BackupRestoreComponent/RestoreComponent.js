import React from "react";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

const RestoreComponent = ({ loading, onOpenModal }) => {
  const openRestoreModal = async () => {
    const result = await Swal.fire({
      title: "Xác nhận khôi phục?",
      text: "Bạn có muốn khôi phục dữ liệu không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Khôi phục",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      onOpenModal();
    }
  };

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={openRestoreModal}
      disabled={loading}
      className="w-100"
    >
      <i className="fas fa-upload me-2"></i> Khôi phục dữ liệu
    </Button>
  );
};

export default RestoreComponent;