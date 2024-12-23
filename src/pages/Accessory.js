import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ShowProducts from '../components/ShowProducts';
import Filtered from '../components/Filtered';

const Accessory = () => {
    const [allProducts, setAllProducts] = useState([]); // Danh sách tất cả sản phẩm
    const [filteredProducts, setFilteredProducts] = useState([]); // Sản phẩm sau khi lọc
    const [filterValue, setFilterValue] = useState(2000000); // Giá trị lọc mặc định

    // Lấy tất cả sản phẩm phụ kiện từ API
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL_MARSHALL}products/phu-kien`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                },
            }) // Địa chỉ API của bạn
            .then((response) => {
                setAllProducts(response.data); // Lưu tất cả sản phẩm
                setFilteredProducts(response.data); // Hiển thị tất cả sản phẩm ban đầu
            })
            .catch((error) => {
                console.error('Có lỗi khi gọi API:', error);
            });
    }, []);

    // Lọc sản phẩm theo giá trị lọc
    useEffect(() => {
        const productsAfterFilter = allProducts.filter((product) => product.giaBan >= filterValue);
        setFilteredProducts(productsAfterFilter);
    }, [filterValue, allProducts]);

    // Callback khi áp dụng lọc từ component Filtered
    const handleFilter = (price) => {
        setFilterValue(price); // Cập nhật giá trị lọc
    };

    return (
        <div className="accessory-page content">
            <div className="wrapper">
                <div className="about">
                    <Row style={{ paddingTop: '50px' }}>
                        <Col sm={3}>
                            <Filtered onFilter={handleFilter} />
                        </Col>
                        <Col sm={9}>
                            <ShowProducts products={filteredProducts} />
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default Accessory;
