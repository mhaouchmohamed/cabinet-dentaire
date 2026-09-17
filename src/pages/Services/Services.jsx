import { services } from "../../data/services";
import "./Services.css";

export default function Services(){
  return (
    <div className="services fadeIn">

      <h1>Nos Services</h1>

      <div className="cards">
        {services.map((s,i)=>(
          <div className="card" key={i}>
            <div className="icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
