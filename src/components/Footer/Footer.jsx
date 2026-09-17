import "./Footer.css";
export default function Footer(){
  return (
    <footer className="foot">
      <div className="container footIn">
        <div>
          <strong>Clinique Dentaire Sourire</strong>
          <p>Soins modernes • Hygiène • Confort</p>
        </div>
        <div>
          <strong>Horaires</strong>
          <p>Lun–Sam: 09:00–19:00</p>
          <p>Dimanche: Fermé</p>
        </div>
        <div>
          <strong>Contact</strong>
          <p>06 12 34 56 78</p>
          <p>contact@clinique.ma</p>
        </div>
      </div>
      <div className="copy">© {new Date().getFullYear()} Clinique Dentaire</div>
    </footer>
  );
}
