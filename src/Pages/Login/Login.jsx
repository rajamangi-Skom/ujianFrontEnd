import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data);

    
    const token =
      res.data.token ||
      res.data.data?.token ||
      res.data.data?.tokens?.accessToken;

    const user =
      res.data.data?.user ||
      res.data.data ||
      res.data.user;

    if (!token) {
      alert("Token tidak ditemukan!");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

   
    if (user.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/landing");
    }
  } catch (error) {
    console.log(error.response?.data || error.message);
    alert(error.response?.data?.message || "Login gagal");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <video autoPlay loop muted playsInline className="bg-video">
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="login-container">
        <div className="login-left">
          <video autoPlay loop muted playsInline className="side-video">
            <source src="/pageForm.mp4" type="video/mp4" />
          </video>
        </div>

        <form className="login-right" onSubmit={handleLogin}>
          <h2>Login</h2>

          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
