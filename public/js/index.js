document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    socket.on('connect', () => {
        console.log('Cliente conectado');
    });
    const renderProducts = (products) => {
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '';
        const newProductLi = document.createElement('li');
        newProductLi.id = products._id; // Set the id attribute
        newProductLi.innerHTML = `
        <p>Title: ${products.title}</p>
        <p>Description: ${products.description}</p>
        <p>Price: ${products.price}</p>
        <p>Thumbnail: ${products.thumbnail}</p>
        <p>Code: ${products.code}</p>
        <p>Stock: ${products.stock}</p>
        <p>Category: ${products.category}</p>
        <p>Availability: ${products.availability}</p>
        <p>Id: ${products._id}</p>
      `;

        productsList.appendChild(newProductLi);
    };

    const addProduct = (product) => {
        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
            .then(response => response.json())
            .then(newProduct => {

            })
            .catch(error => {
                console.error('Error adding product:', error);
            });
    };

    const deleteProduct = (productId) => {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(deletedProduct => {
                removeProductFromList(deletedProduct._id);
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    };

    const updateProduct = (productId, updatedProduct) => {
        fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
            .then(response => response.json())
            .then(updatedProduct => {
                // Aquí puedes realizar alguna acción adicional después de la actualización
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    };

    const removeProductFromList = (productId) => {
        const productItem = document.getElementById(productId);
        if (productItem) {
            productItem.remove();
        }
    };

    const form = document.getElementById('new-product-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const { title, description, price, thumbnail, code, stock, category, availability } = form.elements;

        const parsedPrice = parseFloat(price.value);
        const parsedStock = parseInt(stock.value);

        const newProduct = {
            title: title.value,
            description: description.value,
            price: parsedPrice,
            thumbnail: thumbnail.value,
            code: code.value,
            stock: parsedStock,
            category: category.value,
            availability: availability.value
        };

        addProduct(newProduct);
        form.reset();
    });

    const deleteForm = document.getElementById('delete-product-form');
    deleteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const productId = document.getElementById('product-id').value;
        deleteProduct(productId);
        deleteForm.reset();
    });

    const updateForm = document.getElementById('update-product-form');
    updateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const productId = document.getElementById('update-product-id').value;
        const title = document.getElementById('update-product-title');
        const description = document.getElementById('update-product-description');
        const price = document.getElementById('update-product-price');
        const thumbnail = document.getElementById('update-product-thumbnail');
        const code = document.getElementById('update-product-code');
        const stock = document.getElementById('update-product-stock');
        const category = document.getElementById('update-product-category');
        const availability = document.getElementById('update-product-avaibility');
        const parsedPrice = parseFloat(price.value);
        const parsedStock = parseInt(stock.value);

        const updatedProduct = {
            title: title.value,
            description: description.value,
            price: parsedPrice,
            thumbnail: thumbnail.value,
            code: code.value,
            stock: parsedStock,
            category: category.value,
            availability: availability.value
        };
        updateProduct(productId, updatedProduct);

        updateForm.reset();
    });
    socket.on('product-updated', (updatedProduct) => {
        // Find the existing product in the list and update its details
        const existingProduct = document.getElementById(updatedProduct._id);
        if (existingProduct) {
            existingProduct.innerHTML = `
              <p>Title: ${updatedProduct.title}</p>
              <p>Description: ${updatedProduct.description}</p>
              <p>Price: ${updatedProduct.price}</p>
              <p>Thumbnail: ${updatedProduct.thumbnail}</p>
              <p>Code: ${updatedProduct.code}</p>
              <p>Stock: ${updatedProduct.stock}</p>
              <p>Catergory: ${updatedProduct.category}</p>
              <p>Avaibility: ${updatedProduct.availability}</p>
            `;
        }
    });

    socket.on('product-deleted', (productId) => {
        removeProductFromList(productId);
        fetchProducts(); // Fetch the updated list of products
    });


    socket.on('product-added', (newProduct) => {

        renderProducts(newProduct);
    });
});