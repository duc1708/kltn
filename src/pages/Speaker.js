import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/index.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ShowProducts from '../components/ShowProducts';
import Filtered from '../components/Filtered';

function Speakers() {
    const [allProducts, setAllProducts] = useState([]); // Tất cả sản phẩm
    const [filteredProducts, setFilteredProducts] = useState([]); // Sản phẩm hiển thị
    const [categorizesSpeakers, setCategorizesSpeakers] = useState([]); // Danh mục loa
    const [filterValue, setFilterValue] = useState(2000000); // Giá trị lọc mặc định

    // Lấy tất cả sản phẩm ban đầu
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL_MARSHALL}products/speakers`)
            .then((response) => {
                setAllProducts(response.data);
                setFilteredProducts(response.data); // Hiển thị tất cả sản phẩm ban đầu
            })
            .catch((error) => {
                console.error('Có lỗi khi gọi API:', error);
            });
    }, []);

    // Lấy danh mục loa
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL_MARSHALL}products/categorize-speakers`)
            .then((response) => {
                setCategorizesSpeakers(response.data);
            })
            .catch((error) => {
                console.error('Có lỗi khi gọi API:', error);
            });
    }, []);

    // Lọc sản phẩm theo giá trị
    useEffect(() => {
        const productsAfterFilter = allProducts.filter((product) => product.giaBan >= filterValue);
        setFilteredProducts(productsAfterFilter);
    }, [filterValue, allProducts]);

    // Hiển thị tất cả sản phẩm khi nhấn "LOA MARSHALL"
    const handleAllProductsClick = () => {
        setFilteredProducts(allProducts); // Reset hiển thị
        setFilterValue(2000000); // Reset giá trị lọc
    };

    // Lọc sản phẩm theo danh mục
    const handleCategoryClick = (maLoai) => {
        const productsByCategory = allProducts.filter((product) => product.maLoai === maLoai);
        setFilteredProducts(productsByCategory);
    };

    // Xử lý khi nhấn nút "Filter"
    const handleFilter = (price) => {
        setFilterValue(price); // Cập nhật giá trị lọc
    };

    return (
        <div className="speakers-page content">
            <div className="wrapper">
                <p
                    style={{ fontSize: '20px', fontWeight: '500', paddingTop: '50px', cursor: 'pointer' }}
                    onClick={handleAllProductsClick}
                >
                    LOA MARSHALL
                </p>
                <div className="categorizes">
                    <div className="list-categorize inline-flex">
                        {categorizesSpeakers.map((categorize) => (
                            <div className="categorize" key={categorize.maLoai}>
                                <img
                                    src={categorize.img}
                                    alt=""
                                    onClick={() => handleCategoryClick(categorize.maLoai)}
                                />
                                <h6>{categorize.tenLoai}</h6>
                                <p>{categorize.soLuong} products</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="about">
                    <Row>
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
}

export default Speakers;
