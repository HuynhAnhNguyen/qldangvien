import React from "react";
import Layout from "../components/LayoutComponent/Layout";
import TaiKhoanList from "../components/TaiKhoanComponent/TaiKhoanList";
// import TaiKhoan from "../components/TaiKhoan";
const QuanLyTaiKhoan = () => {
    return (
      <>
       <Layout Component={TaiKhoanList} />
      </>
    
    );
  };
  export default QuanLyTaiKhoan;