import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import CatalogPage from "./pages/CatalogPage";
import NotFoundPage from "./pages/NotFoundPage";
import CartPage from "./pages/CartPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import OffersPage from "./pages/OffersPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SinPermisoPage from "./pages/SinPermisoPage";
import RutaProtegida from "./components/organisms/RutaProtegida";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrdersPanelPage from "./pages/OrdersPanelPage";
import ProductsAdminPage from "./pages/ProductsAdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/catalogo" element={<CatalogPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/confirmacion" element={<CheckoutPage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />
        <Route path="/ofertas" element={<OffersPage />} />
        <Route path="/admin" element={<RutaProtegida roles={["ADMIN"]} pagina={<AdminUsersPage />} />} />
        <Route path="/confirmacion" element={<RutaProtegida roles={["CLIENTE"]} pagina={<CheckoutPage />} />} />
        <Route path="/mis-pedidos" element={<RutaProtegida roles={["CLIENTE"]} pagina={<MyOrdersPage />} />} />
        <Route path="/pedidos/:id" element={<RutaProtegida pagina={<OrderDetailPage />} />} />
        <Route path="/vendedor/pedidos" element={<RutaProtegida roles={["ADMIN", "VENDEDOR"]} pagina={<OrdersPanelPage />} />} />
         <Route
          path="/gestion/productos"
          element={<RutaProtegida roles={["ADMIN", "VENDEDOR"]} pagina={<ProductsAdminPage />} />}
        />
        <Route path="/sin-permiso" element={<SinPermisoPage />} />
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;