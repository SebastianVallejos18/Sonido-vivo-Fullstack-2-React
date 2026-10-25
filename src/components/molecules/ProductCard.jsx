import { useState } from "react";
import { Link } from "react-router-dom";
import Image from "../atoms/Image";
import Title from "../atoms/Title";
import "./ProductCard.css";

function ProductCard(props) {
    const [agregado, setAgregado] = useState(false);

    function handleAgregar() {
        setAgregado(true);
        if (props.onAdd) {
            props.onAdd();
        }
    }

    return (
        <article className="product-card h-100">
            <Image src={props.image} alt={props.alt} />
            <Title level="h3" className={props.className} text={props.text} />
            <p className="product-price">{props.price}</p>

            {props.oldPrice ? (
                <p className="small mb-2">
                    <s className="text-muted">{props.oldPrice}</s>{" "}
                    <span className="badge bg-danger">-{props.discount}%</span>
                </p>
            ) : null}

            <p className="product-description">{props.description}</p>

            {props.detailTo ? (
                <Link
                    to={props.detailTo}
                    className="d-block mb-2"
                    aria-label={"Ver detalle de " + props.text}
                >
                    Ver detalle
                </Link>
            ) : null}

            {props.showButton ? (
                <div>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAgregar}
                    >
                        Agregar al carrito
                    </button>
                    {agregado ? (
                        <span className="d-block small text-success mt-1">
                            ¡Producto agregado!
                        </span>
                    ) : null}
                </div>
            ) : null}
        </article>
    );
}

export default ProductCard;