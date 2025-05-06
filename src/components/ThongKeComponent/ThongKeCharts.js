import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";

const ThongKeCharts = ({ stats }) => {
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
    <Row className="mb-4">
      <Col md={6}>
        <Card><Card.Body><Card.Title>Đảng viên theo Chi bộ</Card.Title><Bar data={dangVienChiBoData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} /></Card.Body></Card>
      </Col>
      <Col md={3}>
        <Card><Card.Body><Card.Title>Giới tính</Card.Title><Pie data={gioiTinhData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} /></Card.Body></Card>
      </Col>
      <Col md={3}>
        <Card><Card.Body><Card.Title>Tài khoản theo Vai trò</Card.Title><Pie data={taiKhoanRoleData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} /></Card.Body></Card>
      </Col>
    </Row>
  );
};

export default ThongKeCharts;
