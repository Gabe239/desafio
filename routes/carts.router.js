import express from 'express';
const router = express.Router();
import CartManager from '../dao/managers/CartManagerDb.js';
const cartManager = new CartManager();

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    return res.status(201).json(newCart);
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      return res.json(cart);
    } else {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedProducts = await cartManager.addProductToCart(cartId, productId);
    return res.status(200).json(updatedProducts);
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

export default router;