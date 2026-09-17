import { useState } from "react";
import "./Faq.css";

const FAQ = [
  { q:"Faut-il prendre rendez-vous ?", a:"Oui, pour mieux organiser les consultations. Urgences possibles." },
  { q:"Quels sont vos horaires ?", a:"Lundi à samedi (09:00–19:00). Dimanche fermé." },
  { q:"Proposez-vous le blanchiment ?", a:"Oui, après un diagnostic pour choisir la meilleure méthode." },
  { q:"Acceptez-vous les urgences ?", a:"Oui, contactez-nous par téléphone/WhatsApp en priorité." },
  { q:"Quels moyens de paiement ?", a:"Espèces et carte (selon disponibilité). Demandez à l’accueil." },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq">
      <h2 className="title">FAQ</h2>
      <div className="faqBox">
        {FAQ.map((it, i) => (
          <button
            key={it.q}
            className={`faqItem ${open === i ? "on" : ""}`}
            onClick={() => setOpen(open === i ? -1 : i)}
            type="button"
          >
            <span className="faqQ">{it.q}</span>
            <span className="faqPlus">{open === i ? "−" : "+"}</span>
            {open === i && <div className="faqA">{it.a}</div>}
          </button>
        ))}
      </div>
    </section>
  );
}
