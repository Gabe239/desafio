document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.dataset.productId;
      try {
        const response = await fetch(`/products/${productId}/add-to-cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productId)
        });

        if (response.ok) {
          const result = await response.json();
          alert('Product added to cart successfully');
          // Perform additional actions with the result if needed
        } else {
          throw new Error('Error adding product to cart');
        }
      } catch (error) {
        alert('Error adding product to cart');
        console.error('Error adding product to cart:', error);
      }
    });

    
  });
});