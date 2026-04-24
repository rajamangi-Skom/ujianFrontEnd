import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../Kategori/EditKategori.css";

const EditProduk = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    fetchProdukById();
    fetchKategori();
  }, []);

  const fetchProdukById = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/produk/cari/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = res.data.data;

      setName(data.name);
      setPrice(data.price);
      setStok(data.stok);
      setKategoriId(data.kategoriId);

      setPreview(`http://localhost:3003/uploads/${data.image}`);
    } catch (error) {
      console.log("Error fetch produk:", error.response);
    } finally {
      setLoading(false);
    }
  };

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

      if (image) {
        formData.append("image", image);
      }

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/produk/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      navigate("/dashboard/produk");
    } catch (error) {
      console.log(error.response);

      setErrors({
        global: error.response?.data?.message || "Gagal update produk",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kategori-page-edit">
      <div className="kategori-header">
        <h3>Edit Produk</h3>
      </div>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nama Produk</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Harga</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Stok</label>
          <input
            type="text"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Kategori</label>
          <select
            value={kategoriId}
            onChange={(e) => setKategoriId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
            required
          >
            <option value="">-- Pilih Kategori --</option>
            {kategoriList.map((kat) => (
              <option key={kat.id} value={kat.id}>
                {kat.name}
              </option>
            ))}
          </select>
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

        {errors.global && <p style={{ color: "red" }}>{errors.global}</p>}

        <div className="btn-group">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-delete-edit"
          >
            Batal
          </button>

          <button type="submit" className="btn-update">
            {loading ? "Menyimpan..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduk;
