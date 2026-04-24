import { useEffect, useState } from "react";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import "../Kategori/Kategori.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const outlet = useOutletContext();
  const search = outlet?.search || "";

  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Error fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = users.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin mau hapus user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUser();
    } catch (error) {
      console.error("Error delete user:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/user/edit/${id}`);
  };

  return (
    <div className="kategori-page">
      <div className="kategori-header">
        <h3>Daftar User</h3>
        <NavLink to="/dashboard/user/add" className="btn-add">
          + Tambah
        </NavLink>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5">Data tidak ditemukan</td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

                  <td>{item.name}</td>

                  <td>{item.email}</td>

                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        background:
                          item.role === "admin" ? "#38bdf8" : "#6366f1",
                        color: "#000",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.role}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="btn-edit"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              disabled={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default User;
