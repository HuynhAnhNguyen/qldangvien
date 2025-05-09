import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import HeaderHome from "./HeaderHome";

const LayoutHome = ({ Component }) => {
  return (
    <div className="wrapper">
      <div className="main">
        <HeaderHome />
        <main className="content">
          <Component />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LayoutHome;
