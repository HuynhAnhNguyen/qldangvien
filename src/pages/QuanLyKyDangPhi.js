import React from "react";
import Layout from "../components/LayoutComponent/Layout";
// import KyDangPhi from "../components/KyDangPhi";
import KyDangPhiList from "../components/KyDangPhiComponent/KyDangPhiList";
const QuanLyKyDangPhi = () => {
    return (
      <>
       <Layout Component={KyDangPhiList} />
      </>
    
    );
  };
  export default QuanLyKyDangPhi;