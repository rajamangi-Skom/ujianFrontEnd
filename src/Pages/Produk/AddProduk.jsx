import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Kategori/AddKategori.css";

const AddProduk = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stok, setStok] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [kategoriList, setKategoriList] = useState([]);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/kategori`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setKategoriList(res.data.data || []);
    } catch (error) {
      console.error("Error fetch kategori:", error);
    }
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stok", stok);
      formData.append("kategoriId", kategoriId);
      formData.append("image", image);

      await axios.post(`${import.meta.env.VITE_API_URL}/produk/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/dashboard/produk");
    } catch (error) {
      console.log(error.response);

      const apiErrors = error.response?.data?.errors || [];

      if (apiErrors.length > 0) {
        const errorPerField = {};
        apiErrors.forEach((e) => {
          errorPerField[e.path] = e.msg;
        });
        setErrors(errorPerField);
      } else {
        setErrors({
          global: error.response?.data?.msg || "Gagal menyimpan produk",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kategori-add-page">
      <div className="kategori-add-header">
        <h3>Tambah Produk</h3>
      </div>

      <form onSubmit={handleSubmit} className="form-wrapper">
      
        <div className="form-group">
          <label>Nama Produk</label>
          <input
            type="text"
            placeholder="Contoh: Game PS5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
        </div>

        
        <div className="form-group">
          <label>Harga</label>
          <input
            type="number"
            placeholder="Contoh: 500000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          />
          {errors.price && (
            <small style={{ color: "red" }}>{errors.price}</small>
          )}
        </div>

      
        <div className="form-group">
          <label>Stok</label>
          <input
            type="number"
            placeholder="Contoh: 10"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          />
          {errors.stok && <small style={{ color: "red" }}>{errors.stok}</small>}
        </div>

       
        <div className="form-group">
          <label>Kategori</label>
          <select
            value={kategoriId}
            onChange={(e) => setKategoriId(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          >
            <option value="">-- Pilih Kategori --</option>
            {kategoriList.map((kat) => (
              <option key={kat.id} value={kat.id}>
                {kat.name}
              </option>
            ))}
          </select>
          {errors.kategoriId && (
            <small style={{ color: "red" }}>{errors.kategoriId}</small>
          )}
        </div>

        
        <div className="form-group">
          <label>Gambar</label>
          <input type="file" accept="image/*" onChange={handleChangeImage} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              width="200"
              style={{ marginTop: "10px", borderRadius: "10px" }}
            />
          )}
        </div>

      
        {errors.global && (
          <small style={{ color: "red" }}>{errors.global}</small>
        )}

        
        <div className="btn-group">
          <button
            type="button"
            className="btn-delete-add"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Batal
          </button>

          <button type="submit" className="btn-simpan" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduk;
