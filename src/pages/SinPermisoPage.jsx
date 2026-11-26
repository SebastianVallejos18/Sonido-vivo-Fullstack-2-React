import { Link } from "react-router-dom";
import HomePageTemplate from "../components/templates/HomePageTemplate";

function SinPermisoPage() {
  return (
    <HomePageTemplate
      content={
        <div className="container my-5 text-center">
          <h2>Acceso restringido</h2>
          <p className="text-muted">Tu cuenta no tiene permiso para ver esta página.</p>
          <Link to="/" className="btn btn-dark">Volver al inicio</Link>
        </div>
      }
    />
  );
}

export default SinPermisoPage;