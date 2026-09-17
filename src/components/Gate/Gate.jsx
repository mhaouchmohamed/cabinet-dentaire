import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Gate.css";

const ADMIN_PASS = "admin123"; // بدّلها

function isPhone(v) {
  return /^[0-9+\s-]{8,20}$/.test(v);
}
function isEmail(v) {
  if (!v) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function Gate() {
  const nav = useNavigate(); // ✅ لازم تجي قبل useEffect

  useEffect(() => {
    const skip = sessionStorage.getItem("skip_gate_redirect");
    if (skip === "1") {
      sessionStorage.removeItem("skip_gate_redirect");
      return;
    }

    if (localStorage.getItem("client_profile") === "1") {
      nav("/site");
      return;
    }
    if (localStorage.getItem("admin_authed") === "1") {
      nav("/admin");
    }
  }, [nav]);

  const [mode, setMode] = useState("client");

  // Client form
  const [client, setClient] = useState({ name: "", phone: "", email: "" });
  const [clientErr, setClientErr] = useState({});

  // Admin
  const [pass, setPass] = useState("");

  function handleClientChange(e) {
    setClient((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function enterClient(e) {
    e.preventDefault();

    const err = {};
    if (!client.name.trim()) err.name = "Nom obligatoire";
    if (!client.phone.trim()) err.phone = "Téléphone obligatoire";
    else if (!isPhone(client.phone)) err.phone = "Téléphone invalide";
    if (!isEmail(client.email)) err.email = "Email invalide";

    setClientErr(err);
    if (Object.keys(err).length) return;

    // ✅ زيد clientId باش RDV يبان غير ديالو
    const clientInfo = { ...client, clientId: client.phone.trim() };

    localStorage.setItem("role", "client");
    localStorage.setItem("client_profile", "1");
    localStorage.setItem("client_info", JSON.stringify(clientInfo));

    // نطفي admin
    localStorage.removeItem("admin_authed");

    window.dispatchEvent(new Event("authchange"));
    nav("/site");
  }

  function enterAdmin(e) {
    e.preventDefault();
    if (pass !== ADMIN_PASS) {
      alert("Mot de passe incorrect");
      return;
    }

    localStorage.setItem("role", "admin");
    localStorage.setItem("admin_authed", "1");

    // نطفي client
    localStorage.removeItem("client_profile");
    localStorage.removeItem("client_info");

    window.dispatchEvent(new Event("authchange"));
    nav("/admin");
  }

  function resetAll() {
    sessionStorage.setItem("skip_gate_redirect", "1");

    localStorage.removeItem("role");
    localStorage.removeItem("admin_authed");
    localStorage.removeItem("client_profile");
    localStorage.removeItem("client_info");

    window.dispatchEvent(new Event("authchange"));
    alert("Session reset ✅");
  }

  return (
    <div className="gate">
      <div className="gateCard">
        <div className="gateLogo" aria-hidden="true">🦷</div>
        <h1 className="gateTitle">Clinique Dentaire</h1>
        <p className="gateSub">Choisissez votre accès</p>

        <div className="tabs">
          <button
            className={`tab ${mode === "client" ? "on" : ""}`}
            onClick={() => setMode("client")}
            type="button"
          >
            Client
          </button>
          <button
            className={`tab ${mode === "admin" ? "on" : ""}`}
            onClick={() => setMode("admin")}
            type="button"
          >
            Admin
          </button>
        </div>

        {mode === "client" ? (
          <form className="box" onSubmit={enterClient}>
            <label className="lbl">Nom complet *</label>
            <input
              className="inp"
              name="name"
              value={client.name}
              onChange={handleClientChange}
              placeholder="Ex: Mohamed"
            />
            {clientErr.name && <small className="err">{clientErr.name}</small>}

            <label className="lbl">Téléphone *</label>
            <input
              className="inp"
              name="phone"
              value={client.phone}
              onChange={handleClientChange}
              placeholder="Ex: 06 12 34 56 78"
            />
            {clientErr.phone && <small className="err">{clientErr.phone}</small>}

            <label className="lbl">Email (optionnel)</label>
            <input
              className="inp"
              name="email"
              value={client.email}
              onChange={handleClientChange}
              placeholder="ex: you@email.com"
            />
            {clientErr.email && <small className="err">{clientErr.email}</small>}

            <button className="btnPrimary" type="submit">
              Continuer vers le site
            </button>
          </form>
        ) : (
          <form className="box" onSubmit={enterAdmin}>
            <label className="lbl">Mot de passe admin</label>
            <input
              className="inp"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
            />
            <button className="btnPrimary" type="submit">
              Accéder au dashboard
            </button>
            <p className="hint">Test: <b>admin123</b> (بدّلها)</p>
          </form>
        )}

        <button className="btnLight" type="button" onClick={resetAll}>
          Reset session
        </button>
      </div>
    </div>
  );
}
