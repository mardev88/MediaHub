document.addEventListener("DOMContentLoaded", showProductDetails);

const url = "https://668d7a4f099db4c579f3175c.mockapi.io/products";

async function showProductDetails() {
  const urlSearchParam = new URLSearchParams(window.location.search);
  const productId = urlSearchParam.get("id");

  const response = await fetch(`${url}/${productId}`);
  const product = await response.json();

  document.querySelector(
    ".main"
  ).innerHTML = `<h2>${product.details}</h2> <img src="${product.imageUrl}"/>`;
}
