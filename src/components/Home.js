import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ShowProducts from './ShowProducts.js';
import axios from 'axios';
import '../assets/styles/index.css';
import '../assets/styles/home.css';
function Home() {
    const [productsHot, setProductsHot] = useState([]);
    const [productsLoadidongNew, setProductsLoadidongNew] = useState([]);
    const [productsLoatrongnhaHot, setProductsLoatrongnhaHot] = useState([]);
    const [productsPhukien, setProductsPhuKien] = useState([])

    // Sử dụng useEffect để gọi API khi component được render
    useEffect(() => {
        // Gọi API lấy sản phẩm có trangThai 'Hot'
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/hot`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        }) // Địa chỉ API của bạn
            
            .then(response => {
                setProductsHot(response.data);  // Cập nhật state với dữ liệu từ API
            })
            .catch(error => {
                console.error('Có lỗi khi gọi API:', error);
            });
    }, []);
    console.log('tesst',productsHot);

    // Sử dụng useEffect để gọi API
    useEffect(() => {
        // Gọi API lấy sản phẩm có trangThai 'Hot'
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/loa-di-dong/new`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        }) // Địa chỉ API của bạn
            .then(response => {
                setProductsLoadidongNew(response.data);  // Cập nhật state với dữ liệu từ API
            })
            .catch(error => {
                console.error('Có lỗi khi gọi API:', error);
            });
    }, []);

    useEffect(() => {
        // Gọi API lấy sản phẩm có trangThai 'Hot'
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/loa-trong-nha/hot`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        }) // Địa chỉ API của bạn
            .then(response => {
                setProductsLoatrongnhaHot(response.data);  // Cập nhật state với dữ liệu từ API
            })
            .catch(error => {
                console.error('Có lỗi khi gọi API:', error);
            });
    }, []);

    // Gọi API lấy ra các sản phẩm của loại phụ kiện
    useEffect(() => {
        // Gọi API lấy sản phẩm có trangThai 'Hot'
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/products/phu-kien`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        }) // Địa chỉ API của bạn
            .then(response => {
                setProductsPhuKien(response.data);  // Cập nhật state với dữ liệu từ API
            })
            .catch(error => {
                console.error('Có lỗi khi gọi API:', error);
            });
    }, []);

    return (
        <div className='home-page content'>
            <div className='wrapper'>
                <div className='slider-home'>
                    <div className='text'>
                        <h2>ALL SPEAKERS</h2>
                        <h6>THƯỞNG THỨC ÂM THANH MARSHALL TẠI NHÀ<br/>VÀ TRÊN ĐƯỜNG PHỐ</h6>
                        <button className='shop-now'>Shop Now</button>
                    </div>
                </div>
                <div className='content-home'>
                    <div className='products-hot'>
                        <h4>SẢN PHẨM HOT</h4>
                        <ShowProducts products={productsHot}/>
                    </div>
                    <div className='content-home-speakers'>
                        <div className='speaker-phone'>
                            <div className='intro-speakers'>
                                <Row>
                                    <Col sm={6}>
                                        <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1733198431/Middleton_Category-page_2-column-banner_desktop_fliymp.png' alt='err'/>
                                    </Col>
                                    <Col sm={6}>
                                        <div className='text-speakers'>
                                            <h1>LOA DI ĐỘNG</h1>
                                            <p>Mang âm thanh đặc trưng của Marshall đi khắp mọi nơi bằng<br/>
                                            loa di động và giữ cho âm nhạc của bạn tiếp tục hàng giờ liền.</p>
                                        </div>
                                        <button className='viewmore'>Xem thêm</button>
                                    </Col>
                                </Row>
                            </div>
                            <div className='new-speakers'>
                                <Row>
                                    <Col sm={4}>
                                        <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1733200178/emberton-iii_tfohho.avif' alt='err'></img>
                                    </Col>
                                    <Col sm={8}>
                                        <h1>SẢN PHẨM MỚI DÒNG LOA DI ĐỘNG</h1>
                                        <div className='product-new-speakers'>
                                            <ShowProducts products={productsLoadidongNew} />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            
                        </div>
                        <div className='speaker-home'>
                            <div className='intro-speakers'>
                                <Row>
                                    <Col sm={6}>
                                        <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1733198543/2-col-home-family-both_d64z7j.png' alt='err'/>
                                    </Col>
                                    <Col sm={6}>
                                        <div className='text-speakers'>
                                            <h1>LOA NGHE TRONG NHÀ</h1>
                                            <p>Đắm chìm trong âm nhạc của bạn và trải nghiệm âm<br/>
                                            thanh sân khấu lớn trong sự thoải mái tại nhà của bạn.</p>
                                        </div>
                                        <button className='viewmore'>Xem thêm</button>
                                    </Col>
                                </Row>
                            </div>
                            <ShowProducts products={productsLoatrongnhaHot} />
                        </div>
                    </div>
                    <div className='content-home-earsphone'>
                        <div className='intro-earsphone'>
                            <Row>
                                <Col sm={6}>
                                    <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1733198797/TAINGHE-1_gihzpm.png' alt='err'/>
                                </Col>
                                <Col sm={6}>
                                    <div className='text-speakers'>
                                        <h1>Tai nghe Marshall</h1>
                                        <p>CHO CHÚNG TÔI ĐÔI TAI CỦA BẠN VÀ CHÚNG TÔI SẼ GIÚP BẠN<br/>
                                        NGHE MỘT BÀI NHẠC</p>
                                    </div>
                                    <button className='viewmore'>Xem thêm</button>
                                </Col>
                            </Row>
                        </div>
                        <div className='list-headphones'>
                            <Row>
                                <Col sm={4}>
                                    <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1733198889/in-ear-01-hero-1536x674_hbsssf.jpg' alt='err'/>
                                </Col>
                                <Col sm={4}>
                                    <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1733198937/slideshow-major-iv-05-1536x1012_ua7lup.jpg' alt='err'/>
                                </Col>
                                <Col sm={4}>
                                    <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1733198987/marshall_campaign_monitorII-ANC_1_cz1nkf.jpg' alt='err'/>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className='content-home-accessory'>
                        <h1 style={{marginTop:'50px'}}>PHỤ KIỆN MARSHALL</h1>
                        <div className='products-accessory'>
                            <ShowProducts products ={productsPhukien} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default Home;
