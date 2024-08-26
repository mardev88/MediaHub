import { getAllProducts } from "./api/products.js";
import { mapProductToCard } from "./utils/layout.js";

document.addEventListener("DOMContentLoaded", displayAllProducts);
const mainContainer = document.querySelector(".main");
const brandFilterContainer = document.querySelector(".brand");

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
        cart[productId].quantity += 1;
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
  // Calculate the quantity of products for each brand
  const brandCounts = products.reduce((acc, product) => {
    acc[product.brand] = (acc[product.brand] || 0) + 1;
    return acc;
  }, {});

  const uniqueBrands = Object.keys(brandCounts);

  brandFilterContainer.innerHTML += uniqueBrands
    .map(
      (brand) =>
        `
    <div class="brand-filter flex">
      <input type="checkbox" id="checkbox${brand}" name="brand" data-brand=${brand}>
      <label for="checkbox${brand}" data-brand=${brand}>${brand}<span>(${brandCounts[brand]})</span></label>
    </div>
    `
    )
    .join("");

  // Ensure only one checkbox can be checked at a time
  brandFilterContainer.addEventListener("change", (e) => {
    if (e.target.name === "brand") {
      const checkboxes = document.querySelectorAll('input[name="brand"]');
      checkboxes.forEach((checkbox) => {
        if (checkbox !== e.target) {
          checkbox.checked = false;
        }
      });
    }
  });

  brandFilterContainer.addEventListener("click", (e) => {
    const brand = e.target.getAttribute("data-brand");
    if (brand) {
      mainContainer.innerHTML = products
        .filter((product) => brand === product.brand)
        .map(mapProductToCard)
        .join(" ");
    }
  });
}
