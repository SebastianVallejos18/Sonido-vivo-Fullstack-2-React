const categorias = [
  {
    id: "guitarras-acusticas",
    titulo: "Guitarras Acústicas",
    productos: [
      { nombre: "Guitarra Acústica Folk", imagen: "/guitarra.jpeg", precio: "$129.990", descripcion: "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes." },
      { nombre: "Guitarra Acústica Dreadnought", imagen: "/guitarra.jpeg", precio: "$189.990", descripcion: "Tapa de abeto macizo, brazo de caoba. Sonido cálido y proyectado." },
      { nombre: "Guitarra Acústica Clásica 4/4", imagen: "/guitarra.jpeg", precio: "$89.990", descripcion: "Nailon, tapa de abeto. Ideal para estudio y flamenco." },
      { nombre: "Guitarra Electroacústica", imagen: "/guitarra.jpeg", precio: "$349.990", descripcion: "Pickup integrado, afinador incorporado." },
      { nombre: "Guitarra 3/4 Niños", imagen: "/guitarra.jpeg", precio: "$79.990", descripcion: "Tamaño reducido para niños de 6 a 10 años." },
    ],
  },
  {
    id: "guitarras-electricas",
    titulo: "Guitarras Eléctricas",
    productos: [
      { nombre: "Guitarra Eléctrica Stratocaster", imagen: "/guitarra.jpeg", precio: "$249.990", descripcion: "Cuerpo de álamo, mástil de arce, pastillas SSS." },
      { nombre: "Guitarra Eléctrica Les Paul", imagen: "/guitarra.jpeg", precio: "$329.990", descripcion: "Cuerpo caoba, tapa arce, pastillas humbucker." },
      { nombre: "Guitarra Eléctrica SG", imagen: "/guitarra.jpeg", precio: "$319.990", descripcion: "Cuerpo caoba, mástil caoba, 2 humbuckers." },
      { nombre: "Guitarra Eléctrica Telecaster", imagen: "/guitarra.jpeg", precio: "$239.990", descripcion: "Cuerpo álamo, clavijero vintage, 2 pastillas single." },
      { nombre: "Guitarra Eléctrica Semi-hollow", imagen: "/guitarra.jpeg", precio: "$549.990", descripcion: "Semi-hueca, 2 humbuckers, ideal para jazz y blues." },
    ],
  },
  {
    id: "bajos-electricos",
    titulo: "Bajos Eléctricos",
    productos: [
      { nombre: "Bajo Eléctrico 4 Cuerdas", imagen: "/bajo.jpeg", precio: "$299.990", descripcion: "Pickup PJ, cuerpo álamo, mástil arce." },
      { nombre: "Bajo Eléctrico Jazz Bass", imagen: "/bajo.jpeg", precio: "$699.990", descripcion: "Alder body, 2 Alnico V Jazz single-coil." },
      { nombre: "Bajo Acústico 4 Cuerdas", imagen: "/bajo.jpeg", precio: "$429.990", descripcion: "Electroacústico, afinador incorporado." },
    ],
  },
  {
    id: "baterias",
    titulo: "Baterías",
    productos: [
      { nombre: "Batería Acústica 5 piezas", imagen: "/bateria.jpeg", precio: "$599.990", descripcion: "Incluye stands, platillos y pedal de bombo." },
      { nombre: "Batería Electrónica 8 pads", imagen: "/bateria.jpeg", precio: "$799.990", descripcion: "Módulo TD-02, 8 pads de goma, pedal hi-hat." },
      { nombre: "Caja Snare 14", imagen: "/bateria.jpeg", precio: "$89.990", descripcion: "Acero, 14x5, 10 tensores." },
      { nombre: "Platillo Hi-Hat 14", imagen: "/bateria.jpeg", precio: "$149.990", descripcion: "Latón B20, sonido brillante y claro." },
      { nombre: "Platillo Crash 16", imagen: "/bateria.jpeg", precio: "$129.990", descripcion: "Latón B20, ataque rápido." },
    ],
  },
  {
    id: "teclados-y-pianos",
    titulo: "Teclados y Pianos",
    productos: [
      { nombre: "Teclado Digital 61 teclas", imagen: "/teclado.jpeg", precio: "$249.990", descripcion: "61 teclas sensibles al tacto, 622 voces." },
      { nombre: "Piano Digital 88 teclas", imagen: "/teclado.jpeg", precio: "$499.990", descripcion: "88 teclas pesadas, 10 voces, pedal sustain incluido." },
      { nombre: "Sintetizador 49 teclas", imagen: "/teclado.jpeg", precio: "$129.990", descripcion: "MIDI controller, 49 mini teclas." },
      { nombre: "Teclado MIDI 88 teclas", imagen: "/teclado.jpeg", precio: "$399.990", descripcion: "88 teclas martillo, sin sonidos propios." },
    ],
  },
  {
    id: "amplificadores",
    titulo: "Amplificadores",
    productos: [
      { nombre: "Amplificador Guitarra 15W", imagen: "/amplificador.jpeg", precio: "$99.990", descripcion: "15W, distorsión incorporada, entrada auxiliar." },
      { nombre: "Amplificador Guitarra 40W", imagen: "/amplificador.jpeg", precio: "$299.990", descripcion: "40W, 4 canales, efectos digitales integrados." },
      { nombre: "Amplificador Bajo 100W", imagen: "/amplificador.jpeg", precio: "$449.990", descripcion: "100W, tweeter integrado, ecualizador de 4 bandas." },
      { nombre: "Amplificador Acústico 40W", imagen: "/amplificador.jpeg", precio: "$499.990", descripcion: "60W, 2 canales, reverb y chorus incorporados." },
    ],
  },
  {
    id: "microfonos",
    titulo: "Micrófonos",
    productos: [
      { nombre: "Micrófono Dinámico Cardioide", imagen: "/microfono.jpeg", precio: "$149.990", descripcion: "Estándar industria para voz en vivo." },
      { nombre: "Micrófono Dinámico Instrumento", imagen: "/microfono.jpeg", precio: "$139.990", descripcion: "Ideal para captura de instrumentos y amplificadores." },
      { nombre: "Micrófono Condensador", imagen: "/microfono.jpeg", precio: "$199.990", descripcion: "Cardioide, XLR, ideal para grabación en estudio." },
      { nombre: "Micrófono USB de Condensador", imagen: "/microfono.jpeg", precio: "$299.990", descripcion: "USB, 4 patrones polares, ideal para streaming y podcast." },
    ],
  },
  {
    id: "pedales-de-efectos",
    titulo: "Pedales de Efectos",
    productos: [
      { nombre: "Pedal Distorsión", imagen: "/amplificador.jpeg", precio: "$79.990", descripcion: "Clásico pedal de distorsión, 3 controles." },
      { nombre: "Pedal Reverb", imagen: "/amplificador.jpeg", precio: "$179.990", descripcion: "8 modos de reverb, control de shimmer." },
      { nombre: "Pedal Multi-efectos", imagen: "/amplificador.jpeg", precio: "$349.990", descripcion: "Diseño tipo pedalboard, 8 efectos simultáneos." },
      { nombre: "Pedal Tuner Cromático", imagen: "/amplificador.jpeg", precio: "$89.990", descripcion: "Afinador cromático, indicador de tono." },
      { nombre: "Pedal Delay", imagen: "/amplificador.jpeg", precio: "$179.990", descripcion: "Delay analógico cálido, tiempo 600ms." },
      { nombre: "Pedal Overdrive", imagen: "/amplificador.jpeg", precio: "$99.990", descripcion: "Tube Screamer clásico, sonido suave y orgánico." },
    ],
  },
  {
    id: "accesorios",
    titulo: "Accesorios",
    productos: [
      { nombre: "Cuerdas Guitarra Eléctrica 09-42", imagen: "/guitarra.jpeg", precio: "$8.990", descripcion: "Juego 6 cuerdas, calibre ligero." },
      { nombre: "Cuerdas Guitarra Acústica 12-53", imagen: "/guitarra.jpeg", precio: "$10.990", descripcion: "Bronce fósforo, sonido cálido." },
      { nombre: "Cuerdas Bajo 45-105", imagen: "/bajo.jpeg", precio: "$14.990", descripcion: "Cuerdas de níquel enrollado, set 4 cuerdas." },
      { nombre: "Púas de Guitarra x10 (0.73mm)", imagen: "/uñeta.jpeg", precio: "$3.990", descripcion: "Celulosa, grosor medio." },
      { nombre: "Capotraste Guitarra", imagen: "/guitarra.jpeg", precio: "$12.990", descripcion: "Capotraste de resorte, compatible 6 cuerdas." },
      { nombre: "Afinador de Clip", imagen: "/guitarra.jpeg", precio: "$8.990", descripcion: "Afinador cromático de clip, pantalla giratoria." },
      { nombre: "Cable Instrumento 3m", imagen: "/amplificador.jpeg", precio: "$12.990", descripcion: "Cable trenzado, conectores dorados, 3 metros." },
      { nombre: "Cable Instrumento 6m", imagen: "/amplificador.jpeg", precio: "$17.990", descripcion: "Cable trenzado, conectores dorados, 6 metros." },
      { nombre: "Soporte Guitarra de Piso", imagen: "/guitarra.jpeg", precio: "$22.990", descripcion: "Soporte plegable con enganche automático." },
      { nombre: "Soporte Guitarra de Pared", imagen: "/guitarra.jpeg", precio: "$18.990", descripcion: "Montaje a pared, enganche automático." },
    ],
  },
  {
    id: "estudio-y-grabacion",
    titulo: "Estudio y Grabación",
    productos: [
      { nombre: "Interfaz de Audio 2x2 USB", imagen: "/microfono.jpeg", precio: "$149.990", descripcion: "1 entrada XLR+instrumento, 2 salidas, 24bit/192kHz." },
      { nombre: "Auriculares de Estudio", imagen: "/auriculares.jpeg", precio: "$79.990", descripcion: "Circumaurales, respuesta 15Hz-20kHz." },
      { nombre: "Auriculares de Estudio Pro", imagen: "/auriculares.jpeg", precio: "$219.990", descripcion: "Referencia de industria, sonido neutro y detailed." },
      { nombre: "Monitor de Estudio", imagen: "/parlante.jpeg", precio: "$349.990", descripcion: "Altavoz activo, respuesta plana, ideal mezcla." },
      { nombre: "Pop Filter para Micrófono", imagen: "/microfono.jpeg", precio: "$14.990", descripcion: "Doble malla, brazo flexible con clip." },
    ],
  },
];

export default categorias;