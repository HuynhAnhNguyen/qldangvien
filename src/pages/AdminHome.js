import React from "react";
import Layout from "../components/LayoutComponent/Layout";
import News from "../components/News";
import Index from "../components/Index";
import LayoutHome from "../components/LayoutComponent/LayoutHome";
import IndexAdmin from "../components/IndexAdmin";
const AdminHome = () => {
    return (
      <>
       {/* <Layout Component={Index} /> */}
       <Layout Component={IndexAdmin} />
      </>
    
    );
  };
  export default AdminHome;
  