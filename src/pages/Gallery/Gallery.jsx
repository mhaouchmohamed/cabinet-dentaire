import { useState } from "react";
import "./Gallery.css";

const images = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
    after: "https://images.unsplash.com/photo-1606813902914-df47c38d9f1e",
    title: "Blanchiment"
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1588776814727-5f61e4f9c4c7",
    after: "https://images.unsplash.com/photo-1629909613654-28e377c37b09",
    title: "Orthodontie"
  },
  {
    id: 3,
    before: "https://images.unsplash.com/photo-1598257006458-087169a1f08d",
    after: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe",
    title: "Implant"
  }
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="gallery">
      <h1 className="gTitle">Avant / Après</h1>
      <p className="gSub">Résultats réels de nos patients</p>

      <div className="grid">
        {images.map((img) => (
          <div className="card" key={img.id}>
            <h3>{img.title}</h3>
            <div className="imgs">
              <img src={img.before} alt="Before" onClick={()=>setSelected(img.before)} />
              <img src={img.after} alt="After" onClick={()=>setSelected(img.after)} />
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal" onClick={()=>setSelected(null)}>
          <img src={selected} alt="Zoom" />
        </div>
      )}
    </div>
  );
}
