import fs from 'fs';

class CartManager {
  constructor(path) {
    this.path = path;
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
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  async saveCarts(carts) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(carts), err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
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
      const carts = await this.getCarts();
      return carts.find(c => c.id == cartId);
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