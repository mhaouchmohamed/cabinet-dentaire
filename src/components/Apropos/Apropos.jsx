import "./Apropos.css";

export default function Apropos(){
  return (
    <div className="about">
      <h1 className="pTitle">À propos</h1>
      <p className="pSub">Une équipe humaine, à l’écoute, orientée qualité.</p>

      <div className="abox">
        <div className="profile">
          <div className="avatar" aria-hidden="true">👨‍⚕️</div>
          <div>
            <h3>Dr. [Nom]</h3>
            <p>Chirurgien-dentiste — Soins modernes, hygiène stricte, confort du patient.</p>
          </div>
        </div>

        <div className="values">
          <div className="vcard"><strong>Hygiène</strong><p>Protocoles rigoureux et matériel stérilisé.</p></div>
          <div className="vcard"><strong>Écoute</strong><p>On explique clairement chaque étape.</p></div>
          <div className="vcard"><strong>Précision</strong><p>Technologie et gestes maîtrisés.</p></div>
        </div>
      </div>
    </div>
  );
}
