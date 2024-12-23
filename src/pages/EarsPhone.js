import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/index.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ShowProducts from '../components/ShowProducts';
import Filtered from '../components/Filtered';

const EarsPhone = () => {
    const [productsofcategorize, setProductsOfCategorize] = useState([]);
    const [categorizes_earsphone, setCategorizesEarsPhone] = useState([]);
    const [filterValue, setFilterValue] = useState(2000000); // Giá trị mặc định của bộ lọc giá

    // Fetch all products initially
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}products/earsphone`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then(response => {
                setProductsOfCategorize(response.data);
            })
            .catch(error => {
                console.error('Có lỗi khi gọi API:', error);
            });
    }, []);

    // Fetch categories
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}products/categorize-earsphone`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then(response => {
                setCategorizesEarsPhone(response.data);
            })
            .catch(error => {
                console.error('Có lỗi khi gọi API:', error);
            });
    }, []);

    // Handle "All Products" click
    const handleAllProductsClick = () => {
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}products/earsphone`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then(response => {
                setProductsOfCategorize(response.data);
            })
            .catch(error => {
                console.error('Có lỗi khi gọi API:', error);
            });
    };

    // Handle category click
    const handleCategoryClick = (maLoai) => {
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}products/earsphone`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then(response => {
                const filteredProducts = response.data.filter(product => product.maLoai === maLoai);
                setProductsOfCategorize(filteredProducts);
            })
            .catch(error => {
                console.error('Có lỗi khi gọi API:', error);
            });
    };

    // Handle filter application
    const handleFilter = (value) => {
        setFilterValue(value); // Cập nhật giá trị bộ lọc
    };

    // Lọc sản phẩm dựa trên giá trị bộ lọc
    const filteredProducts = productsofcategorize.filter(product => product.giaBan >= filterValue);

    return (
        <div className='earsphone-page content'>
            <div className='wrapper'>
                <p style={{ fontSize: '20px', fontWeight: '500', paddingTop: '50px', cursor: 'pointer' }} onClick={handleAllProductsClick}>
                    TAI NGHE MARSHALL
                </p>
                <div className='categorizes'>
                    <div className='list-categorize inline-flex'>
                        {categorizes_earsphone.map((categorize) => (
                            <div className='categorize' key={categorize.maLoai}>
                                <img
                                    src={categorize.img}
                                    alt=''
                                    onClick={() => handleCategoryClick(categorize.maLoai)}
                                />
                                <h6>{categorize.tenLoai}</h6>
                                <p>{categorize.soLuong} products</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='about'>
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
};

export default EarsPhone;
