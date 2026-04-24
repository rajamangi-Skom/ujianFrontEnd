import { useState, useEffect } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./NavbarUser.css";

const NavbarUser = ({ search, setSearch, cartCount = 0 }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("user");
    setUser(data ? JSON.parse(data) : null);
  }, []);

  if (!user) return null;

  return (
    <div className="user-navbar">
      <div className="nav-left" onClick={() => navigate("/landing")}>
        <h2>GameStore</h2>
      </div>

      <div className="nav-search">
        <FaSearch />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari game..."
        />
      </div>

      <div className="nav-right">
        <div className="cart-icon" onClick={() => navigate("/cart")}>
          <FaShoppingCart />
          {cartCount > 0 && <span>{cartCount}</span>}
        </div>

        <div className="profile" onClick={() => setOpen(!open)}>
          <div className="avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {open && (
          <div className="dropdown">
            <p>{user.name}</p>
            <small>{user.role}</small>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarUser;