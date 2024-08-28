import { getAllProducts } from "./api/products.js";
import { mapProductToCard } from "./utils/layout.js";

document.addEventListener("DOMContentLoaded", displayAllProducts);
const mainContainer = document.querySelector(".main");
const categoryFilterContainer = document.querySelector(".category");

async function displayAllProducts() {
  const products = await getAllProducts();
  mainContainer.innerHTML = products.map(mapProductToCard).join(" ");

  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-id");
      const price = button.getAttribute("data-price");
      const name = button.getAttribute("data-name");
      const imageUrl = button.getAttribute("data-image");
      const stock = button.getAttribute("data-stock");

      let cart = JSON.parse(localStorage.getItem("cart")) || {};
      if (cart[productId]) {
        if (Number(stock) > cart[productId].quantity) {
          cart[productId].quantity += 1;
        }
      } else {
        cart[productId] = {
          quantity: 1,
          price: price,
          name: name,
          imageUrl: imageUrl,
          stock: stock,
        };
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });
  // Calculate the quantity of products for each category
  const categoryCounts = products.reduce((count, product) => {
    count[product.category] = (count[product.category] || 0) + 1;
    return count;
  }, {});

  // Get the unique categories
  const uniqueCategories = Object.keys(categoryCounts);

  // Populate the filter container with category checkboxes
  categoryFilterContainer.innerHTML += uniqueCategories
    .map(
      (category) =>
        `
    <div class="category-filter flex p-2">
      <input type="checkbox" id="checkbox${category}" name="category" data-category="${category}">
      <label for="checkbox${category}" data-category="${category}">${category}<span>(${categoryCounts[category]})</span></label>
    </div>
    `
    )
    .join("");

  // Handle changes to category checkboxes
  categoryFilterContainer.addEventListener("change", (e) => {
    if (e.target.name === "category") {
      const checkboxes = document.querySelectorAll('input[name="category"]');
      checkboxes.forEach((checkbox) => {
        if (checkbox !== e.target) {
          checkbox.checked = false;
        }
      });
    }
  });

  // Handle clicks to filter products by category
  categoryFilterContainer.addEventListener("click", (e) => {
    const category = e.target.getAttribute("data-category");
    if (category) {
      mainContainer.innerHTML = products
        .filter((product) => category === product.category)
        .map(mapProductToCard)
        .join(" ");
    }
  });
}
