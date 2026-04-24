import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaBox } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { TfiStatsUp } from "react-icons/tfi";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [pesanan, setPesanan] = useState([]);
  const [produk, setProduk] = useState([]);
  const [users, setUsers] = useState([]);

  const [editStokId, setEditStokId] = useState(null);
  const [stokTambah, setStokTambah] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [resOrder, resProduk, resUser] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/order`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/produk`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPesanan(resOrder.data.data || []);
      setProduk(resProduk.data.data || []);
      setUsers(resUser.data.data || []);
    } catch (err) {
      console.log("Dashboard error:", err.response || err);
    }
  };

  const today = new Date();

  const formatDate = (d) => d.toISOString().split("T")[0];

  const formatLabel = (d) =>
    d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });

  const month = today.toISOString().slice(0, 7);

  const totalPendapatanBulanIni = pesanan
    .filter((p) => p.createdAt?.startsWith(month))
    .reduce((sum, p) => sum + Number(p.totalPrice || 0), 0);

  const stokMenipis = produk.filter(
    (p) => Number(p.stok) <= Number(p.minStok || 5),
  );

  const pesananTerbaru = [...pesanan]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleSimpanStok = async (produkItem) => {
    try {
      const tambahan = Number(stokTambah);

      if (!tambahan || tambahan <= 0) {
        alert("Input tidak valid!");
        return;
      }

      const newStok = produkItem.stok + tambahan;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/produk/${produkItem.id}`,
        { stok: newStok },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setEditStokId(null);
      setStokTambah("");
      fetchAll();
    } catch (err) {
      console.log("Update stok error:", err.response || err);
    }
  };

  const grafikPendapatan = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));

    const dateStr = formatDate(d);

    const dataHari = pesanan.filter((p) => p.createdAt?.startsWith(dateStr));

    return {
      tgl: formatLabel(d),
      total: dataHari.reduce((sum, p) => sum + Number(p.totalPrice || 0), 0),
    };
  });

  const grafikJumlah = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));

    const dateStr = formatDate(d);

    const dataHari = pesanan.filter((p) => p.createdAt?.startsWith(dateStr));

    return {
      tgl: formatLabel(d),
      jumlah: dataHari.length,
    };
  });

  return (
    <div className="dashboard">
      <h3>Dashboard Admin</h3>

      <div className="dashboard-cards">
        <div className="dashboard-card green">
          <TfiStatsUp />
          <div>
            <p>Pendapatan Bulan Ini</p>
            <h4>Rp {totalPendapatanBulanIni.toLocaleString("id-ID")}</h4>
          </div>
        </div>

        <div className="dashboard-card orange">
          <FaUsers />
          <div>
            <p>Total User</p>
            <h4>{users.length}</h4>
          </div>
        </div>

        <div className="dashboard-card red">
          <IoIosWarning />
          <div>
            <p>Stok Menipis</p>
            <h4>{stokMenipis.length}</h4>
          </div>
        </div>

        <div className="dashboard-card teal">
          <FaBox />
          <div>
            <p>Total Order</p>
            <h4>{pesanan.length}</h4>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h4>Pendapatan 7 Hari</h4>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={grafikPendapatan}>
              <Line dataKey="total" strokeWidth={3} dot={{ r: 4 }} />
              <XAxis dataKey="tgl" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4>Order 7 Hari</h4>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={grafikJumlah} >
              <Bar dataKey="jumlah" fill="#00ddff"/>
              <XAxis dataKey="tgl" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div>
          <h4>Pesanan Terbaru</h4>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Tanggal</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {pesananTerbaru.map((p) => (
                  <tr key={p.id}>
                    <td>{p.user?.name || "-"}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString("id-ID")}</td>
                    <td>Rp {Number(p.totalPrice).toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4>Stok Menipis</h4>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {stokMenipis.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.stok}</td>
                    <td>
                      {editStokId === p.id ? (
                        <>
                          <input
                            type="number"
                            value={stokTambah}
                            onChange={(e) => setStokTambah(e.target.value)}
                          />
                          <button onClick={() => handleSimpanStok(p)}>
                            Simpan
                          </button>
                          <button onClick={() => setEditStokId(null)}>
                            Batal
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setEditStokId(p.id)}>
                          Tambah
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
