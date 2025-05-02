import React, {useState, useEffect }from "react";
import { Modal, Button, Tab, Tabs, Alert } from "react-bootstrap";
import TheDangTabContent from "../TheDangComponent/TheDangTabContent";
import QuyetDinhTabContent from "../QuyetDinhComponent/QuyetDinhTabContent";
import { fetchTheDang, fetchQuyetDinhByDangVien, downloadFile } from "../../services/apiService";
import Swal from "sweetalert2";

const DangVienDetailModal = ({ show, onHide, selectedDangVien, token }) => {
  const [theDangData, setTheDangData] = useState(null);
  const [quyetDinhList, setQuyetDinhList] = useState([]);
  const [loadingTheDang, setLoadingTheDang] = useState(false);
  const [loadingQuyetDinh, setLoadingQuyetDinh] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && selectedDangVien) {
      loadTheDang();
      loadQuyetDinh();
    }
  }, [show, selectedDangVien]);

  const loadTheDang = async () => {
    setLoadingTheDang(true);
    try {
      const data = await fetchTheDang(token, selectedDangVien.id);
      if (data.resultCode === 0) {
        setTheDangData(data.data);
      } else {
        setTheDangData(null);
      }
    } catch (err) {
      setError("Không thể tải thông tin thẻ Đảng");
    } finally {
      setLoadingTheDang(false);
    }
  };

  const handleDownloadFile = async (filename) => {
      try {
        // Get the file blob from API
        const response = await downloadFile(token, filename);
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        
        // Try to get the original filename from headers
        const contentDisposition = response.headers['content-disposition'];
        let downloadFilename = filename;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (filenameMatch && filenameMatch[1]) {
            downloadFilename = filenameMatch[1];
          }
        }
        
        link.setAttribute('download', downloadFilename);
        document.body.appendChild(link);
        link.click();
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Tải file thành công!',
          confirmButtonText: 'Đóng'
        });
        // Clean up
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
        
      } catch (error) {
        console.error("Download failed:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.response?.data?.message || 'Tải file thất bại',
          confirmButtonText: 'Đóng'
        });
      } finally {
      }
    };

  const loadQuyetDinh = async () => {
    setLoadingQuyetDinh(true);
    try {
      const data = await fetchQuyetDinhByDangVien(token, selectedDangVien.id);
      if (data.resultCode === 0) {
        setQuyetDinhList(Array.isArray(data.data) ? data.data : []);
      } else {
        setQuyetDinhList([]);
      }
    } catch (err) {
      setError("Không thể tải danh sách quyết định");
    } finally {
      setLoadingQuyetDinh(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết Đảng viên</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {selectedDangVien && (
          <Tabs defaultActiveKey="personal" className="mb-3">
            <Tab eventKey="personal" title="Thông tin cá nhân">
              <div className="p-3">
                <dl className="row">
                  <dt className="col-sm-4">Họ và tên</dt>
                  <dd className="col-sm-8">{selectedDangVien.hoten}</dd>
                  <dt className="col-sm-4">Ngày sinh</dt>
                  <dd className="col-sm-8">
                    {new Date(selectedDangVien.ngaysinh).toLocaleDateString()}
                  </dd>
                  <dt className="col-sm-4">Giới tính</dt>
                  <dd className="col-sm-8">{selectedDangVien.gioitinh}</dd>
                  <dt className="col-sm-4">Quê quán</dt>
                  <dd className="col-sm-8">{selectedDangVien.quequan}</dd>
                  <dt className="col-sm-4">Dân tộc</dt>
                  <dd className="col-sm-8">{selectedDangVien.dantoc}</dd>
                  <dt className="col-sm-4">Trình độ văn hóa</dt>
                  <dd className="col-sm-8">{selectedDangVien.trinhdovanhoa}</dd>
                  <dt className="col-sm-4">Nơi ở hiện nay</dt>
                  <dd className="col-sm-8">{selectedDangVien.noihiennay}</dd>
                  <dt className="col-sm-4">Chuyên môn</dt>
                  <dd className="col-sm-8">{selectedDangVien.chuyennmon}</dd>
                  <dt className="col-sm-4">Trình độ ngoại ngữ</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.trinhdongoaingu}
                  </dd>
                  <dt className="col-sm-4">Trình độ chính trị</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.trinhdochinhtri}
                  </dd>
                </dl>
              </div>
            </Tab>
            <Tab eventKey="party" title="Thông tin Đảng">
              <div className="p-3">
                <dl className="row">
                  <dt className="col-sm-4">Chi bộ</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.chibo?.tenchibo || "Không xác định"}
                  </dd>
                  <dt className="col-sm-4">Ngày vào Đảng</dt>
                  <dd className="col-sm-8">
                    {new Date(
                      selectedDangVien.ngayvaodang
                    ).toLocaleDateString()}
                  </dd>
                  <dt className="col-sm-4">Ngày chính thức</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.ngaychinhthuc
                      ? new Date(
                          selectedDangVien.ngaychinhthuc
                        ).toLocaleDateString()
                      : "Chưa chính thức"}
                  </dd>
                  <dt className="col-sm-4">Người giới thiệu 1</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.nguoigioithieu1}
                  </dd>
                  <dt className="col-sm-4">Người giới thiệu 2</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.nguoigioithieu2}
                  </dd>
                  <dt className="col-sm-4">Nơi sinh hoạt Đảng</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.noisinhhoatdang}
                  </dd>
                  <dt className="col-sm-4">Trạng thái</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.trangthaidangvien === "chinhthuc"
                      ? "Chính thức"
                      : selectedDangVien.trangthaidangvien === "dubi"
                      ? "Dự bị"
                      : selectedDangVien.trangthaidangvien === "khaitru"
                      ? "Khai trừ"
                      : "Không xác định"}
                  </dd>
                </dl>
              </div>
            </Tab>
            <Tab eventKey="position" title="Chức vụ">
              <div className="p-3">
                <dl className="row">
                  <dt className="col-sm-4">Chức vụ chính quyền</dt>
                  <dd className="col-sm-8">
                    {selectedDangVien.chucvuchinhquyen}
                  </dd>
                  <dt className="col-sm-4">Chức vụ chi bộ</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvuchibo}</dd>
                  <dt className="col-sm-4">Chức vụ Đảng ủy</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvudanguy}</dd>
                  <dt className="col-sm-4">Chức vụ đoàn thể</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucvudoanthe}</dd>
                  <dt className="col-sm-4">Chức danh</dt>
                  <dd className="col-sm-8">{selectedDangVien.chucdanh}</dd>
                </dl>
              </div>
            </Tab>
            <Tab eventKey="theDang" title="Thẻ Đảng">
              <TheDangTabContent
                theDangData={theDangData}
                selectedDangVien={selectedDangVien}
                loading={loadingTheDang}
              />
            </Tab>

            {/* Tab Quyết định (read-only) */}
            <Tab eventKey="quyetDinh" title="Quyết định">
              <QuyetDinhTabContent
                quyetDinhList={quyetDinhList}
                onDownload={handleDownloadFile}
                loading={loadingQuyetDinh}
              />
            </Tab>
          </Tabs>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DangVienDetailModal;
