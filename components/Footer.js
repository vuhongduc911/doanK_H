import React from 'react';
import { FaFacebook,FaTwitterSquare,FaInstagramSquare,FaLinkedin } from 'react-icons/fa';
const Footer = () => {
  return (
    
    <footer style={{height:'160px',color:'black'}}>//chinh mau footer
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <h3>Về chúng tôi</h3>
            <p>18094451 - Lê văn Hiệu</p>
           <p> 18053791 - Đỗ lê đăng khoa</p>

          </div>
          <div className="col-lg-4 col-md-6">
            <h3>Liên hệ</h3>
            <ul className="contact-info">
              <li><i className="fa fa-map-marker"></i>  Địa chỉ: 12 Nguyễn Văn Bảo, Quận Gò Vấp, TP.HCM</li>
              <li><i className="fa fa-phone"></i>  Số điện thoại: 0123456789</li>
              <li><i className="fa fa-envelope"></i>  Email: iuh@gmail.com</li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-6">
            <h3>Theo dõi chúng tôi</h3>
            <ul className="social-links">
              <li><a href="#"><FaFacebook /></a> DNA</li>
              <li><a href="#"><FaTwitterSquare /> DNA</a></li>
              <li><a href="#"><FaInstagramSquare /> DNA</a></li>
              <li><a href="#"><FaLinkedin /> DNA</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
