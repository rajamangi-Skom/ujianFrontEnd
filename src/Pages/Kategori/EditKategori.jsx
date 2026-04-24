import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditKategori.css";

const EditKategori = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [namaKategori, setNamaKategori] = useState("");
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchKategoriById();
  }, []);

  const fetchKategoriById = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/kategori/cari/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNamaKategori(res.data.data.name);
      setPreview(res.data.data.gambar);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setGambar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("name", namaKategori);
      if (gambar) {
        formData.append("gambar", gambar);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/kategori/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      navigate("/dashboard/kategori");
    } catch (error) {
      console.log(error.response);

      setErrors({
        global: error.response?.data?.msg || "Gagal update kategori",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kategori-page-edit">
      <div className="kategori-header">
        <h3>Edit Kategori (Game Store)</h3>
      </div>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nama Kategori</label>
          <input
            type="text"
            value={namaKategori}
            onChange={(e) => setNamaKategori(e.target.value)}
            placeholder="Contoh: Action, RPG, FPS"
            required
          />
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

          {errors.global && <p style={{ color: "red" }}>{errors.global}</p>}
        </div>

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

export default EditKategori;
