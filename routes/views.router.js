import { Router } from 'express';

import ProductManager from '../dao/managers/ProductManagerDb.js';
const productManager = new ProductManager();

const router = Router();

router.get('/', async (req, res) => {
    let products = await productManager.getProducts();
    return res.render('home', {
        title: 'Home',
        products: products
    })
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();

    return res.render("realTimeProducts", {
        title: "Real Time Products",
        products: products,
    });


});

router.get('/chat', (req, res) => {
    res.render('chat');
})

export default router;
