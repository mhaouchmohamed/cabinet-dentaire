import { Link } from "react-router-dom";
export default function NotFound(){
  return (
    <div style={{textAlign:"center", padding:"60px 0"}}>
      <h1 style={{margin:0, fontSize:48}}>404</h1>
      <p style={{color:"var(--muted)"}}>Page introuvable</p>
      <Link to="/" style={{fontWeight:900}}>Retour à l’accueil</Link>
    </div>
  );
}
