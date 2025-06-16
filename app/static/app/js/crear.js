const formulario = document.getElementById("form-producto");
const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
const productoId = formulario.dataset.id;

formulario.addEventListener("submit", function (e) {
    console.log("script cargado correctamente");

    e.preventDefault();

    const formData = new FormData(formulario);

    document.querySelectorAll(".help-text").forEach(div => {
        div.innerText = "";
    });

    fetch('/api/productos/crear', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        body: formData
    })
        .then(res => {
            if (res.ok) {
                window.location.href = "/productos";
                // alert("Producto creado con éxito");
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
            alert("Error al enviar la solicitud");
        });
});