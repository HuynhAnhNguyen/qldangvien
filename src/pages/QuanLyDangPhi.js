import React from "react";
import Layout from "../components/LayoutComponent/Layout";
// import DangPhi from "../components/DangPhi";
import DangPhiList from "../components/DangPhiComponent/DangPhiList";
const QuanLyDangPhi = () => {
    return (
      <>
       <Layout Component={DangPhiList} />
      </>
    
    );
  };
  export default QuanLyDangPhi;