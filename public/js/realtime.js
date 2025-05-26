// public/js/realtime.js
const socket = io();

const formAgregar = document.getElementById('formAgregar');
const formEliminar = document.getElementById('formEliminar');
const lista = document.getElementById('listaProductos');

socket.on('productos', productos => {
    lista.innerHTML = '';
    productos.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `ID: ${p.id} – ${p.title} ($${p.price})`;
        lista.appendChild(li);
    });
});

formAgregar.addEventListener('submit', e => {
    e.preventDefault();
    const title = e.target.title.value;
    const price = parseFloat(e.target.price.value);
    socket.emit('nuevoProducto', { title, price });
    e.target.reset();
});

formEliminar.addEventListener('submit', e => {
    e.preventDefault();
    const id = parseInt(e.target.id.value);
    socket.emit('eliminarProducto', id);
    e.target.reset();
});
