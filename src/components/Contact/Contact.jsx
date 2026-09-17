import { useState } from "react";
import "./Contact.css";

export default function Contact(){
  const [form, setForm] = useState({name:"", email:"", message:""});
  const [ok, setOk] = useState("");

  function handleChange(e){
    setForm(prev => ({...prev, [e.target.name]: e.target.value}));
  }
  function submit(e){
    e.preventDefault();
    if(!form.name || !form.email || !form.message) return;
    setOk("✅ Message envoyé. Merci !");
    setForm({name:"", email:"", message:""});
  }

  return (
    <div>
      <h1 className="pTitle">Contact</h1>
      <p className="pSub">Appelez-nous ou envoyez un message.</p>

      <div className="cgrid">
        <div className="info">
          <h3>Clinique Dentaire Sourire</h3>
          <p>📍 Casablanca, Maroc (adresse placeholder)</p>
          <p>📞 06 12 34 56 78</p>
          <p>✉️ contact@clinique.ma</p>
          <div className="map">
  <iframe
    title="Google Map"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps?q=Casablanca%20Maroc&output=embed"
  />
</div>

        </div>

        <form className="cform" onSubmit={submit}>
          {ok && <div className="ok">{ok}</div>}
          <div className="field">
            <label>Nom</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows="5" required />
          </div>
          <button className="btn">Envoyer</button>
        </form>
      </div>
    </div>
  );
}
