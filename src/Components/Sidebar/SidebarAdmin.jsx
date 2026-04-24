import React from "react";
import { NavLink } from "react-router-dom";
import "./SidebarAdmin.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>MrGames</h2>
        <ul>
          <li>
            <NavLink to={"/dashboard"} end>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to={"/dashboard/produk"}>Produk</NavLink>
          </li>
          <li>
            <NavLink to={"/dashboard/kategori"}>Kategori</NavLink>
          </li>
          <li>
            <NavLink to={"/dashboard/order"}>Order</NavLink>
          </li>
          <li>
            <NavLink to={"/dashboard/user"}>User</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
