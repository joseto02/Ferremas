async function actualizarCantidad(id, cantidad) {
    await fetch(`/api/carrito/actualizar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ cantidad })
    });
    cargarCarrito();
}

async function eliminarItem(id) {
    await fetch(`/api/carrito/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('token') 
        }
    });
    cargarCarrito();
}

async function cargarCarrito() {
    const response = await fetch('/api/carrito', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    const data = await response.json();

    if (data.mensaje === 'Carrito vacío') {
        document.getElementById("contenido-carrito").innerHTML = "<p>Tu carrito está vacío</p>";
        return;
    }

    let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;

    let total = 0;

    data.items.forEach(item => {
        const subtotal = item.producto_precio * item.cantidad;
        total += subtotal;

        html += `
            <tr>
                <td>${item.producto_nombre}</td>
                <td>$${item.producto_precio}</td>
                <td>
                    <input type="number" value="${item.cantidad}" min="1" onchange="actualizarCantidad(${item.id}, this.value)">
                </td>
                <td>$${subtotal}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarItem(${item.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>

        <div style="text-align:right; margin-top: 20px;">
            <button class="btn btn-success btn-lg" onclick="pagarCarrito()">🤑 Pagar ahora</button>
        </div>
    `;
    console.log("Generando html del carrito con productos, insertando botón...");
    document.getElementById("contenido-carrito").innerHTML = html;

}



async function pagarCarrito() {
    const response = await fetch('/api/carrito', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const carrito = data.items.map(item => ({
        nombre: item.producto_nombre,
        precio: item.producto_precio,
        cantidad: item.cantidad
    }));

    const pagarResponse = await fetch('/pago/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ carrito })
    });

    const pagarData = await pagarResponse.json();

    if (pagarData.url) {
        window.location.href = pagarData.url;
    } else {
        alert("Ocurrió un error al generar el pago.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded: llamando a cargarCarrito");
    cargarCarrito();
});

