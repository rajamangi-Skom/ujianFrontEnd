import { useEffect, useState } from "react";
import { NavLink, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import "../Kategori/Kategori.css";

const Produk = () => {
  const [produk, setProduk] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const outlet = useOutletContext();
  const search = outlet?.search || "";

  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/produk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProduk(res.data.data || []);
    } catch (error) {
      console.error("Error fetch produk:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = produk.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase()),
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
    const confirmDelete = window.confirm("Yakin mau hapus?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/produk/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchProduk();
    } catch (error) {
      console.error("Error delete:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/produk/edit/${id}`);
  };

  return (
    <div className="kategori-page">
      <div className="kategori-header">
        <h3>Daftar Produk</h3>
        <NavLink to="/dashboard/produk/add" className="btn-add">
          + Tambah
        </NavLink>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Kategori</th>
              <th>Gambar</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7">Data tidak ditemukan</td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

                  <td>{item.name}</td>

                  <td>Rp {Number(item.price).toLocaleString()}</td>

                  <td>{item.stok}</td>

                  <td>{item.kategori?.name || "-"}</td>

                  <td>
                    <img
                      src={`https://raja.petik.or.id/uploads/${item.image}`}
                      alt={item.name}
                    />
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

export default Produk;
