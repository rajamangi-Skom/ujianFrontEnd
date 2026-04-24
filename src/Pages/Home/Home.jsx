import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import Swal from "sweetalert2";

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { search = "" } = useOutletContext() || {};

  const [kategori, setKategori] = useState([]);
  const [produk, setProduk] = useState([]);
  const [activeKategori, setActiveKategori] = useState("Semua");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resKat, resProd] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/kategori`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/produk`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setKategori(resKat.data.data ?? []);
      setProduk(resProd.data.data ?? []);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


  const filteredProduk = produk.filter((p) => {
    const matchKategori =
      activeKategori === "Semua" || p.kategori?.name === activeKategori;

    const matchSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase().trim());

    return matchKategori && matchSearch;
  });


  const handleAddCart = (item) => {
    addToCart(item);

    Swal.fire({
      icon: "success",
      title: "Ditambahkan!",
      text: `${item.name} masuk keranjang`,
      timer: 1200,
      showConfirmButton: false,
    });
  };

 
  const handleBuyNow = (item) => {
    addToCart(item);
    navigate("/cart");
  };

  return (
    <div className="landing">

      <div className="hero">
        <div className="hero-text">
          <h1>Belanja Game Murah</h1>
          <p>Game original harga terbaik</p>
        </div>

        <button onClick={() => navigate("/cart")}>Lihat Cart</button>
      </div>

      <div className="kategori">
        <button
          className={activeKategori === "Semua" ? "active" : ""}
          onClick={() => setActiveKategori("Semua")}
        >
          Semua
        </button>

        {kategori.map((k) => (
          <button
            key={k.id}
            className={activeKategori === k.name ? "active" : ""}
            onClick={() => setActiveKategori(k.name)}
          >
            {k.name}
          </button>
        ))}
      </div>

     
      {loading ? (
        <p>Loading...</p>
      ) : filteredProduk.length === 0 ? (
        <p className="empty">Produk tidak ditemukan</p>
      ) : (
        <div className="produk-container">
          {filteredProduk.map((item) => (
            <div className="card-produk" key={item.id}>
              <img
                src={
                  item.image
                    ? `${import.meta.env.VITE_API_URL}/uploads/${item.image}`
                    : "https://picsum.photos/300/200"
                }
                alt={item.name}
                loading="lazy"
              />

              <div className="card-body">
                <small>{item.kategori?.name}</small>
                <h4>{item.name}</h4>
                <p>Stok: {item.stok}</p>
                <h3>Rp {Number(item.price || 0).toLocaleString("id-ID")}</h3>

              
                <div className="btn-group">
                  <button
                    className="btn-outline"
                    onClick={() => handleAddCart(item)}
                  >
                    + Keranjang
                  </button>

                  <button
                    className="btn-primary"
                    onClick={() => handleBuyNow(item)}
                  >
                    Beli
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
