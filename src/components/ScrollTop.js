import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation(); // Lấy ra đường dẫn hiện tại

    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn lên đầu trang mỗi khi đường dẫn thay đổi
    }, [pathname]); // Chạy lại useEffect mỗi khi đường dẫn (pathname) thay đổi

    return null; // Component này không render gì lên giao diện
}

export default ScrollToTop;
