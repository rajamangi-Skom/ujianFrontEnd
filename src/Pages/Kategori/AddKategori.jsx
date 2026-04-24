import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddKategori.css";

const AddKategori = () => {
  const navigate = useNavigate();

  const [namaKategori, setNamaKategori] = useState("");
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setGambar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("name", namaKategori);
      formData.append("gambar", gambar);

      await axios.post(`${import.meta.env.VITE_API_URL}/kategori/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(-1);
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
          global: error.response?.data?.msg || "Gagal Menyimpan",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kategori-add-page">
      <div className="kategori-add-header">
        <h3>Tambah Kategori</h3>
      </div>

      <form onSubmit={handleSubmit} className="form-wrapper">
        <div className="form-group">
          <label>Nama Kategori</label>
          <input
            type="text"
            placeholder="Contoh: Game Konsol"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            required
          />
          {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
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

          {errors.global && (
            <small style={{ color: "red" }}>{errors.global}</small>
          )}
        </div>

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

export default AddKategori;
