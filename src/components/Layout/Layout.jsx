import React from "react";
import Navbar from "../Navbar";
import "./Layout.scss";

// Make sure to use default export
const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__content">
        {children}
      </main>
    </div>
  );
};

// This should be a default export
export default Layout;