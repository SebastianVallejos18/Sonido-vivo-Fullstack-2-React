function Title(props) {
    const Etiqueta = props.level || "h2";

    return (
        <Etiqueta className={props.className}>
            {props.text}
        </Etiqueta>
    );
}

export default Title;