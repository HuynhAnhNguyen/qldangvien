import { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

const DangVienForm = ({
  formData,
  validationErrors,
  chiBoList,
  handleInputChange,
  setFormData,
}) => {
  // Tự động điền "Nơi sinh hoạt Đảng" khi chọn Chi bộ
  useEffect(() => {
    if (formData.chiboId) {
      const selectedChiBo = chiBoList.find(chiBo => chiBo.id.toString() === formData.chiboId.toString());
      if (selectedChiBo) {
        setFormData(prev => ({
          ...prev,
          noisinhhoatdang: selectedChiBo.tenchibo
        }));
      }
    }
  }, [formData.chiboId, chiBoList, setFormData]);

  return (
    <Form>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Họ và tên Đảng viên <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="hoten"
              value={formData.hoten}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.hoten}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.hoten}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Ngày sinh <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="ngaysinh"
              value={formData.ngaysinh}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.ngaysinh}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.ngaysinh}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Giới tính <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="gioitinh"
              value={formData.gioitinh}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.gioitinh}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.gioitinh}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Chi bộ <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="chiboId"
              value={formData.chiboId}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.chiboId}
            >
              <option value="">Chọn chi bộ</option>
              {chiBoList.map((chiBo) => (
                <option key={chiBo.id} value={chiBo.id}>
                  {chiBo.tenchibo}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.chiboId}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Quê quán</Form.Label>
            <Form.Control
              type="text"
              name="quequan"
              value={formData.quequan}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.quequan}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.quequan}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Dân tộc</Form.Label>
            <Form.Control
              type="text"
              name="dantoc"
              value={formData.dantoc}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.dantoc}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.dantoc}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Trình độ văn hóa</Form.Label>
            <Form.Control
              type="text"
              name="trinhdovanhoa"
              value={formData.trinhdovanhoa}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.trinhdovanhoa}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.trinhdovanhoa}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Nơi ở hiện nay</Form.Label>
            <Form.Control
              type="text"
              name="noihiennay"
              value={formData.noihiennay}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.noihiennay}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.noihiennay}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Ngày vào Đảng <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="ngayvaodang"
              value={formData.ngayvaodang}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.ngayvaodang}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.ngayvaodang}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Ngày chính thức</Form.Label>
            <Form.Control
              type="date"
              name="ngaychinhthuc"
              value={formData.ngaychinhthuc}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.ngaychinhthuc}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.ngaychinhthuc}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Người giới thiệu 1</Form.Label>
            <Form.Control
              type="text"
              name="nguoigioithieu1"
              value={formData.nguoigioithieu1}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Người giới thiệu 2</Form.Label>
            <Form.Control
              type="text"
              name="nguoigioithieu2"
              value={formData.nguoigioithieu2}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Chức vụ chính quyền</Form.Label>
            <Form.Control
              type="text"
              name="chucvuchinhquyen"
              value={formData.chucvuchinhquyen}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Chức vụ chi bộ</Form.Label>
            <Form.Control
              type="text"
              name="chucvuchibo"
              value={formData.chucvuchibo}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Chức vụ Đảng ủy</Form.Label>
            <Form.Control
              type="text"
              name="chucvudanguy"
              value={formData.chucvudanguy}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Chức vụ đoàn thể</Form.Label>
            <Form.Control
              type="text"
              name="chucvudoanthe"
              value={formData.chucvudoanthe}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Chức danh của Đảng viên</Form.Label>
            <Form.Control
              type="text"
              name="chucdanh"
              value={formData.chucdanh}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Nơi sinh hoạt Đảng</Form.Label>
            <Form.Control
              type="text"
              name="noisinhhoatdang"
              value={formData.noisinhhoatdang || ""}
              onChange={handleInputChange}
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Trình độ chuyên môn</Form.Label>
            <Form.Control
              type="text"
              name="chuyennmon"
              value={formData.chuyennmon}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.chuyennmon}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.chuyennmon}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Trình độ ngoại ngữ</Form.Label>
            <Form.Control
              type="text"
              name="trinhdongoaingu"
              value={formData.trinhdongoaingu}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Trình độ chính trị</Form.Label>
            <Form.Control
              type="text"
              name="trinhdochinhtri"
              value={formData.trinhdochinhtri}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Trạng thái Đảng viên <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="trangthaidangvien"
              value={formData.trangthaidangvien}
              onChange={handleInputChange}
              isInvalid={!!validationErrors.trangthaidangvien}
            >
              <option value="">Chọn trạng thái</option>
              <option value="chinhthuc">Chính thức</option>
              <option value="dubi">Dự bị</option>
              <option value="khaitru">Khai trừ</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationErrors.trangthaidangvien}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default DangVienForm;
