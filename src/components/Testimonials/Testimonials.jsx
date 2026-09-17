import "./Testimonials.css";
import { testimonials } from "../../data/testimonials";

function Stars({ n }) {
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "on" : ""}>★</span>
      ))}
    </div>
  );
}

function Avatar({ name }) {
  const initials = name.split(" ").slice(0, 2).map(s => s[0]).join("").toUpperCase();
  return <div className="avatar">{initials}</div>;
}

export default function Testimonials() {
  return (
    <section className="tWrap fadeIn">
      <div className="tHead">
        <h2>Avis des patients</h2>
        <p>آراء حقيقية كتعطي الثقة فـ الخدمة ديالنا.</p>
      </div>

      <div className="tGrid">
        {testimonials.map((t) => (
          <article className="tCard" key={t.name + t.date}>
            <div className="tTop">
              <Avatar name={t.name} />
              <div>
                <div className="tName">{t.name}</div>
                <div className="tMeta">
                  <Stars n={t.rating} />
                  <span className="tDate">{t.date}</span>
                </div>
              </div>
            </div>

            <p className="tText">“{t.text}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}
