const express = require('express');
const router = express.Router();
const ProductManager = require('../src/ProductManager');
const productManager = new ProductManager('../data/products.json');

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(parseInt(req.params.pid));
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || price == null || status == null || stock == null || !category || !Array.isArray(thumbnails)) {
        return res.status(400).json({ error: 'Campos obligatorios faltantes o inválidos' });
    }
    const newProduct = await productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    if ('id' in req.body) delete req.body.id; // evitar sobrescribir id
    const updated = await productManager.updateProduct(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
});

router.delete('/:pid', async (req, res) => {
    const updatedList = await productManager.deleteProduct(parseInt(req.params.pid));
    res.json(updatedList);
});

module.exports = router;