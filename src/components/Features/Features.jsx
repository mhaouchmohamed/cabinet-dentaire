import "./Features.css";

const FEATURES = [
  { title:"Équipe Expérimentée", text:"Des dentistes qualifiés avec plus de 15 ans d'expérience", icon:"👥", c:"blue" },
  { title:"Équipement Moderne", text:"Technologies de pointe pour des soins précis et confortables", icon:"🏅", c:"green" },
  { title:"Horaires Flexibles", text:"Ouvert du lundi au samedi pour s'adapter à votre emploi du temps", icon:"⏰", c:"yellow" },
  { title:"Urgences Dentaires", text:"Service d'urgence disponible pour vos besoins immédiats", icon:"📅", c:"red" },
];

export default function Features() {
  return (
    <section className="features">
      <div className="grid">
        {FEATURES.map(f => (
          <article className="card" key={f.title}>
            <div className={`iconCircle ${f.c}`} aria-hidden="true"><span className="icon">{f.icon}</span></div>
            <h3 className="cardTitle">{f.title}</h3>
            <p className="cardText">{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
