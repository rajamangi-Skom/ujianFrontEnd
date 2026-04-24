import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");

  const outlet = useOutletContext();
  const search = outlet?.search || "";

  const ITEMS_PER_PAGE = 10;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Error fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

 
  const filteredData = orders.filter((item) => {
    const name = item.user?.name?.toLowerCase() || "";
    const id = item.id?.toString() || "";

    return (
      name.includes(search.toLowerCase()) || id.includes(search.toLowerCase())
    );
  });

 
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
  };

  
  const handleUpdateStatus = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/order/${selectedOrder.id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.log(error.response);
      alert(error.response?.data?.message || "Gagal update status");
    }
  };

  return (
    <div className="kategori-page">
      <div className="kategori-header">
        <h3>Daftar Order</h3>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Item</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="6">Data tidak ditemukan</td>
              </tr>
            ) : (
              paginatedData.map((order, index) => (
                <tr key={order.id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>

                  <td>{order.user?.name || "-"}</td>

                  <td>Rp {Number(order.totalPrice).toLocaleString("id-ID")}</td>

                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    {order.items?.map((item) => (
                      <div key={item.id}>
                        {item.produk?.name} x {item.qty}
                      </div>
                    ))}
                  </td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(order)}
                    >
                      Edit Status
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
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
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

     
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Status Order</h3>

            <p>
              Order ID: <b>{selectedOrder.id}</b>
            </p>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="done">done</option>
              <option value="cancel">cancel</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleUpdateStatus} className="btn-update">
                Simpan
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-cancel"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
