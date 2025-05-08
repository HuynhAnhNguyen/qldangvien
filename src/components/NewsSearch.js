import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const NewsSearch = ({ searchTerm, onSearchChange, filterStatus, onFilterChange }) => {
  return (
    <div className="mb-4 p-3 bg-light rounded">
      <Row>
        <Col md={8}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Select
              value={filterStatus}
              onChange={(e) => onFilterChange(e.target.value)}
            >
              <option value="all">Tất cả tin tức</option>
              <option value="approved">Tin đã duyệt</option>
              <option value="pending">Tin chờ duyệt</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

export default NewsSearch;