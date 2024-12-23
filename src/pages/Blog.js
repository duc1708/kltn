import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import '../assets/styles/blog.css';
const Blog = () => {
  const [data, setData] = useState([]);
    useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL_MARSHALL}blogs`, {
        headers: {
            'ngrok-skip-browser-warning': 'true',
        },
    })
      .then((response) => setData(response.data));
  }, []);
  return (
    <div className='blog_content content'>
      <div className='wrapper inline-flex'>
        <div className='left_blog_content'>
        <Row>
          {data.map((product)=>(
            <Col sm={4}>
              <Card>
                <div className="image-container">
                  <Card.Img variant="top" src={product.img} />
                </div>
                <Card.Body>
                  <span>Chưa phân loại / {product.thoiGian}</span>
                  <Card.Title>{product.tenbaiviet}</Card.Title>
                  <Card.Text>
                    {product.noiDung}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">Continue Reading</small>
                </Card.Footer>
              </Card>
            </Col>
          ))}  
        </Row>
      </div>
      <div className='right_blog_content'>
        <h6>Chuyên Mục</h6>
        <div className='categories'>
          <p>Cameras</p>
          <p>Chưa phân loại</p>
          <p>Desktop</p>
          <p>Gaming</p>
          <p>Hi-Fi</p>
          <p>Keyboards</p>
          <p>Laptops</p>
          <p>Sound</p>
        </div>
        <hr/>
        <div className='second_right'>
          <h6>Recent Posts</h6>
          <p>Cảnh báo tai nghe Marshall Minor 3, cùng một số model loa Fake được quảng cáo và bán đầy rẫy trên Facebook</p>
          <span>19 Tháng Mười, 2023 No Comments</span>
        </div>
        <hr/>
        <Row>
          <Col sm={4}>
            <img alt='lỗi' src="https://res.cloudinary.com/deuqzffc4/image/upload/v1733233288/338680348_1378888452912102_759862359791985429_n-e1681880689107-q8j4a2dgsmjpj4nrxu5a9178m8q03kpqnvp2crfkd4_i6svwy.jpg"></img>
          </Col>
          <Col sm={8}>
            <p>Review tai nghe Marshall Major 4.</p>
            <p>10 Tháng Năm, 2023 No Comments</p>
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col sm={4}>
            <img alt='lỗi' src="https://res.cloudinary.com/deuqzffc4/image/upload/v1733233285/229f215ed3f20cac55e3-e1683722764737-q8j4bsetbowmte5nvkyntljnto887lk0wer410vkyg_kfabw2.jpg"></img>
          </Col>
          <Col sm={8}>
            <p>Review tai nghe Marshall Major 4.</p>
            <p>10 Tháng Năm, 2023 No Comments</p>
          </Col>
        </Row>
      </div>
      </div>
    </div>
  );
};

export default Blog;