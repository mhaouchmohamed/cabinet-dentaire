import { useEffect, useMemo, useState } from "react";
import "./Admin.css";

const LS_KEY = "appointments_v1";
const ADMIN_PASS = "admin123"; // بدلها بكلمة سر ديالك

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

  // ✅ جديد
  const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD
  const [sortBy, setSortBy] = useState("newest");   // newest | oldest

  useEffect(() => {
    const ok = localStorage.getItem("admin_authed") === "1";
    setAuthed(ok);

    const raw = localStorage.getItem(LS_KEY);
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  function setLS(next) {
    setItems(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  function login(e) {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      setAuthed(true);
      localStorage.setItem("admin_authed", "1");
      setPass("");
    } else {
      alert("Mot de passe incorrect");
    }
  }

  function logout() {
  // باش Gate ما يديرش redirect تلقائي
  sessionStorage.setItem("skip_gate_redirect", "1");

  // مسح session ديال admin
  localStorage.removeItem("admin_authed");
  localStorage.removeItem("role");

  // باش App يعرف و يحدّث UI
  window.dispatchEvent(new Event("authchange"));

  // مشي للـ Gate
  window.location.href = "/";
}


  function updateStatus(id, status) {
    const next = items.map((x) => (x.id === id ? { ...x, status } : x));
    setLS(next);
  }

  function remove(id) {
    if (!window.confirm("Supprimer ce rendez-vous ?")) return;
    setLS(items.filter((x) => x.id !== id));
  }

  // ✅ جديد: Export JSON
  function exportJSON() {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rendezvous.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const stats = useMemo(() => {
    const total = items.length;
    const confirmed = items.filter((x) => x.status === "Confirmé").length;
    const pending = items.filter((x) => !x.status || x.status === "En attente").length;
    const canceled = items.filter((x) => x.status === "Annulé").length;
    return { total, confirmed, pending, canceled };
  }, [items]);

  // ✅ مكمّل: فلترة + date + sort
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();

    let arr = items.filter((x) => {
      const st = x.status || "En attente";
      const okStatus = statusFilter === "Tous" ? true : st === statusFilter;

      const okDate = dateFilter ? x.date === dateFilter : true;

      const blob = `${x.name} ${x.phone} ${x.email || ""} ${x.service} ${x.date} ${x.time} ${x.message || ""}`.toLowerCase();
      const okText = text ? blob.includes(text) : true;

      return okStatus && okText && okDate;
    });

    arr.sort((a, b) => {
      const A = `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`);
      return sortBy === "oldest" ? A : -A;
    });

    return arr;
  }, [items, q, statusFilter, dateFilter, sortBy]);

  if (!authed) {
    return (
      <div className="admin">
        <h1 className="aTitle">Admin</h1>
        <p className="aSub">Connectez-vous pour gérer les rendez-vous.</p>

        <form className="loginBox" onSubmit={login}>
          <label>Mot de passe</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
          />
          <button className="btn" type="submit">Se connecter</button>
          <p className="hint">
            Test: <b>admin123</b> (بدّلها فالكود)
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="topBar">
        <div>
          <h1 className="aTitle">Tableau de bord</h1>
          <p className="aSub">Gestion des demandes de rendez-vous</p>
        </div>
        <button className="btn2" onClick={logout} type="button">
          Se déconnecter
        </button>
      </div>

      <div className="stats">
        <div className="stat"><span>Total</span><b>{stats.total}</b></div>
        <div className="stat"><span>En attente</span><b>{stats.pending}</b></div>
        <div className="stat"><span>Confirmés</span><b>{stats.confirmed}</b></div>
        <div className="stat"><span>Annulés</span><b>{stats.canceled}</b></div>
      </div>

      {/* ✅ Filters upgraded */}
      <div className="filters">
        <input
          className="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher (nom, téléphone, service...)"
        />

        <input
          className="select"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          title="Filtrer par date"
        />

        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Tous">Tous</option>
          <option value="En attente">En attente</option>
          <option value="Confirmé">Confirmé</option>
          <option value="Annulé">Annulé</option>
        </select>

        <select
          className="select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          title="Tri"
        >
          <option value="newest">Plus récents</option>
          <option value="oldest">Plus anciens</option>
        </select>

        <button className="btn2" type="button" onClick={exportJSON}>
          Export JSON
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Aucun rendez-vous.</div>
      ) : (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Service</th>
                <th>Date</th>
                <th>Contact</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((x) => {
                const st = x.status || "En attente";
                return (
                  <tr key={x.id}>
                    <td>
                      <div className="pname">{x.name}</div>
                      {x.message && <div className="pmsg">“{x.message}”</div>}
                    </td>
                    <td>{x.service}</td>
                    <td>
                      <b>{x.date}</b>
                      <div className="muted">{x.time}</div>
                    </td>
                    <td>
                      <div>{x.phone}</div>
                      <div className="muted">{x.email || "—"}</div>
                    </td>
                    <td>
                      <span className={`badge ${badgeClass(st)}`}>{st}</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="small" onClick={() => updateStatus(x.id, "Confirmé")} type="button">
                          Confirmer
                        </button>
                        <button className="small gray" onClick={() => updateStatus(x.id, "En attente")} type="button">
                          En attente
                        </button>
                        <button className="small warn" onClick={() => updateStatus(x.id, "Annulé")} type="button">
                          Annuler
                        </button>
                        <button className="small danger" onClick={() => remove(x.id)} type="button">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function badgeClass(st) {
  if (st === "Confirmé") return "ok";
  if (st === "Annulé") return "bad";
  return "wait";
}
