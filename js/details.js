document.addEventListener("DOMContentLoaded", showProductDetails);

const url = "https://668d7a4f099db4c579f3175c.mockapi.io/products";

async function showProductDetails() {
  const urlSearchParam = new URLSearchParams(window.location.search);
  const productId = urlSearchParam.get("id");

  try {
    const response = await fetch(`${url}/${productId}`);
    const product = await response.json();
    const stock = product.stock;

    document.querySelector(".main").innerHTML = `
      <h2>${product.name}</h2> 
      <div class="details-container flex">
        <img height="400px" src="${product.imageUrl}" />
        <div class="details">
          <p>${product.details}</p>
          <p>Pret : ${product.price} lei</p>
          <p>${Number(stock) > 0 ? "In stoc" : "Stoc epuizat"}, ${
      product.stock
    } buc.</p>
          <div>
            <label for="quantity">Cantitate:</label>
            <input type="number" id="quantity" value="1" min="1" max="${stock}" />
          </div>
          <button id="addToCartButton">Adauga in cos</button>
        </div>
      </div>
    `;

    const addToCartButton = document.getElementById("addToCartButton");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", () => {
        const quantityInput = document.getElementById("quantity");
        let quantity = Number(quantityInput.value);
        if (quantity > stock) {
          quantity = stock;
        } else if (quantity < 1) {
          quantity = 1;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || {};

        if (cart[productId]) {
          if (Number(stock) >= cart[productId].quantity + quantity) {
            cart[productId].quantity += quantity;
          } else {
            alert("Cantitatea solicitata depaseste stocul disponibil.");
          }
        } else {
          cart[productId] = {
            quantity: quantity,
            price: product.price,
            name: product.name,
            imageUrl: product.imageUrl,
            stock: stock,
          };
        }

        localStorage.setItem("cart", JSON.stringify(cart));
      });
    } else {
      console.error("Add to Cart button not found.");
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}
