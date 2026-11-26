import { Navigate, useLocation } from "react-router-dom";
import { obtenerSesion } from "../../services/authService";
import { destinoSegunSesion } from "../../utils/rutas";

// props.roles: arreglo de roles permitidos, ej. ["ADMIN"]
// props.pagina: el componente que se muestra si el usuario tiene permiso
function RutaProtegida(props) {
  const ubicacion = useLocation();
  const destino = destinoSegunSesion(obtenerSesion(), props.roles);

  if (destino) {
    return <Navigate to={destino} replace state={{ desde: ubicacion.pathname }} />;
  }
  return props.pagina;
}

export default RutaProtegida;