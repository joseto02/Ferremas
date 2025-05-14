function mostrarNombreUsuario() {
    const username = localStorage.getItem('username');
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.innerText = username ? `Hola, ${username}` : 'No has iniciado sesión';
    }
}

function actualizarContadorCarrito() {
    fetch('/api/carrito/', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            // 'Authorization': 'Token ' + localStorage.getItem('token')
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.items) {
                let totalCantidad = 0;
                data.items.forEach(item => totalCantidad += item.cantidad);
                document.getElementById('contador-carrito').textContent = totalCantidad;
            }
        });
}

function cerrarSesion() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No hay sesión activa.");
        return;
    }

    fetch("/api/logout/", {
        method: "POST",
        headers: {
            "Authorization": "Token " + token,
            "Content-Type": "application/json",
            "X-CSRFToken": window.csrftoken
        },
    })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("user");
                window.location.href = "/";
            } else {
                alert("Error al cerrar sesión");
            }
        })
        .catch(err => {
            console.error("Error en la petición:", err);
            alert("Error al cerrar sesión");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarNombreUsuario();
    if (localStorage.getItem('token')) {
        actualizarContadorCarrito();
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();  // Evita navegación si es <a href="#">
            cerrarSesion();
        });
    }
});