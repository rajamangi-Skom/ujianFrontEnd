import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import NavbarUser from "../../Components/MyNavbar/NavbarUser";

const LayoutUser = () => {
  const [search, setSearch] = useState("");

  return (
    <>
      <NavbarUser search={search} setSearch={setSearch} />

      <main>
        <Outlet context={{ search }} />
      </main>

      <Footer />
    </>
  );
};

export default LayoutUser;
