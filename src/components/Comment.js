import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import '../assets/styles/comment.css';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
const Comment = () => {
    const [listComments, setListComments] = useState([]);
    const tenSP = localStorage.getItem('tenSP' || '')
    const { id } = useParams(); 
    const avt = localStorage.getItem('avt'||'');
    const tenKh = localStorage.getItem('tenKh'||'');
    const maKh = localStorage.getItem('maKh'|| '')
    const [content, setContent] = useState('');
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL_MARSHALL}api/binhluan`, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then(response => {
                setListComments(response.data); // Expecting response.data to be an array
            })
            .catch(error => {
                console.error('Error fetching cart data:', error);
            });
    }, []);

    const filteredComment = listComments.filter(comment => comment.maSP === parseInt(id));

    const handleAddComment = () => {
        if (!content.trim()) {
            alert('Please enter your review before submitting.');
            return;
        }
    
        const ngayDang = new Date().toISOString().split('T')[0];
        const newComment = {
            maKh,
            tenKh,
            noiDung: content,
            avt,
            ngayDang,
            maSP: parseInt(id), // Ensure the ID is an integer
            tenSP,
        };
    
        // Cập nhật danh sách comment ngay lập tức
        setListComments((prevComments) => [...prevComments, newComment]);
        setContent(''); // Clear the input field
    
        // Gửi request API
        axios.post(`${process.env.REACT_APP_API_URL_MARSHALL}api/add-comment`, newComment)
            .then((response) => {
                console.log('Comment successfully posted:', response.data);
            })
            .catch((error) => {
                console.error('Error posting comment:', error);
                alert('Có lỗi khi đăng comment');
                // Xóa comment vừa thêm nếu API thất bại
                setListComments((prevComments) => prevComments.filter(comment => comment !== newComment));
            });
    };
    
    return (
        <div className="comment-page">
            <div className="wrapper">
                <Row>
                    <Col sm={6}>
                        <div className="form-comment">
                            <h6>ADD A REVIEW</h6>
                            <p>Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc được đánh dấu *</p>
                            <h6>Your Review</h6>
                            <textarea 
                                placeholder="Enter your text here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            <h6>You have to be logged in to be able to add photos to your review.</h6>
                            <button class="submit" onClick={handleAddComment}>Submit</button>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <div className="list-comment">
                            <h6 style={{ marginBottom: '74px' }}>REVIEWS FOR {tenSP}</h6>
                            {filteredComment.length === 0 ? (
                                <p>There are no reviews yet.</p>
                            ) : (
                                <div>
                                    {filteredComment.map((item, index) => (
                                        <div className="comment" key={index}>
                                            <div className="inline-flex">
                                                <Image src={`/avatar_user/${item.avt}`} roundedCircle />
                                                <h6>{item.tenKh}</h6>
                                                <h6 style={{ marginLeft: '354px'}}>
                                                    {new Date(item.ngayDang).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                    })}
                                                </h6>
                                            </div>
                                            <p>{item.noiDung}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Comment;