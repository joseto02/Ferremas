const tabla = document.getElementById('tabla-productos');
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// fetch('/api/productos')
//     .then(res => res.json())
//     .then(data => {
//         data.forEach(producto => {
//             const fila = document.createElement('tr');
//             fila.innerHTML = `
//                 <td>${producto.id_producto}</td>
//                 <td>${producto.nombre}</td>
//                 <td>${producto.marca}</td>
//                 <td><img src="${producto.imagen}" height="100"></td>
//                 <td>${producto.stock}</td>
//                 <td>${producto.precio}</td>
//                 <td>
//                     <a class="btn btn-info" href="/productos/editar/${producto.id_producto}">Editar</a> |
//                     <button class="btn btn-danger" onclick="eliminarProducto(${producto.id_producto})">Borrar</button>
//                 </td>
//                 `;
//             tabla.appendChild(fila);
//         });
//     });


fetch('/api/productos/lista')
    .then(res => res.json())
    .then(data => {
        tabla.innerHTML = ''; 
        data.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.id_producto}</td>
                <td>${producto.nombre}</td>
                <td>${producto.marca}</td>
                <td><img src="${producto.imagen}" height="100"></td>
                <td>${producto.stock}</td>
                <td>${producto.precio}</td>
                <td>
                    <a class="btn btn-info" href="/productos/editar/${producto.id_producto}">Editar</a> |
                    <button class="btn btn-danger" onclick="eliminarProducto(${producto.id_producto})">Borrar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    })
    .catch(error => {
        console.error('Error al cargar productos:', error);
    });

function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar el producto?')) {
        fetch(`/api/productos/${id}/eliminar`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(response => {
                if (response.ok) {
                    // Recargar la tabla
                    location.reload();
                } else {
                    alert('Error al eliminar el producto');
                }
        });
    }
}

window.eliminarProducto = eliminarProducto;