document.addEventListener("DOMContentLoaded", () => {
    fetchProductos();
    actualizarContadorCarrito();

    const carritoBoton = document.getElementById("carrito-boton");
    carritoBoton.addEventListener("click", cargarContenidoCarrito);
});

function fetchProductos() {
    fetch("/api/productos/")
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById("productos-container");
            data.forEach(producto => {
                const card = crearTarjetaProducto(producto);
                contenedor.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error cargando productos:", err);
        });
}

function crearTarjetaProducto(producto) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "18rem";

    card.innerHTML = `
        <img src="${producto.imagen || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">Marca: ${producto.marca}</p>
            <p class="card-text"><strong>Precio:</strong> $${producto.precio}</p>
            <button onclick="agregarAlCarrito(${producto.id_producto})" class="btn btn-success">Agregar al carrito</button>
        </div>
    `;
    return card;
}

function agregarAlCarrito(id) {
    fetch("/api/carrito/agregar/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            producto_id: id,
            cantidad: 1
        })
    })
        .then(res => {
            if (!res.ok) throw new Error("Error al agregar al carrito (" + res.status + ")");
            return res.json();
        })
        .then(data => {
            // alert(data.mensaje);
            actualizarContadorCarrito();
        })
        .catch(err => {

            console.error("Error al agregar al carrito:", err);
        });
}

function actualizarContadorCarrito() {
    fetch('/api/carrito/contador/', {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    })
        .then(res => res.json())
        .then(data => {
            const contador = document.getElementById('contador-carrito');
            if (contador) {
                contador.textContent = data.total_items || 0;
            }
        });
}

function cargarContenidoCarrito() {
    fetch('/api/carrito/', {
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token')
        }
    })
        .then(res => {
            if (!res.ok) throw new Error('Error al cargar el carrito');
            return res.json();
        })
        .then(data => {
            console.log("items recibido", data.items);
            const contenedor = document.getElementById('contenido-carrito');
            contenedor.innerHTML = "";

            if (!data.items || data.items.length === 0) {
                contenedor.innerHTML = '<p class="mensaje-vacio">Tu carrito está vacío.</p>';
                return;
            }

            data.items.forEach(item => {
                contenedor.innerHTML += `
                    <div class="mb-2 border-bottom pb-2">
                        <img src="${item.imagen || 'https://via.placeholder.com/150'}" alt="${item.nombre}" class="img-thumbnail" width="50">
                        <strong>${item.nombre}</strong><br>
                        Cantidad: ${item.cantidad}<br>
                        Precio: $${item.precio * item.cantidad}<br>
                        <button onclick="eliminarDelCarrito(${item.id})" class="btn btn-danger btn-sm">Eliminar</button>
                    </div>
                `;
            });

            contenedor.innerHTML += `
                <div class="text-end mt-4">
                    <a href="/pago" class="btn btn-success btn-lg">🤑 Pagar ahora</a>
                </div>
            `;
        })
        .catch(err => {
            console.error("Error al obtener el carrito", err);
        });
}


function eliminarDelCarrito(item_id) {
    fetch(`/api/carrito/eliminar/${item_id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) throw new Error('Error al eliminar el producto');
            return res.json();
        })
        .then(data => {
            // alert(data.mensaje);
            cargarContenidoCarrito();  // Recarga el carrito después de eliminar
            actualizarContadorCarrito();
        })
        .catch(err => {
            console.error("Error al eliminar del carrito:", err);
        });
}