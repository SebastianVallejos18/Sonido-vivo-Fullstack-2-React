
function ProductVideo() {
    return (
        <section id="video-promocional" className="mb-5">
            <h2 className="mb-4">Demostración de Productos</h2>
            <div className="ratio ratio-16x9">
                <iframe
                    src="https://www.youtube.com/embed/F6ge8PeSI_o"
                    title="Demostración de productos - Sonido Vivo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </section>
    );
}

export default ProductVideo;