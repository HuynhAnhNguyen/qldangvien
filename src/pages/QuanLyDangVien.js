import React from "react";
import Layout from "../components/Layout";
import DangVien from "../components/DangVien";
import DangVienList from "../components/DangVienComponent/DangVienList";
const QuanLyDangVien = () => {
    return (
      <>
       <Layout Component={DangVienList} />
      </>
    
    );
  };
  export default QuanLyDangVien;