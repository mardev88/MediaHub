export function mapProductToCard(product) {
  return `
				<div class="product-card flex-col gap-20 items-center justify-between">
					<h3 class="card-title">${product.name}</h3>
               <a href="../pages/details.html?id=${product.id}">
                  <img src=${product.imageUrl} width="150px"/>
               </a>
					<p class="card-price">${product.price} lei</p>
				</div>
      		`;
}

export function mapProductToAdminTableRow(product) {
  return `
            <tr>
               <td>${product.name}</td>
               <td>${product.price}</td>
               <td class="white">
                  <a href="details.html?id=${product.id}">
                     <img src="${product.imageUrl}" width="50px" />
                  </a>
               </td>
               <td>
                  <button class="btn edit-${product.id}">
                     <i class="fa-regular fa-pen-to-square fa-lg">
                     </i>
                  </button>
               </td>
               <td>
                  <button class="btn delete-${product.id}">
                     <i class="fa-regular fa-trash-can fa-lg"></i>
                  </button>
               </td>
               
            </tr>
            `;
}
