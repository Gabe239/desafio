import Cart from '../models/cartModel.js';

class CartManager {
  constructor() {
  }


  async getCarts() {
    try {
      const carts = await Cart.find().populate('products.product').exec();
      return carts;
    } catch (err) {
      throw new Error('Error al obtener los carritos');
    }
  }

  async saveCarts(carts) {
    try {

      await Cart.deleteMany({});
      await Cart.insertMany(carts);
    } catch (err) {
      throw new Error('Error al guardar los carritos');
    }
  }

  async createCart() {
    try {
      const newCart = {
        products: []
      };
      const cart = new Cart(newCart);
      
      await cart.save();
    
      return cart;
    } catch (err) {
      console.error('Error creating cart:', err);
      throw new Error('Error creating cart');
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findOne({ _id: cartId }).populate('products.product').lean().exec();
      return cart;
    } catch (err) {
      throw new Error('Error retrieving cart');
    }
  }
  async addProductToCart(cartId, productId) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { _id: cartId },
        { $inc: { 'products.$[elem].quantity': 1 } },
        { arrayFilters: [{ 'elem.product': productId }], new: true }
      ).populate('products.product');

      if (!cart) {
        throw new Error('Cart not found');
      }

      if (!cart.products || cart.products.length === 0) {
        cart.products = [{ product: productId, quantity: 1 }];
      }

      await cart.save();

      return cart.products;
    } catch (err) {
      throw new Error('Error adding product to cart');
    }
  }


  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productId } } },
        { new: true }
      ).populate('products.product');
      return cart;
    } catch (err) {
      throw new Error('Error al eliminar el producto del carrito');
    }
  }

  async updateCartProducts(cartId, products) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { _id: cartId },
        { products: products },
        { new: true }
      ).populate('products.product');
      return cart;
    } catch (err) {
      throw new Error('Error al actualizar el carrito');
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { _id: cartId, 'products.product': productId },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      ).populate('products.product');
      return cart;
    } catch (err) {
      throw new Error('Error al actualizar la cantidad del producto');
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findOneAndUpdate(
        { _id: cartId },
        { products: [] },
        { new: true }
      ).populate('products.product');
      return cart;
    } catch (err) {
      throw new Error('Error al vaciar el carrito');
    }
  }
}

export default CartManager;