import React from "react";
import { Alert, Spinner } from "react-bootstrap";

const TheDangTabContent = ({ 
    theDangData,
    selectedDangVien,
    loading 
  }) => {
    return (
      <div className="p-3">
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : theDangData ? (
          <div className="the-dang-card-container">
            <div className="creative-full-bg-card">
              <div className="title">Thẻ Đảng Viên</div>
              <div className="subtitle">Đảng Cộng sản Việt Nam</div>
              <div className="name-section">
                {selectedDangVien?.hoten?.toUpperCase() || "N/A"}
              </div>
              <div className="number-section">
                Số: {theDangData.mathe || "N/A"}
              </div>
              <div className="info-container">
                <div className="info-left">
                  <div>
                    Ngày cấp:{" "}
                    {theDangData.ngaycap
                      ? new Date(theDangData.ngaycap).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </div>
                  {selectedDangVien?.ngayvaodang && (
                    <div>
                      Ngày vào Đảng:{" "}
                      {new Date(
                        selectedDangVien.ngayvaodang
                      ).toLocaleDateString("vi-VN")}
                    </div>
                  )}
                </div>
                <div className="info-right">
                  <div>Nơi cấp: {theDangData.noicapthe || "N/A"}</div>
                  {selectedDangVien?.ngaychinhthuc && (
                    <div>
                      Ngày chính thức:{" "}
                      {new Date(
                        selectedDangVien.ngaychinhthuc
                      ).toLocaleDateString("vi-VN")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Alert variant="info">
              Đảng viên chưa có thẻ Đảng
            </Alert>
          </div>
        )}
      </div>
    );
  };
  
  export default TheDangTabContent;