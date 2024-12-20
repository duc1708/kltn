import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Alert, AlertTitle } from '@mui/material';
import axios from 'axios';

function Register() {
  const [tenTk, setTenTk] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const[gmail, setGmail] = useState('');
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [showAlertDuplicate, setShowAlertDuplicate] = useState(false);
  useEffect(() => {
    // Load user data from localStorage
    setGmail(localStorage.getItem('gmail') || '');
  }, []); 
  const handleRegister = async () => {
    try {
      // Check if username exists
      const checkResponse = await axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}check-username?tenTk=${tenTk}`);
      if (checkResponse.data.exists) {
        setShowAlertDuplicate(true);
        setTimeout(() => setShowAlertDuplicate(false), 4000);
        return;
      }

      // Proceed with registration
      const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}register`, {
        tenTk,
        matKhau,
        gmail
      });
      if (response.status === 200) {
        setShowAlertSuccess(true);
        setTimeout(() => setShowAlertSuccess(false), 4000); // Hide alert after 2 seconds
      }
    } catch (error) {
      setShowAlertError(true);
      setTimeout(() => setShowAlertError(false), 4000); // Hide alert after 2 seconds
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
      {showAlertSuccess && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          You have successfully created an account
        </Alert>
      )}
      {showAlertError && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Failed to create an account
        </Alert>
      )}
      {showAlertDuplicate && (
        <Alert severity="warning">
          <AlertTitle>Warning</AlertTitle>
          Username already exists
        </Alert>
      )}
      <div className="register-account" style={{ textAlign: 'center', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3>ĐĂNG KÝ TÀI KHOẢN</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formTenTk">
            <Form.Label style={{ fontSize: '15px', marginTop: '10px' }}>Tên tài khoản</Form.Label>
            <Form.Control
              style={{ width: '100%' }}
              type="text"
              placeholder="tranminhduc"
              value={tenTk}
              onChange={(e) => setTenTk(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMatKhau">
            <Form.Label style={{ fontSize: '15px', marginTop: '10px' }}>Mật khẩu</Form.Label>
            <Form.Control
              style={{ width: '100%' }}
              type="password"
              placeholder=""
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <button type="button" id="register" onClick={handleRegister}>
            TẠO TÀI KHOẢN
          </button>
        </Form>
      </div>
    </div>
  );
}

export default Register;
