import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/SidebarAdmin";
import { Outlet } from "react-router-dom";
import MyNavbar from "../../Components/MyNavbar/MyNavbar";
import "./Layout.css";

const Layout = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <MyNavbar search={search} setSearch={setSearch} />

        <div className="content">
          <Outlet context={{ search, setSearch }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
