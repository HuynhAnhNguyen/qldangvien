import React from "react";
import Layout from "../components/LayoutComponent/Layout";
import ChiTietTinTuc from "../components/ChiTietTinTuc";
import LayoutHome from "../components/LayoutComponent/LayoutHome";
const ChiTietTin = () => {
    return (
      <>
       <LayoutHome Component={ChiTietTinTuc} />
      </>
    
    );
  };
  export default ChiTietTin;
  