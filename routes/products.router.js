import express from 'express';
const router = express.Router();

import ProductManager from '../dao/managers/ProductManagerDb.js';
const productManager = new ProductManager();

import { io } from '../app.js';

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();

    if (!isNaN(limit)) {
      return res.status(200).json(products.slice(0, limit));
    } else {
      return res.status(200).json(products);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error al enviar los productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error al enviar los productos' });
  }
});

router.post('/', async (req, res) => {

  const newProduct = req.body;
  

  try {
    console.log(newProduct);
    await productManager.addProduct(
      newProduct.title,
      newProduct.description,
      newProduct.price,
      newProduct.thumbnail,
      newProduct.code,
      newProduct.stock
    );

    io.emit("product-added", newProduct);

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productIdStr = req.params.pid;
    const updatedProduct = req.body;
    const productId = parseInt(productIdStr);
    const product = await productManager.getProductById(productId);

    if (product) {
      const { title, description, price, thumbnail, code, stock } = updatedProduct;
      await productManager.updateProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        productId
      );
      io.emit("product-updated", product);
      return res.status(200).json({ ...product, ...updatedProduct });
    } else {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);

    if (product) {
      await productManager.deleteProduct(productId);
      io.emit("product-deleted", product);
      return res.status(200).json(product);
    } else {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;