import React from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Cart.css";

const Cart = () => {
  const { cart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    try {
      if (cart.length === 0) return;

      const items = cart.map((item) => ({
        produkId: item.id,
        qty: item.qty,
      }));

      const token = localStorage.getItem("token");

      Swal.fire({
        title: "Processing...",
        text: "Sedang membuat pesanan",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/create`,
        { items },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Swal.fire({
        icon: "success",
        title: "Checkout berhasil!",
        text: "Pesanan kamu sudah masuk",
        confirmButtonColor: "#2563eb",
      });

      navigate("/landing");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Checkout gagal",
        text: err.response?.data?.message || err.message || "Terjadi kesalahan",
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty">
          <p>Cart kosong</p>
          <button
            onClick={() => navigate("/landing")}
            className="pay-balik"
            style={{
              width: "200px",
              padding: "12px",
              background: "#2563eb",
              border: "none",
              borderRadius: "10px",
              color: "white",
              cursor: "pointer",
            }}
          >
            Kembali Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="header">
        <button onClick={() => navigate(-1)}>← Kembali</button>
        <h1>Checkout</h1>
        <div />
      </div>

      <div className="stepper">
        <div className="step active">1</div>
        <div className="line" />
        <div className="step">2</div>
        <div className="line" />
        <div className="step">3</div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Detail Produk</h3>

          {cart.map((item) => (
            <div className="product-card" key={item.id}>
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `${import.meta.env.VITE_API_URL}/uploads/${item.image}`
                }
              />

              <div className="product-info">
                <h4>{item.name}</h4>
                <p>Rp {item.price.toLocaleString("id-ID")}</p>

                <div className="qty-row">
                  <button onClick={() => decreaseQty(item.id)}>-</button>

                  <span>{item.qty}</span>

                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Ringkasan</h3>

          <div className="summary-list">
            {cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <span>{item.name}</span>
                <span>x{item.qty}</span>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div className="total">Total: Rp {total.toLocaleString("id-ID")}</div>

          <button className="pay-btn" onClick={handleCheckout}>
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
