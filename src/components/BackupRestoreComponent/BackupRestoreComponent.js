import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { backupDatabase, restoreDatabase } from "../../services/apiService";
import BackupComponent from "./BackupComponent";
import RestoreComponent from "./RestoreComponent";
import RestoreModal from "./RestoreModal";

const BackupRestoreComponent = () => {
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const token = localStorage.getItem("token");

  const handleBackup = async () => {
    try {
      setLoading(true);
      const response = await backupDatabase(token);
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") ||
          "backup.sql"
        : "backup.sql";
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire("Thành công!", "Dữ liệu đã được sao lưu!", "success");
    } catch (error) {
      Swal.fire(
        "Lỗi!",
        error.response?.data?.message || "Không thể sao lưu dữ liệu",
        "error"
      );
      console.error("Error during backup:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".sql")) {
        setValidationError("Vui lòng chọn file có định dạng .sql");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setValidationError("");
      }
    } else {
      setSelectedFile(null);
      setValidationError("Vui lòng chọn một file");
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) {
      setValidationError("Vui lòng chọn một file để khôi phục");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await restoreDatabase(token, formData);
      if (response.resultCode === 0) {
        setShowRestoreModal(false);
        setSelectedFile(null);
        Swal.fire("Thành công!", "Khôi phục dữ liệu thành công!", "success");
      } else {
        throw new Error(response.data.message || "Khôi phục dữ liệu thất bại");
      }
    } catch (error) {
      Swal.fire(
        "Lỗi!",
        error.response?.data?.message || "Không thể khôi phục dữ liệu",
        "error"
      );
      console.error("Error during restore:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        <h1 className="h3 mb-4">Sao lưu và khôi phục dữ liệu</h1>

        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        <Row className="justify-content-center">
          <Col md={6} className="mb-3">
            <BackupComponent loading={loading} onBackup={handleBackup} />
          </Col>
          <Col md={6} className="mb-3">
            <RestoreComponent
              loading={loading}
              onOpenModal={() => setShowRestoreModal(true)}
            />
          </Col>
        </Row>

        <RestoreModal
          show={showRestoreModal}
          onHide={() => setShowRestoreModal(false)}
          selectedFile={selectedFile}
          loading={loading}
          validationError={validationError}
          onFileChange={handleFileChange}
          onRestore={handleRestore}
        />
      </div>
    </div>
  );
};

export default BackupRestoreComponent;
