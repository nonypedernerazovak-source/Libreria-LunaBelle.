import {
    agregarAlCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    vaciarCarrito,
    calcularTotal,
    calcularCantidadTotal,
    obtenerCarrito
} from "./carrito.js";

import {
    formatearPrecio,
    mostrarToast,
    mostrarCarga,
    crearTarjetaLibro,
    crearItemCarrito
} from "./ui.js";

const listaLibros = document.querySelector("#listaLibros");
const listaCarrito = document.querySelector("#listaCarrito");
const contadorCarrito = document.querySelector("#contadorCarrito");
const totalCarrito = document.querySelector("#totalCarrito");

const buscador = document.querySelector("#buscador");
const filtroCategoria = document.querySelector("#filtroCategoria");

const estadoCarga = document.querySelector("#estadoCarga");
const mensajeError = document.querySelector("#mensajeError");
const btnReintentar = document.querySelector("#btnReintentar");

const btnVaciarCarrito = document.querySelector("#btnVaciarCarrito");
const btnConfirmarCompra = document.querySelector("#btnConfirmarCompra");
const btnCarrito = document.querySelector("#btnCarrito");

const seccionCarrito = document.querySelector("#seccionCarrito");

let libros = [];

async function cargarLibros() {
    mostrarCarga(estadoCarga, true);
    mensajeError.classList.add("oculto");

    try {
        const respuesta = await fetch("./data/libros.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el catálogo.");
        }

        libros = await respuesta.json();

        cargarCategorias();
        renderizarLibros(libros);

    } catch (error) {
        listaLibros.innerHTML = "";
        mensajeError.classList.remove("oculto");
    } finally {
        mostrarCarga(estadoCarga, false);
    }
}

function cargarCategorias() {
    filtroCategoria.innerHTML = `
        <option value="todas">Todas</option>
    `;

    const categorias = [
        ...new Set(libros.map(libro => libro.categoria))
    ];

    categorias.forEach(categoria => {
        const opcion = document.createElement("option");

        opcion.value = categoria;
        opcion.textContent = categoria;

        filtroCategoria.appendChild(opcion);
    });
}

function renderizarLibros(librosMostrar) {
    listaLibros.innerHTML = "";

    if (librosMostrar.length === 0) {
        listaLibros.innerHTML = `
            <div class="sin-resultados">
                <span>🔎</span>
                <h3>No encontramos libros</h3>
                <p>Probá con otro título, autor o categoría.</p>
            </div>
        `;

        return;
    }

    librosMostrar.forEach(libro => {
        const tarjeta = crearTarjetaLibro(libro);

        listaLibros.appendChild(tarjeta);
    });
}

function aplicarFiltros() {
    const textoBuscado = buscador.value.toLowerCase().trim();
    const categoriaSeleccionada = filtroCategoria.value;

    const resultados = libros.filter(libro => {
        const coincideTexto =
            libro.titulo.toLowerCase().includes(textoBuscado) ||
            libro.autor.toLowerCase().includes(textoBuscado);

        const coincideCategoria =
            categoriaSeleccionada === "todas" ||
            libro.categoria === categoriaSeleccionada;

        return coincideTexto && coincideCategoria;
    });

    renderizarLibros(resultados);
}

function renderizarCarrito() {
    const carrito = obtenerCarrito();

    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `
            <div class="carrito-vacio">
                <span>🛒</span>
                <h3>Tu carrito está vacío</h3>
                <p>Agregá un libro para comenzar tu compra.</p>
            </div>
        `;
    } else {
        carrito.forEach(item => {
            const elemento = crearItemCarrito(item);

            listaCarrito.appendChild(elemento);
        });
    }

    actualizarResumen();
}

function actualizarResumen() {
    const cantidad = calcularCantidadTotal();
    const total = calcularTotal();

    contadorCarrito.textContent = cantidad;
    totalCarrito.textContent = formatearPrecio(total);

    btnVaciarCarrito.disabled = cantidad === 0;
    btnConfirmarCompra.disabled = cantidad === 0;
}

function procesarAgregar(id) {
    const libro = libros.find(item => item.id === id);

    if (!libro) {
        return;
    }

    const carritoActual = obtenerCarrito();

    const productoEnCarrito = carritoActual.find(
        item => item.id === id
    );

    if (productoEnCarrito && productoEnCarrito.cantidad >= libro.stock) {
        mostrarToast(
            "No hay más unidades disponibles de este libro.",
            "error"
        );

        return;
    }

    agregarAlCarrito(libro);
    renderizarCarrito();

    mostrarToast(
        `${libro.titulo} fue agregado al carrito.`,
        "exito"
    );
}

function procesarConfirmacion() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        mostrarToast(
            "Tu carrito está vacío.",
            "error"
        );

        return;
    }

    const total = calcularTotal();

    mostrarToast(
        `Compra confirmada por ${formatearPrecio(total)}. ¡Gracias por tu compra y por elegirnos!`,
        "exito"
    );

    vaciarCarrito();
    renderizarCarrito();
}

listaLibros.addEventListener("click", event => {
    const botonAgregar = event.target.closest(".btn-agregar");

    if (!botonAgregar) {
        return;
    }

    const id = Number(botonAgregar.dataset.id);

    procesarAgregar(id);
});

listaCarrito.addEventListener("click", event => {
    const botonSumar = event.target.closest(".btn-sumar");
    const botonRestar = event.target.closest(".btn-restar");
    const botonEliminar = event.target.closest(".btn-eliminar");

    if (botonSumar) {
        const id = Number(botonSumar.dataset.id);

        aumentarCantidad(id);
        renderizarCarrito();
    }

    if (botonRestar) {
        const id = Number(botonRestar.dataset.id);

        disminuirCantidad(id);
        renderizarCarrito();
    }

    if (botonEliminar) {
        const id = Number(botonEliminar.dataset.id);

        eliminarProducto(id);
        renderizarCarrito();

        mostrarToast(
            "Producto eliminado del carrito.",
            "info"
        );
    }
});

buscador.addEventListener("input", aplicarFiltros);

filtroCategoria.addEventListener("change", aplicarFiltros);

btnVaciarCarrito.addEventListener("click", () => {
    vaciarCarrito();
    renderizarCarrito();

    mostrarToast(
        "El carrito fue vaciado.",
        "info"
    );
});

btnConfirmarCompra.addEventListener(
    "click",
    procesarConfirmacion
);

btnCarrito.addEventListener("click", () => {
    seccionCarrito.scrollIntoView({
        behavior: "smooth"
    });
});

btnReintentar.addEventListener(
    "click",
    cargarLibros
);

renderizarCarrito();
cargarLibros();
