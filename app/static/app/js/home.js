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
            <button onclick="agregarAlCarrito(${producto.id})" class="btn btn-success">Agregar al carrito</button>
        </div>
    `;
    return card;
}

function agregarAlCarrito(id) {
    fetch("http://127.0.0.1:8000/api/carrito/agregar/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "token " + localStorage.getItem("token") 
        },
        body: JSON.stringify({
            producto_id: id,
            cantidad: 1
        })
    })
        .then(res => {
            if (!res.ok) throw new Error("Error al agregar al carrito (403)");
            return res.json();
        })
        .then(data => {
            alert(data.mensaje);
            actualizarContadorCarrito();
        })
        .catch(err => {
            console.error("Error al agregar al carrito:", err);
        });
}

function actualizarContadorCarrito() {
    fetch('/api/carrito/contador/', {
        headers: {
            'Authorization': 'token ' + localStorage.getItem('token')
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
            'Authorization': 'token ' + localStorage.getItem('token')
        }
    })
        .then(res => {
            if (!res.ok) throw new Error('Error al cargar el carrito');
            res.json()
        })
        .then(data => {
            console.log("respuesta del carrito", data);
            const contenedor = document.getElementById('contenido-carrito');
            contenedor.innerHTML = "";

            if (!data.items || data.items.length === 0) {
                contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
                return;
            }

            data.items.forEach(item => {
                contenedor.innerHTML += `
                    <div class="mb-2 border-bottom pb-2">
                        <strong>${item.nombre}</strong><br>
                        Cantidad: ${item.cantidad}<br>
                        Precio: $${item.precio}
                    </div>
                `;
            });
        })
    .catch(err => {
        console.error("Error al obtener el carrito", err);
    });
}