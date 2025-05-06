const express = require('express');
const router = express.Router();
const CartManager = require('../src/CartManager');
const cartManager = new CartManager('../data/carts.json');

router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(parseInt(req.params.cid));
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const updated = await cartManager.addProductToCart(cid, pid);
  if (!updated) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(updated);
});

module.exports = router;