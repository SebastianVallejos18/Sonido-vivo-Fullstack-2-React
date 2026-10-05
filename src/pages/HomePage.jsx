import HomePageTemplate from "../components/templates/HomePageTemplate";
import ProductCard from "../components/molecules/ProductCard";
import ProductVideo from "../components/organisms/ProductVideo";

function HomePage() {
  return (
    <HomePageTemplate
      content={
        <div className="container">
          <section className="mb-5">
            <h2 className="mb-4">Productos destacados</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              <div className="col">
                <ProductCard
                  image="/guitarra.jpeg"
                  alt="Guitarra Acústica Folk"
                  text="Guitarra Acústica Folk"
                  price="$129.990"
                  description="Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes."
                />
              </div>
              <div className="col">
                <ProductCard
                  image="/bateria.jpeg"
                  alt="Batería Electrónica 8 pads"
                  text="Batería Electrónica 8 pads"
                  price="$799.990"
                  description="Módulo TD-02, 8 pads de goma, pedal hi-hat."
                />
              </div>
              <div className="col">
                <ProductCard
                  image="/teclado.jpeg"
                  alt="Teclado Digital 61 teclas"
                  text="Teclado Digital 61 teclas"
                  price="$249.990"
                  description="61 teclas sensibles al tacto, 622 voces."
                />
              </div>
              <div className="col">
                <ProductCard
                  image="/amplificador.jpeg"
                  alt="Pedal Reverb"
                  text="Pedal Reverb"
                  price="$179.990"
                  description="8 modos de reverb, control de shimmer."
                />
              </div>
            </div>
          </section>

          <ProductVideo />
        </div>
      }
    />
  );
}

export default HomePage;