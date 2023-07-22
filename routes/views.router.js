import { Router } from 'express';

import ProductManager from '../dao/managers/ProductManagerDb.js';
import CartManager from '../dao/managers/CartManagerDb.js';
const productManager = new ProductManager();
const cartManager = new CartManager();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const user = req.session.user; // Get the entire user object from the session
    res.render('home', {
      user: user,
      products: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});


router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();

  return res.render("realTimeProducts", {
    title: "Real Time Products",
    products: products,
  });


});

router.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const { products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getProductsPage(
      limit,
      page
    );

    return res.render('products', {
      products,
      currentPage: page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage
    });
  } catch (err) {
    console.error('Error retrieving products:', err);
    return res.status(500).json({ error: 'Error retrieving products' });
  }
});

router.post('/products/:productId/add-to-cart', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const cart = await cartManager.createCart();
    await cartManager.addProductToCart(cart._id, productId);

    console.log(cart);

    return res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (err) {
    console.error('Error adding product to cart:', err);
    return res.status(500).json({ error: 'Error adding product to cart' });
  }
});
router.get('/cart/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      return res.render('carts', { cartId: cartId, products: cart.products });
    } else {
      return res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error retrieving cart:', error);
    return res.status(500).json({ error: 'Error retrieving cart' });
  }
});
router.get('/chat', (req, res) => {
  res.render('chat');
})

router.get('/register', (req, res) => {
  res.render('register');
})

router.get('/login', (req, res) => {
  res.render('login');
})
export default router;
