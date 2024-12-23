import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/cartshop.css';
import { ProgressBar } from 'react-bootstrap';
import {Row, Col} from 'react-bootstrap';

export default function CartShop() {

    const [cartItems, setCartItems] = useState([]);
    const maKh = localStorage.getItem('maKh');
    // Fetch data from API
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}products/orders`, {
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

    console.log('oder của bạn',cartItems);
    const filteredItems = cartItems.filter(item => item.maKh === parseInt(maKh));
  return (
    <div className='cart content'>
        <div className='wrapper'>
                <div>
                    <Row>
                        <Col sm={12}>
                            {filteredItems.length === 0 ? (
                            <p>No items in the cart.</p>
                            ) : (   
                            <div>
                                <div>
                                    <p>Miễn phí vận chuyển khi mua 2 sản phẩm! (không áp dụng cho phụ kiện)</p>
                                    <ProgressBar style={{height:'7px',marginTop:'20px'}} striped variant="dark" now={100} />
                                </div>
                                <div style={{marginLeft: '114px', marginTop:'20px'}} className='inline-flex'>
                                    <h6 style={{width: '200px'}}>Sản phẩm</h6>
                                    <h6 style={{width: '200px'}}>Giá</h6>
                                    <h6 style={{width: '200px'}}>Số lượng</h6>
                                    <h6 style={{width: '200px'}}>Thành tiền</h6>
                                    <h6 style={{width: '100px'}}>Trạng thái</h6>
                                    <h6 style={{width: '200px'}}>Dự kiến ngày giao</h6>
                                </div>
                                {filteredItems.map((item, index) => (
                                    <div>
                                        <div class='infor-cart inline-flex'>
                                            <img
                                                src={item.anhDD || 'placeholder-image-url.jpg'}
                                                alt={item.tenSP || 'No Name'}
                                                style={{ width: '80px', height: 'auto', marginRight:'20px' }}
                                            />
                                            <h6 style={{width: '200px', marginTop: '30px'}}>{item.tenSP}</h6>
                                            <p style={{fontSize:'13px', width: '200px', marginTop: '30px'}}>{item.giaTien?.toLocaleString() || '0'} ₫</p>
                                            <span style={{fontSize:'13px',marginTop:'30px', marginLeft:'40px'}}>{item.soLuong || 0}</span>
                                            <p style={{fontSize:'13px',width: '200px', marginTop: '30px',marginLeft:'160px'}}>{(item.giaTien * item.soLuong)?.toLocaleString() || '0'} ₫</p>
                                            <p style={{fontSize:'13px', width: '100px', marginTop: '30px'}}>{item.trangThai}</p>
                                            <p style={{fontSize:'13px', width: '200px', marginTop: '30px'}}>{item.ngayGiao || 'Chờ xác nhận'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            )}
                        </Col>
                    </Row>
                </div>
        </div>
    </div>
  );
}