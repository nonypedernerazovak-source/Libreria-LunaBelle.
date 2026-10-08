const CLAVE_STORAGE = "carritoLunaBelle";

let carrito = cargarCarrito();

function cargarCarrito() {
    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);

    return datosGuardados ? JSON.parse(datosGuardados) : [];
}

function guardarCarrito() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito));
}

export function obtenerCarrito() {
    return carrito;
}

export function agregarAlCarrito(libro) {
    const productoExistente = carrito.find(
        item => item.id === libro.id
    );

    if (productoExistente) {
        if (productoExistente.cantidad < libro.stock) {
            productoExistente.cantidad++;
        }
    } else {
        carrito.push({
            id: libro.id,
            titulo: libro.titulo,
            precio: libro.precio,
            stock: libro.stock,
            cantidad: 1
        });
    }
