import productModel from '../models/productModel.js';
import Product from '../models/productModel.js';

class ProductManager {
  constructor() {
  }

  async addProduct(title, description, price, thumbnail, code, stock, category, availability) {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock || !category || !availability) {
        throw new Error('Faltan datos para completar la adición del producto');
      }

      if (
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof thumbnail !== 'string' ||
        typeof price !== 'number' ||
        typeof code !== 'string' ||
        typeof stock !== 'number' ||
        typeof category !== 'string' ||
        typeof availability !== 'string'
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
        category,
        availability,
      });

      await newProduct.save();

      console.log('Los productos han sido guardados correctamente.');
    } catch (err) {
      throw new Error('Error al guardar los productos: ' + err.message);
    }
  }

  async getProducts(query, sort, limit, startIndex, category, availability) {
    try {
      let productsQuery = Product.find(query);

      if (category) {
        productsQuery = productsQuery.where('category').equals(category);
      }

      if (availability !== undefined) {
        productsQuery = productsQuery.where('availability').equals(availability);
      }

      if (sort) {
        const sortField = sort === 'asc' ? 'price' : '-price';
        productsQuery = productsQuery.sort(sortField);
      }

      if (limit) {
        productsQuery = productsQuery.limit(limit);
      }

      if (startIndex) {
        productsQuery = productsQuery.skip(startIndex);
      }

      const products = await productsQuery.lean();

      return products;
    } catch (err) {
      throw new Error('Error al obtener los productos: ' + err.message);
    }
  }

  async getProductsCount(query) {
    try {
      const count = await Product.countDocuments(query);
      return count;
    } catch (err) {
      throw new Error("Error al obtener el número de productos: " + err.message);
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

  async updateProduct(title, description, price, thumbnail, code, stock, category, availability, id) {
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
      product.category = category;
      product.availability = availability;

      await product.save();

      console.log('El producto ha sido actualizado correctamente.');
    } catch (err) {
      throw new Error('Error actualizando el producto: ' + err.message);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndRemove(id);

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      console.log('El producto ha sido eliminado correctamente.');
    } catch (err) {
      throw new Error('Error eliminando el producto: ' + err.message);
    }
  }
  async getProductsPage(limit, page) {
    try {
      const options = {
        limit: limit,
        page: page,
      };
  
      const { docs: products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productModel.paginate({},{limit:10,page,lean:true});
  
      return { products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage };
    } catch (err) {
      throw new Error('Error retrieving products');
    }
  }

}

export default ProductManager;