import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./MyNavbar.css";

const MyNavbar = ({ search, setSearch }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const getUserFromStorage = () => {
    try {
      const data = localStorage.getItem("user");
      if (!data || data === "undefined") return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setUser(getUserFromStorage());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!user) return null;

  return (
    <div className="navbar">
      <div className="navbar-left">
        <FaSearch className="icon-search" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search game..."
        />
      </div>

      <div className="navbar-right">
        <div className="profile" onClick={() => setOpen(!open)}>
          <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>

          <div className="user-info">
            <div className="name">{user.name}</div>
            <div className="role">{user.role}</div>
          </div>
        </div>

        {open && (
          <div className="dropdown">
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

export default MyNavbar;
