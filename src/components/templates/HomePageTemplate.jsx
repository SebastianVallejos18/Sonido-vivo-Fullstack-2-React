import Footer from "../organisms/Footer";
import Header from "../organisms/Header";


function HomePageTemplate(props) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
        <main className="flex-grow-1 py-4">
          {props.content}
        </main>
      <Footer />
    </div>
  );
}

export default HomePageTemplate;