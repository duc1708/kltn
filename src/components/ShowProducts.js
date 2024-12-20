import React, { useState } from 'react';
import { FaStar } from "react-icons/fa6";
import { IoCheckmarkOutline } from "react-icons/io5";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';

function ShowProducts({ products }) {
    const navigate = useNavigate();

    // State to track which product's image is being hovered
    const [hoveredProduct, setHoveredProduct] = useState(null);

    const handleProductClick = (id, tenSP) => {
        navigate(`/product/${id}`);
    };

    const renderStatusButtons = (status) => {
        const buttons = [];
        if (status.includes("NEW")) {
            buttons.push(<button key="NEW" className='status' style={{ backgroundColor: '#438E44' }}>NEW</button>);
        }
        if (status.includes("HOT")) {
            buttons.push(<button key="HOT" className='status' style={{ backgroundColor: '#E22D2D' }}>HOT</button>);
        }
        return buttons;
    };

    return (
        <Row>
            {products.map((product) => (
                <Col sm={3} key={product.maSP}>
                    <div className='product'>
                        <div style={{ height: '75px' }}>
                            <button className='promotion'>{product.phanTram}%</button><br />
                            <div className='status-buttons'>
                                {renderStatusButtons(product.trangThai)}
                            </div>
                        </div>
                        <img
                            src={hoveredProduct === product.maSP ? product.anhDD1 : product.anhDD}
                            alt={product.tenSp}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredProduct(product.maSP)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        />
                        <div className='infor-product'>
                            <p>{product.tenSp}</p>
                            <i>{product.thuongHieu}</i><br />
                            <div className='star'>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <FaStar
                                        key={index}
                                        color={index < product.sao ? '#ffc107' : '#e4e5e9'} // Filled or empty star color
                                    />
                                ))}
                            </div><br />
                            <IoCheckmarkOutline /><span>In stock</span>
                            <p>{product.giaBan.toLocaleString('vi-VN')} VND</p>
                        </div>
                        <button
                            className='choose'
                            onClick={() => handleProductClick(product.maSP , product.tenSp)}
                        >
                            Lựa Chọn Các Tùy Chọn
                        </button>
                    </div>
                </Col>
            ))}
        </Row>
    );
}

export default ShowProducts;
