import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/cartshop.css';
import { ProgressBar } from 'react-bootstrap';
import { Row, Col, Pagination } from 'react-bootstrap';

export default function CartShop() {
    const [cartItems, setCartItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const itemsPerPage = 4; // Số lượng sản phẩm trên mỗi trang
    const maKh = localStorage.getItem('maKh');

    // Fetch data from API
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/orders`, {
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

    // Tính toán các sản phẩm cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Tạo danh sách các trang
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

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
                                        <ProgressBar style={{ height: '7px', marginTop: '20px' }} striped variant="dark" now={100} />
                                    </div>
                                    <div style={{ marginLeft: '114px', marginTop: '20px' }} className='inline-flex'>
                                        <h6 style={{ width: '200px' }}>Sản phẩm</h6>
                                        <h6 style={{ width: '200px' }}>Giá</h6>
                                        <h6 style={{ width: '200px' }}>Số lượng</h6>
                                        <h6 style={{ width: '200px' }}>Thành tiền</h6>
                                        <h6 style={{ width: '100px' }}>Trạng thái</h6>
                                        <h6 style={{ width: '200px' }}>Dự kiến ngày giao</h6>
                                    </div>
                                    {currentItems.map((item, index) => (
                                        <div key={index}>
                                            <div className='infor-cart inline-flex'>
                                                <img
                                                    src={item.anhDD || 'placeholder-image-url.jpg'}
                                                    alt={item.tenSP || 'No Name'}
                                                    style={{ width: '80px', height: 'auto', marginRight: '20px' }}
                                                />
                                                <h6 style={{ width: '200px', marginTop: '30px' }}>{item.tenSP}</h6>
                                                <p style={{ fontSize: '13px', width: '200px', marginTop: '30px' }}>{item.giaTien?.toLocaleString() || '0'} ₫</p>
                                                <span style={{ fontSize: '13px', marginTop: '30px', marginLeft: '40px' }}>{item.soLuong || 0}</span>
                                                <p style={{ fontSize: '13px', width: '200px', marginTop: '30px', marginLeft: '160px' }}>{(item.giaTien * item.soLuong)?.toLocaleString() || '0'} ₫</p>
                                                <p style={{ fontSize: '13px', width: '100px', marginTop: '30px' }}>{item.trangThai}</p>
                                                <p style={{ fontSize: '13px', width: '200px', marginTop: '30px' }}>
                                                    {item.ngayGiao
                                                        ? new Date(item.ngayGiao).toLocaleDateString('vi-VN', {
                                                              day: 'numeric',
                                                              month: 'numeric',
                                                              year: 'numeric',
                                                          })
                                                        : 'Chờ xác nhận'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Phân trang */}
                                    <Pagination style={{ marginTop: '20px', justifyContent: 'center' }}>
                                        {paginationItems}
                                    </Pagination>
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}
