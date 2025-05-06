const express = require('express');
const app = express();
const productsRouter = require('../Routes/ProductsRouter');
const cartsRouter = require('../Routes/CartsRouter');

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
    console.log(`Servidor corriendo en http://localhost:8080`);});