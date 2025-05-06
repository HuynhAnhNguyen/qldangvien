import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, Spinner } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchThongKe } from "../services/apiService";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ThongKe = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    setLoading(true);
    try {
    const data= await fetchThongKe(token);
      if (data.resultCode === 0) {
        setStats(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center py-4 text-muted">Không có dữ liệu</div>;
  }

  // Chart data
  const dangVienChiBoData = {
    labels: Object.keys(stats.dangVienTheoChiBo),
    datasets: [
      {
        label: "Số Đảng viên",
        data: Object.values(stats.dangVienTheoChiBo),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const gioiTinhData = {
    labels: ["Nam", "Nữ"],
    datasets: [
      {
        data: [stats.soNam, stats.soNu],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const taiKhoanRoleData = {
    labels: Object.keys(stats.taiKhoanTheoRole),
    datasets: [
      {
        data: Object.values(stats.taiKhoanTheoRole),
        backgroundColor: ["#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="container-fluid p-0 position-relative d-flex flex-column min-vh-100">
      <div className="p-4 flex-grow-1">
        {/* Header + Button PDF */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-3 mb-md-0">Báo cáo thống kê</h1>
          
        </div>
  
        {/* Loading/Error */}
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
  
        {/* Tổng hợp số liệu */}
        <Row className="mb-4">
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Tổng số Đảng viên</Card.Title>
                <Card.Text className="h4">{stats.tongSoDangVien}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Tổng số Chi bộ</Card.Title>
                <Card.Text className="h4">{stats.tongSoChiBo}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Tổng số Tin tức</Card.Title>
                <Card.Text className="h4">{stats.tongSoTinTuc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Tổng số Tài khoản</Card.Title>
                <Card.Text className="h4">{stats.tongSoTaiKhoan}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
  
        {/* Biểu đồ */}
        <Row className="mb-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Đảng viên theo Chi bộ</Card.Title>
                <Bar
                  data={dangVienChiBoData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                    },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Giới tính</Card.Title>
                <Pie
                  data={gioiTinhData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                    },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Tài khoản theo Vai trò</Card.Title>
                <Pie
                  data={taiKhoanRoleData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                    },
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
  
};

export default ThongKe;