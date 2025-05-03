import React from "react";
import Layout from "../components/Layout";
// import HoSoDangVien from "../components/HoSoDangVien";
import HoSoDangVienList from "../components/HoSoDangVienComponent/HoSoDangVienList";
const QuanLyHoSo = () => {
    return (
      <>
       <Layout Component={HoSoDangVienList} />
      </>
    
    );
  };
  export default QuanLyHoSo;