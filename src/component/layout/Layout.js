"use client";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const RootLayout = ({ children }) => {
  return (
    <div className="mainContainer d-flex w-100">
      <div className="containerLeft">
        <Sidebar />
      </div>
      <div className="containerRight w-100 ">
        <Navbar />
        <div className="mainAdmin ml-4">
          <div className="mobSidebar-bg  d-none"></div>
          <main className="comShow">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
