import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function IconHome() {
  return (
    <svg className="navSvg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg className="navSvg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4 8h16M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function Tooth(){ return <span className="logoIcon">🦷</span>; }

export default function Navbar() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  function logoutClient() {
    sessionStorage.setItem("skip_gate_redirect", "1");
    localStorage.removeItem("client_profile");
    localStorage.removeItem("client_info");
    localStorage.removeItem("role");
    localStorage.removeItem("admin_authed");
    window.dispatchEvent(new Event("authchange"));
    nav("/");
  }

  function close() { setOpen(false); }

  return (
    <header className="navWrap">
      <div className="container navInner">
        <div className="brand" onClick={()=>{ close(); nav("/site"); }} role="button" tabIndex={0}>
          <div className="brandCircle"><Tooth /></div>
          <span className="brandText">Clinique Dentaire</span>
        </div>

        <button className="burger" type="button" onClick={() => setOpen(v => !v)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>

        <nav className={`navLinks ${open ? "open" : ""}`} aria-label="Navigation">
          <NavLink onClick={close} to="/site" className={({isActive}) => `navLink ${isActive ? "active":""}`}>
            <IconHome /><span>Accueil</span>
          </NavLink>

          <NavLink onClick={close} to="/site/services" className={({isActive}) => `navLink ${isActive ? "active":""}`}>
            <span>Services</span>
          </NavLink>

          <NavLink onClick={close} to="/site/apropos" className={({isActive}) => `navLink ${isActive ? "active":""}`}>
            <span>À propos</span>
          </NavLink>

          <NavLink onClick={close} to="/site/contact" className={({isActive}) => `navLink ${isActive ? "active":""}`}>
            <span>Contact</span>
          </NavLink>

          <NavLink
  to="/site/gallery"
  className={({isActive}) => `navLink ${isActive ? "active":""}`}
>
  Gallery
</NavLink>


          <NavLink onClick={close} to="/site/rendezvous" className="navBtn">
            <IconCalendar /><span>Rendez-vous</span>
          </NavLink>

          <button className="navLink" type="button" onClick={() => { close(); logoutClient(); }}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
