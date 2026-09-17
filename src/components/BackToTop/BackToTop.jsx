import { useEffect, useState } from "react";
import "./BackToTop.css";

export default function BackToTop(){
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if(!show) return null;

  return (
    <button
      className="top"
      onClick={() => window.scrollTo({top:0, behavior:"smooth"})}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}
