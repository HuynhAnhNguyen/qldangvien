import React from "react";
import Layout from "../components/LayoutComponent/Layout";
import News from "../components/News";
import Index from "../components/Index";
import LayoutHome from "../components/LayoutComponent/LayoutHome";
const Home = () => {
    return (
      <>
       {/* <Layout Component={Index} /> */}
       <LayoutHome Component={Index} />
      </>
    
    );
  };
  export default Home;
  