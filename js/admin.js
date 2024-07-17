const url = "https://668d7a4f099db4c579f3175c.mockapi.io/products";

// Load products in table at page loading
const productsTableBody = document
  .getElementById("products-table")
  .querySelector("tbody");

document.addEventListener("DOMContentLoaded", displayAllProducts);

function getAllProducts() {
  return fetch(url).then((response) => response.json());
}
function getProductById(id) {
  return fetch(`${url}/${id}`).then((response) => response.json());
}

function displayAllProducts() {
  getAllProducts().then((products) => {
    productsTableBody.innerHTML = products
      .map(
        (product) => `
            <tr>
               <td>${product.name}</td>
               <td>${product.price}</td>
               <td class="white">
                  <img src="${product.imageUrl}" width="50px" />
               </td>
               <td>
                  <button class="edit-${product.id}">
                     <i class="fa-regular fa-pen-to-square">
                     </i>
                  </button>
               </td>
               <td>
                  <button class="delete-${product.id}">
                     <i class="fa-regular fa-trash-can"></i>
                  </button>
               </td>
               
            </tr>
            `
      )
      .join("");
  });
}

// save new product
const form = document.getElementById("product-form");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageUrlInput = document.getElementById("image-url");
const detailsInput = document.getElementById("details");
const categoryInput = document.getElementById("category");
const brandInput = document.getElementById("brand");
const saveProductButton = document.getElementById("save-btn");
let editMode = false;
let currentEditableProductId;

saveProductButton.addEventListener("click", saveProduct);
console.log(
  nameInput,
  priceInput,
  imageUrlInput,
  detailsInput,
  categoryInput,
  brandInput
);

function saveProduct(event) {
  event.preventDefault();

  const product = {
    name: nameInput.value,
    price: Number(priceInput.value),
    imageUrl: imageUrlInput.value,
    details: detailsInput.value,
    category: categoryInput.value,
    brand: brandInput.value,
  };

  console.log(JSON.stringify(product), product);

  fetch(editMode ? `${url}/${currentEditableProductId}` : url, {
    method: editMode ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }).then(() => {
    form.reset();
    displayAllProducts();
    editMode = false;
  });
}

productsTableBody.addEventListener("click", handleActions);

function handleActions(event) {
  const className = event.target.parentElement.className;
  if (className.includes("edit")) {
    const productId = className.split("-")[1];
    editProduct(productId);
  } else if (className.includes("delete")) {
    const productId = className.split("-")[1];
    deleteProduct(productId);
  }
}
function editProduct(id) {
  getProductById(id).then((product) => {
    editMode = true;
    nameInput.value = product.name;
    priceInput.value = product.price;
    imageUrlInput.value = product.imageUrl;
    detailsInput.value = product.details;
    categoryInput.value = product.category;
    brandInput.value = product.brand;

    currentEditableProductId = product.id;
  });
}

function deleteProduct(id) {
  fetch(`${url}/${id}`, {
    method: "DELETE",
  }).then(() => {
    displayAllProducts();
  });
}
