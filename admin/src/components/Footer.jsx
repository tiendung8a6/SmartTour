import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-4">
      <Link to="https://" target="_blank" className="text-gray-500">
        © 2024 Smart Tour. All Rights Reserved. Designed and Developed By
        <span className="text-blue-500"> Ngo Tien Dung</span>
      </Link>
    </footer>
  );
};

export default Footer;
