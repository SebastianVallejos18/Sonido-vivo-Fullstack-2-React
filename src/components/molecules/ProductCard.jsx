import Image from "../atoms/Image";
import Title from "../atoms/Title";
import "./ProductCard.css";

function ProductCard(props) {
    return (
        <article className="product-card h-100">
            <Image src={props.image} alt={props.alt} />
            <Title level="h3" className={props.className} text={props.text} />
            <p className="product-price">{props.price}</p>
            <p className="product-description">{props.description}</p>
        </article>
    );
}

export default ProductCard;