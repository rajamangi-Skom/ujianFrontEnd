import { Route, Routes } from "react-router-dom";

import Layout from "./Pages/Layout/Layout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Kategori from "./Pages/Kategori/Kategori";
import Order from "./Pages/Order/Order";
import Produk from "./Pages/Produk/Produk";
import AddKategori from "./Pages/Kategori/AddKategori";
import Login from "./Pages/Login/Login";
import EditKategori from "./Pages/Kategori/EditKategori";
import AddProduk from "./Pages/Produk/AddProduk";
import EditProduk from "./Pages/Produk/EditProduk";
import User from "./Pages/User/User";
import EditOrder from "./Pages/Order/EditOrder";
import AddUser from "./Pages/User/AddUser";

import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";

import UserLayout from "./Pages/Layout/LayoutUser";

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* USER AREA */}
      <Route element={<UserLayout />}>
        <Route path="/landing" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* ADMIN AREA */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />

        <Route path="kategori" element={<Kategori />} />
        <Route path="kategori/add" element={<AddKategori />} />
        <Route path="kategori/edit/:id" element={<EditKategori />} />

        <Route path="order" element={<Order />} />
        <Route path="order/status/:id" element={<EditOrder />} />

        <Route path="produk" element={<Produk />} />
        <Route path="produk/add" element={<AddProduk />} />
        <Route path="produk/edit/:id" element={<EditProduk />} />

        <Route path="user" element={<User />} />
        <Route path="user/add" element={<AddUser />} />
      </Route>
    </Routes>
  );
}

export default App;
