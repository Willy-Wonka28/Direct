import React from "react";
import Navbar from "../UI/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center layout-container h-[100vh]">{children}</div>
    </div>
  );
};

export default Layout;
