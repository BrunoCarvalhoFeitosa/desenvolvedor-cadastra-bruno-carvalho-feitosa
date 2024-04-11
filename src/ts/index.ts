import Toastify from "toastify-js";
import { Product } from "../ts/@types/Product";

export const serverUrl = "http://localhost:5000/products";
export const orderByContainer = document.querySelector(".main__header-orderBy__container-content");
export let products: Product[] = [];
export let selectedColor: string | null = null;
export let selectedSize: string | null = null;
export let selectedPriceRange: string | null = null;
export let displayedProducts = 6;

/* Messages */

// Function to remove not founded products
function removeNoProductsMessage() {
  const noProductsMessage = document.querySelector(".main__content-wrapper__clothes-ul__notFound");

  if (noProductsMessage) {
    noProductsMessage.remove();
  }
}

// Function to show not founded products
function displayNoProductsMessage() {
  const clothesList = document.querySelector(".main__content-wrapper__clothes-ul");
  const noProductsMessage = document.createElement("li");
  noProductsMessage.classList.add("main__content-wrapper__clothes-ul__notFound");
  clothesList.classList.add("not-found-container");
  noProductsMessage.textContent = "Nenhum produto encontrado.";
  clothesList.appendChild(noProductsMessage);
}

/* Product content */

// Function to display dynamic products
function displayProducts(products: Product[]): void {
  const productsList = document.querySelector(".main__content-wrapper__clothes-ul");

  // Remove not founded message if exists
  removeNoProductsMessage();

  productsList.classList.remove("not-found-container");
  productsList.innerHTML = "";

  // Displaying dynamic products
  products.slice(0, displayedProducts).forEach((product, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <picture class="main__content-wrapper__clothes-ul__picture">
          <img src="${product.image}" alt="${product.name}" />
        </picture>
        <h3>
          ${product.name}
        </h3>
        <div class="main__content-wrapper__clothes-ul__price">
          <strong>
            R$${product.price.toFixed(2)}
          </strong>
          <span>
            até ${product.parcelamento[0]}x de R$${product.parcelamento[1]}
          </span>
        </div>
        <div class="main__content-wrapper__clothes-ul__buy">
          <button id="${product.id}" data-index="${index}" type="button">
            Comprar
          </button>
        </div>
      </div>
    `;

    productsList.appendChild(li);
  });

  handleAddProductToMinicart();
  handleShowTotalMinicart();
  handleUpdateCartIndicator();

  // If any product exists display not found message
  if (products.length === 0) {
    displayNoProductsMessage();
  }
}

/* Filter actions */

// Function to display colors filter
function displayColors(colors: string[]): void {
  const colorList = document.querySelector(".colors-list");

  colors.forEach(color => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <input type="radio" name="color" id="${color}" value="${color}" />
        <label for="${color}">${color}</label>
      </div>
    `;

    colorList.appendChild(li);
  });
}

// Function to display sizes filter
function displaySizes(sizes: string[]): void {
  const sizesList = document.querySelector(".sizes-list");

  sizes.forEach(size => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <input type="radio" name="size" id="${size}" value="${size}" />
        <label for="${size}">${size}</label>
      </div>
    `;

    sizesList.appendChild(li);
  });
}

// Function to display prices filter
function displayPrices(prices: string[]): void {
  const pricesList = document.querySelector(".prices-list");

  prices.forEach(price => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <input type="radio" name="price" id="${price}" value="${price}" />
        <label for="${price}">${price}</label>
      </div>
    `;

    pricesList.appendChild(li);
  });
}

// Function to customize range filter
function categorizePrices(prices: number[]): string[] {
  const priceRanges: { [key: string]: string } = {
    "0-50": "De R$0 até R$50",
    "51-150": "De R$51 até R$150",
    "151-300": "De R$151 até R$300",
    "301-500": "De R$301 até R$500",
    "501+": "A partir de R$500",
  };

  const categorizedPricesSet: Set<string> = new Set();

  prices.forEach(price => {
    if (price <= 50) {
      categorizedPricesSet.add(priceRanges["0-50"]);
    } else if (price <= 150) {
      categorizedPricesSet.add(priceRanges["51-150"]);
    } else if (price <= 300) {
      categorizedPricesSet.add(priceRanges["151-300"]);
    } else if (price <= 500) {
      categorizedPricesSet.add(priceRanges["301-500"]);
    } else {
      categorizedPricesSet.add(priceRanges["501+"]);
    }
  });

  const allPriceRanges = Object.values(priceRanges);

  allPriceRanges.forEach(range => {
    categorizedPricesSet.add(range);
  });

  const categorizedPrices: string[] = Array.from(categorizedPricesSet).sort((a, b) => {
    const [minA] = getPriceRangeValues(a);
    const [minB] = getPriceRangeValues(b);
    return minA - minB;
  });

  return categorizedPrices;
}

// Function to apply range
function getPriceRangeValues(priceRange: string): [number, number] {
  const ranges: { [key: string]: [number, number] } = {
    "De R$0 até R$50": [0, 50],
    "De R$51 até R$150": [51, 150],
    "De R$151 até R$300": [151, 300],
    "De R$301 até R$500": [301, 500],
    "A partir de R$500": [501, Infinity],
  };

  return ranges[priceRange];
}

// Function to apply filters
function handleApplyFilters() {
  let filteredProducts = products;

  if (selectedColor !== null) {
    filteredProducts = filteredProducts.filter(
      product => product.color === selectedColor
    );
  }

  if (selectedSize !== null) {
    filteredProducts = filteredProducts.filter(
      product => product.size.includes(selectedSize)
    );
  }

  if (selectedPriceRange !== null) {
    const [minPrice, maxPrice] = getPriceRangeValues(selectedPriceRange);

    filteredProducts = filteredProducts.filter(
      product => product.price >= minPrice && product.price <= maxPrice
    );
  }

  // Display only products that meet filters
  displayProducts(filteredProducts);

  // Checking if the number of products displayed after applying the filters is less than 6
  if (filteredProducts.length < 6) {
    // Hide show more button
    const showMoreButton = document.querySelector(".main__content-wrapper__showMore button") as HTMLButtonElement;

    showMoreButton.style.display = "none";
  } else {
    // Display show more button
    const showMoreButton = document.querySelector(".main__content-wrapper__showMore button") as HTMLButtonElement;

    showMoreButton.style.display = "block";
  }
}

// Function to reset available and not-available size flags from inputs filter
function resetSizeAvailabilityClasses() {
  const sizeRadios = document.querySelectorAll('input[name="size"]');
  sizeRadios.forEach(radio => {
    (radio.parentElement as HTMLElement).classList.remove("available", "not-available");
  });
}

// Function to update size availability
function updateSizeAvailability() {
  // Resetting size availability classes
  resetSizeAvailabilityClasses();

  // Get all sizes
  const sizeRadios = document.querySelectorAll('input[name="size"]');

  // Iterate over each size
  sizeRadios.forEach(radio => {
    const size = (radio as HTMLInputElement).value;

    // Checking if the size is available for the selected color
    const isAvailable = products.some(
      product => product.color === selectedColor && product.size.includes(size)
    );
  
    // Add or remove active class
    if (isAvailable) {
      (radio.parentElement as HTMLElement).classList.add("available");
    } else {
      (radio.parentElement as HTMLElement).classList.add("not-available");
    }
  });
}

// Function to reset available and not-available price flags from inputs filter
function resetPriceAvailabilityClasses() {
  const priceRadios = document.querySelectorAll('input[name="price"]');
  priceRadios.forEach(radio => {
    (radio.parentElement as HTMLElement).classList.remove("available", "not-available");
  });
}

// Function to update price availability
function updatePriceAvailability() {
  // Resetting price availability classes
  resetPriceAvailabilityClasses();

  // Get all prices
  const priceRadios = document.querySelectorAll('input[name="price"]');

  // Iterate over each price
  priceRadios.forEach(radio => {
    const priceRange = (radio as HTMLInputElement).value;

    // Checking if the price range is available for the selected color
    const [minPrice, maxPrice] = getPriceRangeValues(priceRange);
    const isAvailable = products.some(
      product => product.color === selectedColor && product.price >= minPrice && product.price <= maxPrice
    );

    // Add or remove active class
    if (isAvailable) {
      (radio.parentElement as HTMLElement).classList.add("available");
    } else {
      (radio.parentElement as HTMLElement).classList.add("not-available");
    }
  });
}

// Function to apply mobile filters
function handleFilterApply() {
  const applyFilterButton = document.querySelector(".main__content-wrapper__filter-actions__apply");
  const closeFilterButton = document.querySelector(".main__content-wrapper__filter-close button") as HTMLButtonElement;

  applyFilterButton.addEventListener("click", () => {
    closeFilterButton.click();
  });
}

// Function to clear mobile filters
function handleFilterClear() {
  const clearFilterButton = document.querySelector(".main__content-wrapper__filter-actions__clear");

  clearFilterButton.addEventListener("click", () => {
    selectedColor = null;
    selectedSize = null;
    selectedPriceRange = null;
    const closeFilterButton = document.querySelector(".main__content-wrapper__filter-close button") as HTMLButtonElement;
  
    // Unchecking color, size and price radios
    const colorRadios = document.querySelectorAll('input[name="color"]');
    colorRadios.forEach(radio => {
      (radio as HTMLInputElement).checked = false;
    });
  
    const sizeRadios = document.querySelectorAll('input[name="size"]');
    sizeRadios.forEach(radio => {
      (radio as HTMLInputElement).checked = false;
    });
  
    const priceRadios = document.querySelectorAll('input[name="price"]');
    priceRadios.forEach(radio => {
      (radio as HTMLInputElement).checked = false;
    });
  
    handleApplyFilters();
    closeFilterButton.click();
  });
}

// Function to open mobile filter
function handleOpenMobileFilter() {
  const openFilterButton = document.querySelector(".main__header-open__action");
  const closeFilterButton = document.querySelector(".main__content-wrapper__filter-close button");
  const filterContainer = document.querySelector(".main__content-wrapper__filter");

  openFilterButton.addEventListener("click", () => {
    if (!filterContainer.classList.contains("active")) {
      filterContainer.classList.add("active");
    }
  });

  closeFilterButton.addEventListener("click", () => {
    if (filterContainer.classList.contains("active")) {
      filterContainer.classList.remove("active");
    }
  });
}

// Function to display mobile colors filter
function handleOpenMobileColorsFilter() {
  const openColorsFilterButton = document.querySelector(".main__content-wrapper__filter-colors h2");
  const filterColorsContainer = document.querySelector(".colors-list");

  openColorsFilterButton.addEventListener("click", () => {
    if (!filterColorsContainer.classList.contains("active")) {
      filterColorsContainer.classList.add("active");
    } else {
      filterColorsContainer.classList.remove("active");
    }
  });
}

// Function to display mobile sizes filter
function handleOpenMobileSizesFilter() {
  const openSizesFilterButton = document.querySelector(".main__content-wrapper__filter-sizes h2");
  const filterSizesContainer = document.querySelector(".sizes-list");

  openSizesFilterButton.addEventListener("click", () => {
    if (!filterSizesContainer.classList.contains("active")) {
      filterSizesContainer.classList.add("active");
    } else {
      filterSizesContainer.classList.remove("active");
    }
  });
}

// Function to display mobile prices filter
function handleOpenMobilePricesFilter() {
  const openPricesFilterButton = document.querySelector(".main__content-wrapper__filter-prices h2");
  const filterPricesContainer = document.querySelector(".prices-list");

  openPricesFilterButton.addEventListener("click", () => {
    if (!filterPricesContainer.classList.contains("active")) {
      filterPricesContainer.classList.add("active");
    } else {
      filterPricesContainer.classList.remove("active");
    }
  });
}

/* Order by */

// Function to toggle order by
function handleOpenOrberBy() {
  const openOrderByButton = document.querySelector(".main__header-orderBy__container-action");
  const closeOrderByButton = document.querySelector(".main__header-orderBy__container-content__close button");

  openOrderByButton.addEventListener("click", () => {
    if (orderByContainer.classList.contains("active")) {
      orderByContainer.classList.remove("active");
    } else {
      orderByContainer.classList.add("active");
    }
  });

  closeOrderByButton.addEventListener("click", () => {
    if (orderByContainer.classList.contains("active")) {
      orderByContainer.classList.remove("active");
    }
  });
}

// Function to ordenate products to most recent
function orderByMostRecent() {
  const orderByMostRecentButton = document.querySelector("#most-recent");
  
  orderByMostRecentButton.addEventListener("click", () => {
    orderByContainer.classList.remove("active");

    products.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    handleApplyFilters();
  });
}

// Function to ordenate products to lowest price
function orderByLowestPrice() {
  const orderByLowestPriceButton = document.querySelector("#lowest-price");

  orderByLowestPriceButton.addEventListener("click", () => {
    orderByContainer.classList.remove("active");

    products.sort((a, b) => a.price - b.price);
    handleApplyFilters();
  });
}

// Function to ordenate products to highest price
function orderByHighestPrice() {
  const orderByHighestPriceButton = document.querySelector("#highest-price");

  orderByHighestPriceButton.addEventListener("click", () => {
    orderByContainer.classList.remove("active");

    products.sort((a, b) => b.price - a.price);
    handleApplyFilters();
  });
}

// Function to load more products
function handleLoadMoreProducts() {
  const loadMoreButton = document.querySelector(".main__content-wrapper__showMore button") as HTMLButtonElement;

  loadMoreButton.addEventListener("click", () => {
    // Incrementing to display 3 more products
    displayedProducts += 3;

    // Updating product display
    displayProducts(products.slice(0, displayedProducts));

    // If all products have already been displayed, remove the load more button
    if (displayedProducts >= products.length) {
      loadMoreButton.style.display = "none";
    }
  });
}

/* Minicart actions */

// Function to open minicart
function handleOpenMinicart() {
  const openCartButton = document.querySelector(".header__wrapper-cart button");
  const cartContainer = document.querySelector(".minicart__result");
  const cartOverlay = document.querySelector(".minicart__overlay");

  openCartButton.addEventListener("click", () => {
    cartContainer.classList.add("active");
    cartOverlay.classList.add("active");
  });
}

// Function to close minicart
function handleCloseMinicart() {
  const closeCartButton = document.querySelector(".minicart__close button");
  const overlayContainer = document.querySelector(".minicart__overlay");
  const cartContainer = document.querySelector(".minicart__result");
  const cartOverlay = document.querySelector(".minicart__overlay");

  closeCartButton.addEventListener("click", () => {
    cartContainer.classList.remove("active");
    cartOverlay.classList.remove("active");
  });

  overlayContainer.addEventListener("click", () => {
    cartContainer.classList.remove("active");
    cartOverlay.classList.remove("active");
  });
}

// Function to add a product to minicart
function handleAddProductToMinicart() {
  const buyButtons = document.querySelectorAll(".main__content-wrapper__clothes-ul__buy button");

  buyButtons.forEach(button => {
      button.addEventListener("click", () => {
          const productId = button.id;

          if (!selectedColor) {
            Toastify({
                text: "Por favor, selecione uma cor.",
                className: "toastify-error",
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                  background: "#f44336"
                }
            }).showToast();

            return;
          }

          if (!selectedSize) {
            Toastify({
                text: "Por favor, selecione um tamanho.",
                className: "toastify-error",
                gravity: "top",
                position: "center",
                stopOnFocus: true,
                style: {
                    background: "#f44336"
                }
            }).showToast();

            return;
          }

          const product = products.find((item: Product) => item.id === productId);

          if (product) {
              let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

              // Checking if product is in cart
              const isProductInCart = cartItems.some(
                (item: Product) => item.id === productId
              );

              if (!isProductInCart) {
                  cartItems.push(product);
                  localStorage.setItem("cart", JSON.stringify(cartItems));

                  Toastify({
                      text: "Produto adicionado ao carrinho.",
                      className: "toastify-success",
                      gravity: "top",
                      position: "center",
                      stopOnFocus: true,
                      style: {
                          background: "#43CD80"
                      }
                  }).showToast();

                  // Updating state functions
                  handleFilterClear();
                  handleShowTotalMinicart();
                  handleShowProductsInMinicart();
                  handleUpdateCartIndicator();
              } else {
                  Toastify({
                    text: "Este produto já está no carrinho.",
                    className: "toastify-success",
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true,
                    style: {
                      background: "#FB953E"
                    }
                  }).showToast();
              }
          }
      });
  });
}

// Function to remove a product to minicart
function removeFromCart(productId: string) {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  const index = cartItems.findIndex(
    (item: Product) => item.id === productId
  );
  
  if (index !== -1) {
    cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));

    handleShowTotalMinicart();
    handleUpdateCartIndicator();
  }
}

// Function to remove a product to minicart
function handleRemoveFromMinicart() {
  const deleteButtons = document.querySelectorAll(".minicart__content-list__delete button");

  deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = (button as HTMLButtonElement).dataset.productId;
      
      if (productId) {
        removeFromCart(productId);

        Toastify({
          text: "Produto removido do carrinho.",
          className: "toastify-success",
          gravity: "top",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "#FB953E"
          }
        }).showToast();

        const itemToRemove = button.closest('.minicart__content-list__item');

        if (itemToRemove) {
          itemToRemove.remove();
        }
      }
    });
  });
}

// Function to display products added to minicart
function handleShowProductsInMinicart() {
  if (localStorage.getItem("cart")) {
    const productsList = document.querySelector(".minicart__content-list");
    const products = JSON.parse(localStorage.getItem("cart"));
  
    productsList.innerHTML = "";
  
    products.forEach((product: Product, index: number) => {
      const li = document.createElement("li");
  
      li.innerHTML = `
        <div class="minicart__content-list__item">
          <div class="minicart__content-list__container">
            <div class="minicart__content-list__image">
              <picture>
                <img src="${product.image}" alt="${product.name}" title="${product.name}" />
              </picture>
            </div>
            <div class="minicart__content-list__info">
              <h3>${product.name}</h3>
              <span>R$${product.price.toFixed(2)}</span>
            </div>
          </div>
          <div class="minicart__content-list__delete">
            <button data-product-id="${product.id}" data-index="${index}">
              <img
                src="./img/delete-icon.png"
                alt="Remover produto"
                title="Remover produto"
              />
            </button>
          </div>
        </div>
      `;
  
      productsList.appendChild(li);
    });
  
    handleRemoveFromMinicart();
  }

}

// Function to calculate total displayed in minicart
function handleShowTotalMinicart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotalContainer = document.querySelector(".total");
  let subtotal = 0;

  cartItems.forEach((item: Product) => {
    subtotal += item.price * 1;
  });

  if (subtotalContainer) {
    subtotalContainer.textContent = `R$${subtotal.toFixed(2)}`;
  }
}

// Function to close mini cart when user prefers continue shopping
function handleContinueShoppingMinicart() {
  const continueShoppingButton = document.querySelector(".minicart__shop button") as HTMLButtonElement;
  const closeMinicartButton = document.querySelector(".minicart__close button") as HTMLButtonElement;

  continueShoppingButton.addEventListener("click", () => {
    closeMinicartButton.click();
  });
}

// Function to update quantity indicator in header
function handleUpdateCartIndicator () {
  if (localStorage.getItem("cart")) {
    const products = JSON.parse(localStorage.getItem("cart")).length ?? 0;
    const indicator = document.querySelector(".header__wrapper-indicator");
    indicator.textContent = products;
  }
}

// Main
function initializePage() {
  fetch(serverUrl)
    .then(response => response.json())
    .then((data: Product[]) => {
      products = data;

      let uniqueColors: Set<string> = new Set();
      let uniqueSizes: Set<string> = new Set();
      let uniquePrices: Set<number> = new Set();

      products.forEach(product => {
        uniqueColors.add(product.color);
        product.size.forEach(size => uniqueSizes.add(size));
        uniquePrices.add(product.price);
      });

      const colors = Array.from(uniqueColors).sort();
      const sizes = Array.from(uniqueSizes).sort();
      const prices = Array.from(uniquePrices).sort((a, b) => a - b);
      const categorizedPrices = categorizePrices(prices);

      displayColors(colors);
      displaySizes(sizes);
      displayPrices(categorizedPrices);
      displayProducts(products);

      const colorRadios = document.querySelectorAll('input[name="color"]');
      const sizeRadios = document.querySelectorAll('input[name="size"]');
      const priceRadios = document.querySelectorAll('input[name="price"]');

      colorRadios.forEach(radio => {
        radio.addEventListener("change", () => {
          const target = event.target as HTMLInputElement;
          selectedColor = target.value;
          selectedSize = null;
          selectedPriceRange = null;
          
          handleApplyFilters();
          updateSizeAvailability();
          updatePriceAvailability();
        });
      });

      sizeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
          const target = event.target as HTMLInputElement;
          selectedSize = target.value;
          handleApplyFilters();
          updatePriceAvailability();
        });
      });

      priceRadios.forEach(radio => {
        radio.addEventListener("change", () => {
          const target = event.target as HTMLInputElement;
          selectedPriceRange = target.value;
          handleApplyFilters();
        });
      });

      handleShowProductsInMinicart();
    })
    .catch(error => {
      console.error('Erro ao buscar produtos:', error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initializePage();
  handleOpenOrberBy();
  orderByMostRecent();
  orderByLowestPrice();
  orderByHighestPrice();
  handleOpenMobileFilter();
  handleOpenMobileColorsFilter();
  handleOpenMobileSizesFilter();
  handleOpenMobilePricesFilter();
  handleFilterApply();
  handleFilterClear();
  handleOpenMinicart();
  handleCloseMinicart();
  handleUpdateCartIndicator();
  handleContinueShoppingMinicart();
  handleLoadMoreProducts();
});