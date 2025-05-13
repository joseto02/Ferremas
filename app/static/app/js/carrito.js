async function cargarCarrito() {
    const response = await fetch('/api/carrito', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token') // si usas token
        }
    });
    const data = await response.json();

    if (data.mensaje === 'Carrito vacío') {
        document.getElementById("carrito-items").innerHTML = "<p>Tu carrito está vacío</p>";
        return;
    }

    let html = '<table class="table"><thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead><tbody>';
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

    html += '</tbody></table>';
    document.getElementById("carrito-items").innerHTML = html;
    document.getElementById("total").innerText = total;
}

async function actualizarCantidad(id, cantidad) {
    await fetch(`/api/carrito/actualizar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') // si usas token
        },
        body: JSON.stringify({ cantidad })
    });
    cargarCarrito();
}

async function eliminarItem(id) {
    await fetch(`/api/carrito/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token') // si usas token
        }
    });
    cargarCarrito();
}

cargarCarrito();