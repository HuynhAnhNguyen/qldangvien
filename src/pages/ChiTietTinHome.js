import React from "react";
import Layout from "../components/LayoutComponent/Layout";
import ChiTietTinTucHome from "../components/ChiTietTinTucHome";
import LayoutHome from "../components/LayoutComponent/LayoutHome";
const ChiTietTinHome = () => {
    return (
      <>
       <LayoutHome Component={ChiTietTinTucHome} />
      </>
    
    );
  };
  export default ChiTietTinHome;
  