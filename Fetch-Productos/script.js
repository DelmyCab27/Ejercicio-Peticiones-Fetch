document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const categoriesList = document.getElementById('categories-list');
  const searchForm = document.querySelector('form');
  const searchInput = document.getElementById('search-input');
  const cartItemsKeyPrefix = 'product_'; // Prefijo para las keys en localStorage
  const productsPerPage = 15; // Número de productos por página
  let currentPage = 1; // Página actual, inicializada en 1

  function fetchCategories() {
    fetch('https://api.mercadolibre.com/sites/MLA/categories')
      .then(response => response.json())
      .then(categories => {
        categories.forEach(category => {
          const categoryItem = document.createElement('li');
          categoryItem.className = 'list-group-item';
          categoryItem.textContent = category.name;
          categoryItem.addEventListener('click', () => fetchProducts(category.id));
          categoriesList.appendChild(categoryItem);
        });
      })
      .catch(error => console.error('Error fetching categories:', error));
  }

  function fetchInitialProducts() {
    fetch('https://api.mercadolibre.com/sites/MLA/search?q=Id') // Cambiar la búsqueda inicial si es necesario
      .then(response => response.json())
      .then(data => {
        renderProducts(data.results);
      })
      .catch(error => console.error('Error fetching initial products:', error));
  }

  function fetchProducts(categoryId) {
    fetch(`https://api.mercadolibre.com/sites/MLA/search?category=${categoryId}`)
      .then(response => response.json())
      .then(data => {
        renderProducts(data.results);
      })
      .catch(error => console.error('Error fetching products:', error));
  }

  function searchProducts(searchTerm) {
    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        renderProducts(data.results);
      })
      .catch(error => console.error('Error searching products:', error));
  }

  function renderProducts(products) {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const displayedProducts = products.slice(startIndex, endIndex);

    productList.innerHTML = '';
    displayedProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'col-md-4 product-card';
      productCard.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>Precio: $${product.price}</p>
        <p>Condición: ${product.condition}</p>
        <p>Disponibilidad: ${product.available_quantity}</p>
        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Agregar al Carrito</button>
      `;

      const addToCartButton = productCard.querySelector('.add-to-cart');
      addToCartButton.addEventListener('click', () => addToCart(product));

      productList.appendChild(productCard);
    });

    // Agregar botones de paginación si hay más productos disponibles
    if (products.length > endIndex) {
      const loadMoreButton = document.createElement('button');
      loadMoreButton.className = 'btn btn-primary';
      loadMoreButton.textContent = 'Cargar más productos';
      loadMoreButton.addEventListener('click', () => {
        currentPage++;
        renderProducts(products);
      });
      productList.appendChild(loadMoreButton);
    }
  }

  function addToCart(product) {
    const productId = product.id;
    const productKey = cartItemsKeyPrefix + productId;

    // Verificar si el producto ya está en el carrito
    if (localStorage.getItem(productKey)) {
      alert('Este producto ya está en el carrito.');
      return;
    }

    // Guardar el producto en localStorage
    localStorage.setItem(productKey, JSON.stringify(product));
    alert('Producto agregado al carrito.');

    // Opcional: Puedes redirigir al usuario a la página del carrito o actualizar la visualización del carrito aquí
  }

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
      searchProducts(searchTerm);
    } else {
      console.log('Ingresa un término de búsqueda válido');
    }
  });

  fetchCategories();
  fetchInitialProducts();
});
