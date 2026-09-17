import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero fadeIn">

      <div className="heroContent">
        <h1>Votre sourire, notre priorité</h1>

        <p>
          Soins dentaires modernes, équipe professionnelle,
          confort garanti.
        </p>

        <div className="heroBtns">
          <Link to="/site/rendezvous" className="btnMain">
            Prendre rendez-vous
          </Link>

          <Link to="/site/services" className="btnLight">
            Voir services
          </Link>
        </div>
      </div>

    </section>
  );
}
