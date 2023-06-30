import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.id = 1;
  }

  findMissingProductId() {
    const ids = this.products.map(product => product.id);
    const maxId = this.products.length;

    for (let i = 1; i <= maxId; i++) {
      if (!ids.includes(i)) {
        return i;
      }
    }
    return this.products.length + 1;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {

      this.products = await this.getProducts();

      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Faltan datos para completar la adición del producto");
      }

      if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof thumbnail !== "string" ||
        typeof price !== "number" ||
        typeof code !== "string" ||
        typeof stock !== "number"
      ) {
        throw new Error(
          "Los datos proporcionados no son válidos para la adición del producto"
        );
      }

      if (this.products.find(product => product.code === code)) {
        throw new Error("El código se repite");
      }

      const newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        id: this.findMissingProductId()
      };

      this.products.push(newProduct);

      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"), "utf-8");

      console.log("Los productos han sido guardados correctamente.");
    } catch (err) {
      throw new Error("Error al guardar los productos: " + err.message);
    }
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
      return this.products;
    } catch (err) {
      throw new Error("Error al leer el archivo: " + err.message);
    }
  }

  async getProductById(id) {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const productById = products.find(product => product.id == id);
      if (!productById) {
        throw new Error("Product not found");
      }
      return productById;
    } catch (err) {
      throw new Error("Error al leer el archivo: " + err.message);
    }
  }

  async updateProduct(title, description, price, thumbnail, code, stock, id) {
    try {
      this.products = await this.getProducts();
      const index = this.products.findIndex(product => product.id == id);
      this.products[index] = {
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
        id: id
      };

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t"),
        "utf-8"
      );

      console.log("El producto ha sido actualizado correctamente.");
    } catch (err) {
      throw new Error("Error actualizando el producto: " + err.message);
    }
  }

  async deleteProduct(id) {
    try {
      await this.getProducts();
      const index = this.products.findIndex(product => product.id == id);
      this.products.splice(index, 1);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t"),
        "utf-8"
      );

      console.log("El producto ha sido eliminado correctamente.");
    } catch (err) {
      throw new Error("Error eliminando el producto: " + err.message);
    }
  }
}
export default ProductManager;