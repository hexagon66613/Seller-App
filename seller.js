document.addEventListener('DOMContentLoaded', () => {
  const socket = io('http://localhost:3000'); // Replace with your server URL

  const productForm = document.getElementById('product-form');
  const productIdInput = document.getElementById('product-id');
  const productNameInput = document.getElementById('product-name');
  const productPriceInput = document.getElementById('product-price');
  const saveProductButton = document.getElementById('save-product');
  const productsList = document.getElementById('products');

  // Fetch initial product list
  fetchProducts();

  // Handle save product button click
  saveProductButton.addEventListener('click', () => {
    const id = productIdInput.value;
    const name = productNameInput.value;
    const price = parseFloat(productPriceInput.value);

    if (!name || isNaN(price)) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const product = { id, name, price };
    socket.emit('updateProduct', product);
    productIdInput.value = '';
    productNameInput.value = '';
    productPriceInput.value = '';
  });

  // Fetch products from the server
  function fetchProducts() {
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(products => {
        productsList.innerHTML = products.map(product => `
          <li>
            ${product.name} - ${product.price}
            <button onclick="deleteProduct('${product._id}')">Delete</button>
          </li>
        `).join('');
      });
  }

  // Delete product function
  window.deleteProduct = function(productId) {
    fetch(`http://localhost:3000/products/${productId}`, {
      method: 'DELETE'
    })
      .then(() => fetchProducts())
      .catch(error => console.error('Error:', error));
  };

  // WebSocket event for product updates
  socket.on('updateProducts', () => {
    fetchProducts();
  });

  // WebSocket event for errors
  socket.on('error', (message) => {
    console.error('Error:', message);
  });
});
