import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/cartshop.css';
import { ProgressBar } from 'react-bootstrap';
import {Row, Col} from 'react-bootstrap';
import { VscClose } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';

export default function Payment() {

    const [cartItems, setCartItems] = useState([]);
    const maKh = localStorage.getItem('maKh');
    const diaChi = localStorage.getItem('diaChi');
    const sdt = localStorage.getItem('sdt');
    const navigate = useNavigate();
    
    // Fetch data from API
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/cart-shop`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then(response => {
                setCartItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching cart data:', error);
            });
    }, []);

    const filteredItems = cartItems.filter(item => item.maKh === parseInt(maKh));
    const total = filteredItems.reduce((subtotal, item) => subtotal + (item.giaTien * item.soLuong), 0);

    // Handle quantity change
    const handleQuantityChange = async (productId, change) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === productId) {
                const newQuantity = item.soLuong + change;
                return { ...item, soLuong: newQuantity > 0 ? newQuantity : 1 }; // Ensure minimum quantity is 1
            }
            return item;
        });

        setCartItems(updatedItems);

        // Optional: Update the quantity in the backend
        try {
            await axios.put(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/cart-shop/${productId}`, {
                soLuong: updatedItems.find(item => item.id === productId).soLuong
            });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handlePaymentOfline = () => {
        const ngayDat = new Date().toISOString();
        const orders = filteredItems.map(item => ({
            maKh: maKh,
            maSP: item.maSP,
            tenSp: item.tenSp,
            anhDD: item.anhDD,
            soLuong: item.soLuong,
            giaTien: item.giaTien * item.soLuong,
            ngayDat,
            diaChi: diaChi,
            sdt: sdt,
        }));

        const thongke = filteredItems.map(item => ({
            maSP: item.maSP,
            tenSp: item.tenSp,
            soLuong: item.soLuong,
            ngayBan: ngayDat,
            tongTien: item.giaTien * item.soLuong
        }));
    
        axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/donhang_damua`, orders)
            .then(response => {
                console.log('Đã thêm đơn hàng:', response.data);
                // Xóa giỏ hàng cục bộ
                setCartItems([]);
                navigate('/order');
            })
            .catch(error => {
                console.error('Có lỗi khi thêm vào giỏ hàng:', error);
                alert(`Error: ${error.response ? error.response.data.message : error.message}`);
            });
        
        axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/thongkedoanhthu`, thongke)
            .then(response => {
            })
            .catch(error => {
                console.error('Có lỗi', error);
                alert(`Error: ${error.response ? error.response.data.message : error.message}`);
        });
    };

    const handlePaymentOnline = async () => {
        const ngayDat = new Date().toISOString();
        const extraData = filteredItems.map(item => ({
            maKh: maKh,
            maSP: item.maSP,
            tenSp: item.tenSp,
            anhDD: item.anhDD,
            soLuong: item.soLuong,
            giaTien: item.giaTien * item.soLuong,
            ngayDat,
            diaChi: diaChi,
            sdt: sdt,
        }));
    
        const thongke = filteredItems.map(item => ({
            maSP: item.maSP,
            tenSp: item.tenSp,
            soLuong: item.soLuong,
            ngayBan: ngayDat,
            tongTien: item.giaTien * item.soLuong,
        }));
    
        try {
            // Gửi yêu cầu thanh toán online
            const response = await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/payment`, { 
                amount: total,
                extraData: JSON.stringify(extraData), // Thêm thông tin đơn hàng vào extraData
            });
    
            // Điều hướng đến URL thanh toán
            window.location.href = response.data.payUrl;
    
            // Khi thanh toán thành công, post dữ liệu giống offline
            await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/donhang_damua`, extraData);
            console.log('Đã thêm đơn hàng:', extraData);
    
            await axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/thongkedoanhthu`, thongke);
            console.log('Đã thêm thông tin thống kê:', thongke);
    
            setCartItems([]); // Xóa giỏ hàng
            navigate('/order'); // Điều hướng đến trang đơn hàng
        } catch (error) {
            console.error('Payment error:', error);
            alert(`Error: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            // Xóa sản phẩm khỏi backend
            await axios.delete(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/cart-shop/${productId}`);
    
            // Xóa sản phẩm khỏi state
            const updatedItems = cartItems.filter(item => item.id !== productId);
            setCartItems(updatedItems);
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Có lỗi xảy ra khi xóa sản phẩm.');
        }
    };
    
    return (
    <div className='cart content'>
        <div className='wrapper'>
                <div>
                    <Row>
                        <Col sm={8}>
                            {filteredItems.length === 0 ? (
                            <p>No items in the cart.</p>
                            ) : (   
                            <div>
                                <div>
                                    <p>Miễn phí vận chuyển khi mua 2 sản phẩm! (không áp dụng cho phụ kiện)</p>
                                    <ProgressBar style={{height:'7px',marginTop:'20px'}} striped variant="dark" now={100} />
                                </div>
                                <div style={{marginLeft: '114px', marginTop:'20px'}} className='inline-flex'>
                                    <h6 style={{width: '200px'}}>PRODUCT</h6>
                                    <h6 style={{width: '200px'}}>PRICE</h6>
                                    <h6 style={{width: '200px'}}>QUANTITY</h6>
                                    <h6 style={{width: '200px'}}>SUBTOTAL</h6>
                                </div>
                                {filteredItems.map((item, index) => (
                                    <div>
                                        <div class='infor-cart inline-flex'>
                                        <VscClose
                                            style={{ marginTop: '30px', cursor: 'pointer' }}
                                            onClick={() => handleRemoveItem(item.id)}
                                        />
                                            <img
                                                src={item.anhDD || 'placeholder-image-url.jpg'}
                                                alt={item.tenSp || 'No Name'}
                                                style={{ width: '80px', height: 'auto' }}
                                            />
                                            <h6 style={{width: '200px', marginTop: '30px'}}>{item.tenSp}</h6>
                                            <p style={{fontSize:'13px', width: '200px', marginTop: '30px'}}>{item.giaTien?.toLocaleString() || '0'} ₫</p>
                                            <div style={{width: '200px', marginTop: '30px'}} className=' quantity inline-flex' >
                                                <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                                <span>{item.soLuong || 0}</span>
                                                <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                            </div>
                                            <p style={{fontSize:'13px',width: '200px', marginTop: '30px'}}>{(item.giaTien * item.soLuong)?.toLocaleString() || '0'} ₫</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            )}
                        </Col>
                        <Col sm={4}>
                            <div  className='infor-payment'>
                                <h4>Payment Information</h4>
                                <button onClick={handlePaymentOnline}>Chuyển khoản ngân hàng</button>
                                <div style={{padding:'10px', background:'#ffe'}}>
                                    <p style={{opacity:'0.5'}}>
                                        Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi.
                                        Vui lòng sử dụng Số diện thoại<br/>
                                        của bạn trong phần Nội dung thanh toán. Đơn hàng sẽ đươc giao sau khi tiền đã chuyển.
                                    </p>
                                </div>
                                <button onClick={handlePaymentOfline}>Trả tiền mặt khi nhận hàng</button>
                                <div  style={{padding:'10px', background:'#ffe'}}>
                                    <p style={{opacity:'0.5'}}>
                                        Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, tăng trải nghiệm sử dụng website, và<br/>
                                         cho các mục đích cụ thể khác đã được mô tả trong privacy policy của chúng tôi.
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
        </div>
    </div>
  );
}