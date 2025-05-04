const formulario = document.getElementById("form-editar");
const productoId = formulario.dataset.id;
const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(formulario);

    // Limpia errores anteriores
    document.querySelectorAll(".help-text").forEach(div => {
        div.innerText = "";
    });

    fetch(`/api/productos/${productoId}/`, {
        method: 'PATCH',
        headers: {
            'X-CSRFToken': csrfToken
        },
        body: formData
    })
        .then(res => {
            if (res.ok) {
                window.location.href = "/productos";
            } else {
                return res.json().then(data => {
                    for (let campo in data) {
                        const errorDiv = document.getElementById(`error-${campo}`);
                        if (errorDiv) {
                            errorDiv.innerText = data[campo].join(', ');
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al actualizar el producto");
        });
});