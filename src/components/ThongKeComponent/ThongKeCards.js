import React from "react";
import { Card, Col, Row } from "react-bootstrap";

const ThongKeCards = ({ stats }) => (
  <Row className="mb-4">
    <Col md={3}>
      <Card><Card.Body><Card.Title>Tổng số Đảng viên</Card.Title><Card.Text className="h4">{stats.tongSoDangVien}</Card.Text></Card.Body></Card>
    </Col>
    <Col md={3}>
      <Card><Card.Body><Card.Title>Tổng số Chi bộ</Card.Title><Card.Text className="h4">{stats.tongSoChiBo}</Card.Text></Card.Body></Card>
    </Col>
    <Col md={3}>
      <Card><Card.Body><Card.Title>Tổng số Tin tức</Card.Title><Card.Text className="h4">{stats.tongSoTinTuc}</Card.Text></Card.Body></Card>
    </Col>
    <Col md={3}>
      <Card><Card.Body><Card.Title>Tổng số Tài khoản</Card.Title><Card.Text className="h4">{stats.tongSoTaiKhoan}</Card.Text></Card.Body></Card>
    </Col>
  </Row>
);

export default ThongKeCards;
