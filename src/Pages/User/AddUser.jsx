import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Kategori/AddKategori.css";

const AddUser = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/create`,
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
          global: error.response?.data?.msg || "Gagal Menyimpan User",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-add-page">
      <div className="user-add-header">
        <h3>Tambah User</h3>
      </div>

      <form onSubmit={handleSubmit} className="form-wrapper">
   
        <div className="form-group">
          <label>Nama</label>
          <input
            type="text"
            placeholder="Nama user"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </div>

        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {errors.email && <small className="error">{errors.email}</small>}
        </div>

     
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {errors.password && (
            <small className="error">{errors.password}</small>
          )}
        </div>

      
        <div className="form-group">
          <label>Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

      
        {errors.global && <small className="error">{errors.global}</small>}

       
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

export default AddUser;
