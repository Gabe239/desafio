import Cart from '../models/cartModel.js';

class CartManager {
  constructor() {
  }

  generateId(carts) {
    const ids = carts.map(cart => cart.id);
    const maxId = carts.length;

    for (let i = 1; i <= maxId; i++) {
      if (!ids.includes(i)) {
        return i;
      }
    }
    return carts.length + 1;
  }

  async getCarts() {
    try {
      // Perform database query to get all carts
      const carts = await Cart.find().exec();
      return carts;
    } catch (err) {
      throw new Error('Error al obtener los carritos');
    }
  }

  async saveCarts(carts) {
    try {
      // Perform database operation to save/update carts
      await Cart.deleteMany({}); // Clear existing carts
      await Cart.insertMany(carts); // Insert new carts
    } catch (err) {
      throw new Error('Error al guardar los carritos');
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();

      const newCart = {
        id: this.generateId(carts),
        products: []
      };

      carts.push(newCart);

      await this.saveCarts(carts);

      return newCart;
    } catch (err) {
      throw new Error('Error al crear el carrito');
    }
  }

  async getCartById(cartId) {
    try {
      // Perform database query to get cart by id
      const cart = await Cart.findOne({ id: cartId }).exec();
      return cart;
    } catch (err) {
      throw new Error('Error al obtener el carrito');
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find(c => c.id == cartId);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const product = cart.products.find(p => p.product == productId);

      if (product) {
        product.quantity++;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1
        });
      }

      await this.saveCarts(carts);

      return cart.products;
    } catch (err) {
      throw new Error('Error al agregar el producto al carrito');
    }
  }
}

export default CartManager;