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

    guardarCarrito();
}

export function aumentarCantidad(id) {
    const producto = carrito.find(item => item.id === id);

    if (producto && producto.cantidad < producto.stock) {
        producto.cantidad++;
        guardarCarrito();
    }
}

export function disminuirCantidad(id) {
    const producto = carrito.find(item => item.id === id);

    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad--;
        } else {
            carrito = carrito.filter(item => item.id !== id);
        }

        guardarCarrito();
    }
}

export function eliminarProducto(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
}

export function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
}

export function calcularTotal() {
    return carrito.reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
    );
}

export function calcularCantidadTotal() {
    return carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    );
}
