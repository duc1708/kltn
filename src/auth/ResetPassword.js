import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { Alert, AlertTitle } from '@mui/material';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleResetPassword = async () => {
    // Kiểm tra mật khẩu và xác nhận
    if (password !== confirmPassword) {
      setShowError(true);
      setTimeout(() => setShowError(false), 4000); 
      return;
    }

    try {
      const email = localStorage.getItem('gmail'); 
      const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/resetPassword`, {
        email,
        newPassword: password,
      });

      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          
        }, 4000);
        setTimeout(()=>{
          window.location.href = '/'; 
        }, 5000)
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 4000); // 
    }
  };

  return (
    <div
      className="register-page content"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div
        className="register-account"
        style={{
          textAlign: 'center',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h3>ĐẶT LẠI MẬT KHẨU</h3>
        {showSuccess && (
          <Alert severity="Success">
            <AlertTitle>Success</AlertTitle>
              Cập nhật mật khẩu mới thành công. Vui lòng đăng nhập lại.
          </Alert>
        )}

        {showError &&(
          <Alert severity="Error">
            <AlertTitle>Success</AlertTitle>
              Xác nhận mật khẩu không thành công! Vui lòng xác nhận mật khẩu mới.
          </Alert>
        )}
        <Form>
          <Form.Group className="mb-3" controlId="formNewPassword">
            <Form.Label style={{ fontSize: '15px', marginTop: '10px' }}>
              Nhập mật khẩu mới
            </Form.Label>
            <Form.Control
              style={{ width: '100%' }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label style={{ fontSize: '15px', marginTop: '10px' }}>
              Xác nhận mật khẩu mới
            </Form.Label>
            <Form.Control
              style={{ width: '100%' }}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <button type="button" id="register" onClick={handleResetPassword}>
            ĐẶT LẠI
          </button>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
