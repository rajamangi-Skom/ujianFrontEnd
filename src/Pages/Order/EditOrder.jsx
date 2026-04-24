import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../Kategori/AddKategori.css";

const EditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [status, setStatus] = useState("");
  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrderById();
  }, []);

  const fetchOrderById = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/order/cari/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data;
      setOrder(data);
      setStatus(data.status);
    } catch (err) {
      console.log(err);
      setError("Gagal ambil data order");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/order/status${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/dashboard/order");
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "Gagal update order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kategori-page-edit">
      <div className="kategori-header">
        <h3>Edit Order</h3>
      </div>

      {loading && !order ? (
        <p>Loading...</p>
      ) : (
        <form className="form-wrapper" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Order ID</label>
            <input type="text" value={order?.id || ""} disabled />
          </div>

          <div className="form-group">
            <label>User</label>
            <input type="text" value={order?.user?.name || ""} disabled />
          </div>

          <div className="form-group">
            <label>Total Harga</label>
            <input
              type="text"
              value={`Rp ${Number(order?.totalPrice || 0).toLocaleString()}`}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="done">done</option>
              <option value="cancel">cancel</option>
            </select>
          </div>

          <div className="form-group">
            <label>Items</label>
            <div style={{ fontSize: "14px", color: "#ccc" }}>
              {order?.items?.map((item, i) => (
                <div key={i}>
                  {item.produk?.name} x {item.qty}
                </div>
              ))}
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="btn-group-order">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-cancel"
            >
              Batal
            </button>

            <button type="submit" className="btn-submit">
              {loading ? "Menyimpan..." : "Update Status"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditOrder;
