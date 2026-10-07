export function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(precio);
}

export function mostrarToast(mensaje, tipo = "info") {
    const estilos = {
        exito: "linear-gradient(to right, #43a047, #66bb6a)",
        error: "linear-gradient(to right, #e53935, #ef5350)",
        info: "linear-gradient(to right, #8e24aa, #ba68c8)"
    };

    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: estilos[tipo] || estilos.info
        }
    }).showToast();
}

export function mostrarCarga(elemento, visible) {
    elemento.classList.toggle("oculto", !visible);
}

export function crearTarjetaLibro(libro) {
    const { id, titulo, autor, categoria, precio, stock, imagen } = libro;

    const tarjeta = document.createElement("article");

    tarjeta.className = "tarjeta-libro";

    tarjeta.innerHTML = `
     <div class="portada">
        <img src="${imagen}" alt="Portada de ${titulo}">
     </div>
        <div class="contenido-libro">
            <span class="categoria">${categoria}</span>

            <h3>${titulo}</h3>

            <p class="autor">${autor}</p>

            <div class="informacion-libro">
                <strong>${formatearPrecio(precio)}</strong>
                <span>Stock: ${stock}</span>
            </div>

            <button
                class="btn-principal btn-agregar"
                data-id="${id}"
                ${stock === 0 ? "disabled" : ""}
            >
                ${stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>
        </div>
    `;

    return tarjeta;
}

export function crearItemCarrito(item) {
    const { id, titulo, precio, cantidad } = item;

    const subtotal = precio * cantidad;

    const elemento = document.createElement("article");

    elemento.className = "item-carrito";

    elemento.innerHTML = `
        <div class="datos-item">
            <h3>${titulo}</h3>
            <p>${formatearPrecio(precio)} por unidad</p>
        </div>

        <div class="controles-cantidad">
            <button
                class="btn-cantidad btn-restar"
                data-id="${id}"
                aria-label="Disminuir cantidad"
            >
                −
            </button>

            <span>${cantidad}</span>

            <button
                class="btn-cantidad btn-sumar"
                data-id="${id}"
                aria-label="Aumentar cantidad"
            >
                +
            </button>
        </div>

        <strong class="subtotal">
            ${formatearPrecio(subtotal)}
        </strong>

        <button
            class="btn-eliminar"
            data-id="${id}"
            aria-label="Eliminar producto"
        >
            🗑️
        </button>
    `;

    return elemento;
}
