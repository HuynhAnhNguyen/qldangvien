import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const TaiKhoanChangeRoleModal = ({
  show,
  onHide,
  selectedAccount,
  changeRoleData,
  setChangeRoleData,
  roles,
  handleChangeRole,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          Thay đổi vai trò cho {selectedAccount?.username}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Vai trò hiện tại</Form.Label>
            <Form.Control
              type="text"
              value={selectedAccount?.roleName || "Chưa có"}
              disabled
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>
              Vai trò mới <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={changeRoleData.roleName}
              onChange={(e) => setChangeRoleData({ roleName: e.target.value })}
            >
              <option value="">Chọn vai trò</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleChangeRole} disabled={loading}>
          {loading ? "Đang xử lý..." : "Thay đổi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaiKhoanChangeRoleModal;