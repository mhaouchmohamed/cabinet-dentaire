import { useEffect, useMemo, useState } from "react";
import "./RendezVous.css";

const LS_KEY = "appointments_v1";

// ✅ جِيب معلومات الزبون اللي تسجلات فـ Gate
function getClientInfo() {
  try {
    return JSON.parse(localStorage.getItem("client_info") || "null");
  } catch {
    return null;
  }
}

function isEmail(v){
  if(!v) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isPhone(v){
  return /^[0-9+\s-]{8,20}$/.test(v);
}
function todayISO(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

function makeWhatsAppLink(form) {
  const phone = "212707578051"; // بدّل رقمك
  const msg =
`Bonjour, je souhaite un rendez-vous.
Nom: ${form.name || "-"}
Téléphone: ${form.phone || "-"}
Service: ${form.service || "-"}
Date: ${form.date || "-"} à ${form.time || "-"}
Message: ${form.message || "-"}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function isSunday(dateStr){
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay() === 0;
}

function slotsFor(dateStr){
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 6 = Saturday
  if(day === 6) return ["09:00","10:00","11:00","12:00"];
  return ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"];
}

export default function RendezVous() {
  // ✅ clientId اللي غادي نفلتر بيه (أفضل: phone)
  const clientInfo = getClientInfo();
  const clientId = clientInfo?.clientId || clientInfo?.phone || "";

  const [form, setForm] = useState({
    name:"", phone:"", email:"", service:"Détartrage / Nettoyage",
    date:"", time:"10:00", message:""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [items, setItems] = useState([]);

  const timeSlots = form.date ? slotsFor(form.date) : ["10:00","11:00","12:00","14:00","15:00"];

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  // ✅ (اختياري) نعمر name/phone/email تلقائيا من client_info باش ما يعاودش يكتبهم
  useEffect(() => {
    if (clientInfo) {
      setForm((prev) => ({
        ...prev,
        name: clientInfo.name || prev.name,
        phone: clientInfo.phone || prev.phone,
        email: clientInfo.email || prev.email
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setLS(next){
    setItems(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  function handleChange(e){
    const { name, value } = e.target;

    setForm(prev => {
      if(name === "date"){
        const slots = value ? slotsFor(value) : ["10:00"];
        return { ...prev, date: value, time: slots[0] };
      }
      return { ...prev, [name]: value };
    });
  }

  function validate(){
    const e = {};
    if(!form.name.trim()) e.name = "Nom obligatoire";
    if(!form.phone.trim()) e.phone = "Téléphone obligatoire";
    else if(!isPhone(form.phone)) e.phone = "Téléphone invalide";

    if(!isEmail(form.email)) e.email = "Email invalide";

    if(!form.date) e.date = "Date obligatoire";
    else if(form.date < todayISO()) e.date = "Choisir une date future";
    else if (isSunday(form.date)) e.date = "Dimanche fermé. Choisissez un autre jour.";

    return e;
  }

  async function handleSubmit(ev){
    ev.preventDefault();
    setSuccess("");

    // ✅ تأكد عندنا clientId
    if (!clientId) {
      alert("Session client invalide. رجع للصفحة الأولى وعاود دخل.");
      return;
    }

    const e = validate();
    setErrors(e);
    if(Object.keys(e).length) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    const newItem = {
      id: crypto.randomUUID(),
      ...form,
      clientId,          // ✅ مهم: باش نعرفو شكون صاحب RDV
      status: "En attente"
    };

    const next = [newItem, ...items];
    setLS(next);

    // نخلي المعلومات تبقى معبّية للزبون (اختياري) أو نفرغ غير date/time/message
    setForm((prev) => ({
      ...prev,
      service: "Détartrage / Nettoyage",
      date: "",
      time: "10:00",
      message: ""
    }));

    setLoading(false);
    setSuccess("✅ Rendez-vous envoyé ! Nous vous contacterons bientôt.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ✅ فلتر: الزبون يشوف غير RDV ديالو
  const myItems = useMemo(() => {
    return items.filter((x) =>
      (x.clientId && x.clientId === clientId) ||
      (!x.clientId && x.phone === clientId) // fallback للقديم
    );
  }, [items, clientId]);

  function remove(id){
    // ✅ يمسح من storage العام ولكن فقط اللي كيظهر للزبون ديالو
    const next = items.filter(x => x.id !== id);
    setLS(next);
  }

  return (
    <div className="rv">
      <h1 className="rvTitle">Prendre un rendez-vous</h1>
      <p className="rvSub">Remplissez le formulaire. Nous vous contacterons pour confirmer.</p>

      {success && <div className="successBox">{success}</div>}

      <div className="rvGrid">
        <form className="rvForm" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nom complet *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Ex: Mohamed Mhaouch"/>
            {errors.name && <small className="err">{errors.name}</small>}
          </div>

          <div className="field">
            <label>Téléphone *</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Ex: 06 12 34 56 78"/>
            {errors.phone && <small className="err">{errors.phone}</small>}
          </div>

          <div className="field">
            <label>Email (optionnel)</label>
            <input name="email" value={form.email} onChange={handleChange} placeholder="ex: you@email.com"/>
            {errors.email && <small className="err">{errors.email}</small>}
          </div>

          <div className="field">
            <label>Service</label>
            <select name="service" value={form.service} onChange={handleChange}>
              <option>Détartrage / Nettoyage</option>
              <option>Soins des caries</option>
              <option>Blanchiment</option>
              <option>Orthodontie</option>
              <option>Implantologie</option>
              <option>Urgences dentaires</option>
            </select>
          </div>

          <div className="two">
            <div className="field">
              <label>Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} min={todayISO()} />
              {errors.date && <small className="err">{errors.date}</small>}
            </div>

            <div className="field">
              <label>Heure</label>
              <select name="time" value={form.time} onChange={handleChange}>
                {timeSlots.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Message (optionnel)</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows="4" placeholder="Dites-nous ce que vous ressentez..."/>
          </div>

          <button className="submit" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer la demande"}
          </button>

          <a className="waBtn" href={makeWhatsAppLink(form)} target="_blank" rel="noreferrer">
            Réserver via WhatsApp
          </a>
        </form>

        <aside className="rvSide">
          <h3>Vos demandes</h3>

          {myItems.length === 0 ? (
            <p className="muted">Aucune demande pour le moment.</p>
          ) : (
            <div className="list">
              {myItems.map(x => (
                <div className="item" key={x.id}>
                  <div className="itemTop">
                    <strong>{x.name}</strong>
                    <button className="del" onClick={() => remove(x.id)} type="button">
                      Supprimer
                    </button>
                  </div>
                  <div className="meta">{x.service}</div>
                  <div className="meta">{x.date} — {x.time}</div>
                  <div className="meta">{x.phone}{x.email ? ` • ${x.email}` : ""}</div>
                  {x.message && <div className="msg">“{x.message}”</div>}
                  {x.status && <div className="meta">Statut: <b>{x.status}</b></div>}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
