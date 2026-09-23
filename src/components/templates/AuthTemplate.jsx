import Header from "../organisms/Header";
import Footer from "../organisms/Footer";

function AuthTemplate(props) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-4">
        {props.content}
      </main>
      <Footer />
    </div>
  );
}

export default AuthTemplate;