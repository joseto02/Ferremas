document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const direccion = document.getElementById("direccion").value;
    const numero_telefono = document.getElementById("numero_telefono").value;

    fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": window.csrftoken
        },
        body: JSON.stringify({ username, email, password, first_name, last_name, direccion, numero_telefono })
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => { throw new Error(text); });
            }
            return res.json();
        })
        .then(data => {
            const errorContainer = document.getElementById("register-error");
            errorContainer.style.color = "green";
            errorContainer.innerText = "✅ Registro exitoso. Serás redirigido al login...";
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        })
        .catch(err => {
            const errorContainer = document.getElementById("register-error");
            errorContainer.style.color = "red";
            errorContainer.innerText = "❌ Error en el registro:\n" + err.message;
            console.error(err);
        });
});