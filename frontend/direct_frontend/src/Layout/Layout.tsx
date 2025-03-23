import React from "react";
import Navbar from "../UI/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="layout-container">{children}</div>
    </div>
  );
};

export default Layout;
