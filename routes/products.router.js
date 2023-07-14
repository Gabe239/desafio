import express from 'express';
const router = express.Router();

import ProductManager from '../dao/managers/ProductManagerDb.js';
const productManager = new ProductManager();

import { io } from '../app.js';

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const category = req.query.category; 
    const availability = req.query.availability; 

    let query = {};

    if (req.query.query) {
      query = { type: req.query.query };
    }

    const totalProducts = await productManager.getProductsCount(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;

    const products = await productManager.getProducts(
      query,
      sort,
      limit,
      startIndex,
      category,
      availability
    );

    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const nextPage = hasNextPage ? page + 1 : null;
    const prevPage = hasPrevPage ? page - 1 : null;
    const prevLink = hasPrevPage
      ? `/api/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${req.query.query}&category=${category}&availability=${availability}`
      : null;
    const nextLink = hasNextPage
      ? `/api/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${req.query.query}&category=${category}&availability=${availability}`
      : null;

    const result = {
      status: 'success',
      payload: products,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    };

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error al enviar los productos' });
  }
});


router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
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
    await productManager.addProduct(
      newProduct.title,
      newProduct.description,
      newProduct.price,
      newProduct.thumbnail,
      newProduct.code,
      newProduct.stock,
      newProduct.category,
      newProduct.availability,
    );

    io.emit("product-added", newProduct);

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const product = await productManager.getProductById(productId);

    if (product) {
      const { title, description, price, thumbnail, code, stock, category, availability} = updatedProduct;
      await productManager.updateProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        availability,
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