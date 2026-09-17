import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat/WhatsAppFloat";
import BackToTop from "./components/BackToTop/BackToTop";

import Gallery from "./pages/Gallery/Gallery";

import Gate from "./components/Gate/Gate";
import Home from "./components/pages/Home/Home";
import RendezVous from "./components/RendezVous/RendezVous";
import Services from "./pages/Services/Services";
import Apropos from "./components/Apropos/Apropos";
import Contact from "./components/Contact/Contact";
import Admin from "./components/Admin/Admin";
import NotFound from "./components/Notfound/Notfound";

function ClientRoute({ children }) {
  const ok = localStorage.getItem("client_profile") === "1";
  return ok ? children : <Navigate to="/" replace />;
}

function AdminRoute({ children }) {
  const ok = localStorage.getItem("admin_authed") === "1";
  return ok ? children : <Navigate to="/" replace />;
}

export default function App() {
  const [isClient, setIsClient] = useState(
    localStorage.getItem("client_profile") === "1"
  );

  useEffect(() => {
    const sync = () => {
      setIsClient(localStorage.getItem("client_profile") === "1");
    };

    window.addEventListener("authchange", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("authchange", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <>
      {isClient && <Navbar />}

      <main className="container sectionPad">
        <Routes>
          <Route path="/" element={<Gate />} />

          <Route
            path="/site"
            element={
              <ClientRoute>
                <Home />
              </ClientRoute>
            }
          />
          <Route
            path="/site/rendezvous"
            element={
              <ClientRoute>
                <RendezVous />
              </ClientRoute>
            }
          />
          <Route
            path="/site/services"
            element={
              <ClientRoute>
                <Services />
              </ClientRoute>
            }
          />
          <Route
            path="/site/apropos"
            element={
              <ClientRoute>
                <Apropos />
              </ClientRoute>
            }
          />
          <Route
            path="/site/contact"
            element={
              <ClientRoute>
                <Contact />
              </ClientRoute>
            }
          />

          <Route
  path="/site/gallery"
  element={
    <ClientRoute>
      <Gallery />
    </ClientRoute>
  }
/>


          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {isClient && <Footer />}
      {isClient && <WhatsAppFloat />}
      {isClient && <BackToTop />}
    </>
  );
}
