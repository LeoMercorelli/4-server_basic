// Routes/views.router.js
const path = require('path');
const { Router } = require('express');
const ProductManager = require('../src/ProductManager');
const pm = new ProductManager(path.join(__dirname, '../data/products.json'));

const router = Router();

// Vista estática
router.get('/', async (req, res) => {
    const productos = await pm.getProducts();
    res.render('home', { productos });
});

// Vista en tiempo real (WebSocket)
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;
