// src/app.js
const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');

// tus routers existentes
const productsRouter = require('../Routes/ProductsRouter');
const cartsRouter = require('../Routes/CartsRouter');
const viewsRouter = require('../Routes/views.router');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// ——— Middlewares ———
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ——— Handlebars ———
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// ——— Rutas ———
// APIs
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// Vistas
app.use('/', viewsRouter);

// ——— WebSockets ———
const ProductManager = require('./ProductManager');
const pm = new ProductManager(path.join(__dirname, '../data/products.json'));

io.on('connection', async socket => {
    console.log('🔌 Cliente conectado');

    // al conectar, envío lista inicial
    socket.emit('productos', await pm.getProducts());

    // al recibir nuevo producto
    socket.on('nuevoProducto', async prod => {
        await pm.addProduct(prod);
        io.emit('productos', await pm.getProducts());
    });

    // al recibir petición de borrado
    socket.on('eliminarProducto', async id => {
        await pm.deleteProduct(id);
        io.emit('productos', await pm.getProducts());
    });
});

// ——— Iniciar servidor ———
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
