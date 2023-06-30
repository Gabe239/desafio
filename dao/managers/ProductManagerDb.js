import Product from '../models/productModel.js';

class ProductManager {
  constructor() {
    this.id = 1;
  }

  async findMissingProductId() {
    const products = await this.getProducts();
    const ids = products.map(product => product.id);
    const maxId = products.length;

    for (let i = 1; i <= maxId; i++) {
      if (!ids.includes(i)) {
        return i;
      }
    }
    return products.length + 1;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error('Faltan datos para completar la adición del producto');
      }

      if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof thumbnail !== 'string' ||
        typeof price !== 'number' ||
        typeof code !== 'string' ||
        typeof stock !== 'number'
      ) {
        throw new Error(
          'Los datos proporcionados no son válidos para la adición del producto'
        );
      }

      const existingProduct = await Product.findOne({ code }).lean();
      if (existingProduct) {
        throw new Error('El código se repite');
      }

      const newProduct = new Product({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id: await this.findMissingProductId(),
      });

      await newProduct.save();

      console.log('Los productos han sido guardados correctamente.');
    } catch (err) {
      throw new Error('Error al guardar los productos: ' + err.message);
    }
  }

  async getProducts() {
    try {
      const products = await Product.find().lean();
      return products;
    } catch (err) {
      throw new Error('Error al obtener los productos: ' + err.message);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id).lean();
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (err) {
      throw new Error('Error al obtener el producto: ' + err.message);
    }
  }

  async updateProduct(title, description, price, thumbnail, code, stock, id) {
    try {
      const product = await Product.findById(id).lean();
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      product.title = title;
      product.description = description;
      product.price = price;
      product.thumbnail = thumbnail;
      product.code = code;
      product.stock = stock;

      await product.save();

      console.log('El producto ha sido actualizado correctamente.');
    } catch (err) {
      throw new Error('Error actualizando el producto: ' + err.message);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findById(id).lean();
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      await product.remove();

      console.log('El producto ha sido eliminado correctamente.');
    } catch (err) {
      throw new Error('Error eliminando el producto: ' + err.message);
    }
  }
}

export default ProductManager;