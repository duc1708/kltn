import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../assets/styles/footer.css';
function Footer (){
    return (
        <div className='footer'>
            <div className='wrapper'>
              <div className='top_footer'>
               <Row>
                         <Col sm={3}>
                              <h5> Hà Nội Store</h5>
                         </Col>
                         <Col sm={3}>
                              <h5> Hà Nội Store</h5>
                         </Col>
                         <Col sm={3}>
                              <h5> Hồ Chí Minh Srore</h5>
                         </Col>
                         <Col sm={3}>
                              <h5> Hà Nội Store</h5>
                         </Col>
                    </Row>
              </div>
               <hr/>
               <div className='bot_footer'>
                    <Row>
                         <Col sm={2}>
                              <p>Marshall Store Vietnam mong muốn đem đến những sản phẩm đẹp, chất lượng cùng những câu chuyện và những trải nghiệm mới mẻ cho khách hàng của mình với dịch vụ tốt nhất. </p>
                              <h6>Subcribe</h6>
                              <img src='https://res.cloudinary.com/deuqzffc4/image/upload/v1734613001/list-icon_tpywvm.jpg' alt='err'/>
                              <img style={{marginLeft:'1050px', marginTop:'-110px'}} src='https://res.cloudinary.com/deuqzffc4/image/upload/v1734613150/Screenshot_2024-12-19_195839_c7hobf.jpg' alt='err' />
                         </Col>
                         <Col sm={2}>
                                <h6 style={{marginLeft:'28px'}}> Categories</h6>
                                <ul>
                                   <li>Portable Speakers</li>
                                   <li>Home Speakers</li>
                                   <li>Headphones</li>
                                   <li>Phụ kiện Marshall</li>
                                </ul>
                            </Col>
                            <Col sm={2}>
                                <h6 style={{marginLeft:'28px'}}> Useful Links</h6>
                                <ul>
                                   <li>Promotions</li>
                                   <li>Stores</li>
                                   <li>Our contacts</li>
                                   <li>Delivery & Return</li>
                                   <li>Outlet</li>
                                </ul>
                            </Col>
                            <Col sm={2}>                  
                                <h6 style={{marginLeft:'28px'}}> Useful Links</h6>
                                <ul>
                                   <li>Blog</li>
                                   <li>Our contacts</li>
                                   <li>Promotions</li>
                                   <li>Stores</li>
                                   <li>Delivery & Return</li>
                                </ul>
                            </Col>
                            <Col sm={3}>
                              <h5 style={{marginLeft:'28px'}}> MARSHALL STORE VIETNAM</h5>
                              <ul>
                                   <li>Đại lý/ Dự án:</li>
                                   <li>Mail:</li>
                                   <li>Mail: marshallstorevietnam.vn@gmail.com</li>
                              </ul>
                         </Col>
                    </Row>
               </div>
            </div>
        </div>
    );
};

export default Footer;