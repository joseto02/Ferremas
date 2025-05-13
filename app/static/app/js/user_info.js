function mostrarNombreUsuario() {
    const username = localStorage.getItem('username');
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.innerText = username ? `Hola, ${username}` : 'No has iniciado sesión';
    }
}

function actualizarContadorCarrito() {
    fetch('/api/carrito', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.items) {
                let totalCantidad = 0;
                data.items.forEach(item => totalCantidad += item.cantidad);
                document.getElementById('cart-count').textContent = totalCantidad;
            }
        });
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarNombreUsuario();
    if (localStorage.getItem('token')) {
        actualizarContadorCarrito();
    }
});


localStorage.removeItem("token");
localStorage.removeItem("user");