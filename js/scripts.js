/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/

document.addEventListener("DOMContentLoaded", function () {
	// Get Reference to the Product Container, which will hold all the items
	const productContainer = document.getElementById("product-container");
	const filterSelect = document.getElementById("filter");
	
	productContainer.style.minHeight = filterSelect.offsetHeight + 'px';
	// Get the product ID from the URL query parameter
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get("id");
	
	// Fetch the product data from the database Once we have a db
	// Temporary data here for testing
	const data = [
		{
			"id": "1",
			"name": "Windows 10 Home Key",
			"price": "$20.00",
			"salePrice": "",
			"image": "winKeyImg.jpg",
			"tags": ["microsoft", "OS"]
		},
		{
			"id": "2",
			"name": "Baldurs Gate 3 (PC) Key",
			"price": "$34.00",
			"salePrice": "",
			"image": "bg3KeyImg.jpg",
			"tags": ["game", "rpg", "open world", "PC"]
			
		},
		{
			"id": "3",
			"name": "Starfield (PC) Key",
			"price": "$38.00",
			"salePrice": "$29.99",
			"image": "stfKeyImg.jpg",
			"tags": ["game", "rpg", "open world", "sale"]
			
		},
		{
			"id": "4",
			"name": "Windows 10 Home Key",
			"price": "$20.00",
			"salePrice": "",
			"image": "winKeyImg.jpg",
			"tags": ["microsoft", "OS"]
		},
		{
			"id": "5",
			"name": "Baldurs Gate 3 (PC) Key",
			"price": "$34.00",
			"salePrice": "",
			"image": "bg3KeyImg.jpg",
			"tags": ["game", "rpg", "open world", "PC"]
			
		},
		{
			"id": "6",
			"name": "Starfield (PC) Key",
			"price": "$38.00",
			"salePrice": "$29.99",
			"image": "stfKeyImg.jpg",
			"tags": ["game", "rpg", "open world", "sale"]
			
		},
	];

	
	// Temporary loading of data till we have DB
	data.forEach((product) => {
		const card = createProductCard(product);
		productContainer.appendChild(card);
	})
	
	
	// Function to add product cards to the page 
	function createProductCard(product) {
		// Create a new element for the product card
		const cardDiv = document.createElement("div");
		
	
		// Check if there is a sale
		const hasSalePrice = product.salePrice !== "";
		let realPrice = parseFloat(product.price.replace("$", "").split(" - ")[0]);

		// Calculate the sale percentage
		let salePercentage = "";
		if (hasSalePrice) {
			const regularPrice = parseFloat(product.price.replace("$", "").split(" - ")[0]);
			const salePrice = parseFloat(product.salePrice.replace("$", ""));
			const discount = regularPrice - salePrice;
			salePercentage = `${((discount / regularPrice) * 100).toFixed(0)}% Off!`;
			realPrice-=discount;
		}
		
		// Populate the card with product data
		cardDiv.innerHTML = `
			<div class="card h-100",id="${product.id}" card-name="${product.name}" data-categories="${product.tags.join(" ")}", data-price="${realPrice}">
				<img class="card-img-top" src="assets/${product.image}" alt="Product Image" />
				<div class="card-body p-4">
					<div class="text-center">
						<h5 class="fw-bolder">${product.name}</h5>
						<p>
							${hasSalePrice
								? `<del>${product.price}</del> ${product.salePrice}`
								: product.price}
						</p>
						${hasSalePrice ? `<p class="text-danger">${salePercentage}</p>` : ""}
					</div>
				</div>
				<div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
					<div class="text-center">
						<a class="btn btn-outline-dark mt-auto" href="html/product.html?id=${product.id}">View Product</a>
					</div>
				</div>
			</div>
		`;
		return cardDiv;
	}
	
	// Get reference to the select drop down
	const sortSelect = document.getElementById("sort-select");
	sortSelect.addEventListener("change", function () {
		filterProducts();
	});
	
	// Get reference to the search bar and search input, add lister to the button 
	const searchButton = document.getElementById('search-button');
	const searchInput = document.getElementById('search-input');
	const clearButton = document.getElementById('clear-button');
	let searchTerm = "";
	
	// Add an event listener for the input field
	searchInput.addEventListener('input', () => {
		if (searchInput.value) {
			// If there's text in the input, show the clear button
			clearButton.style.display = 'block';
		} else {
			// If the input is empty, hide the clear button
			clearButton.style.display = 'none';
		}
	});

	// Function to clear the search input
	function clearSearch() {
		searchInput.value = '';
		clearButton.style.display = 'none';
		// Trigger filter to reset
		searchTerm = searchInput.value.toLowerCase();
		filterProducts();
	}
	// Add an event listener for the clear button to call clearSearch
	clearButton.addEventListener('click', clearSearch);
	
	
	// Search button event listner
	searchButton.addEventListener('click', () => {
		searchTerm = searchInput.value.toLowerCase(); // Convert search term to lowercase for case-insensitive search
		filterProducts();
	});
	
	// Listen for the "keydown" event on the search input field
	searchInput.addEventListener('keyup', (event) => {
		if ((event.key === 'Enter' || event.keyCode === 13) && searchInput === document.activeElement) {
			// Prevent the default form submission behavior
			event.preventDefault();
			
			searchTerm = searchInput.value.toLowerCase();
			filterProducts();
			searchInput.blur();
		}
	});

	// Get reference to the filter checkboxes
	const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
	const priceCheckboxes = document.querySelectorAll('input[name="price"]');

	// Event listener for category checkboxes
	categoryCheckboxes.forEach((checkbox) => {
		checkbox.addEventListener("change", function () {
			filterProducts();
		});
	});

	// Event listener for price checkboxes
	priceCheckboxes.forEach((checkbox) => {
		checkbox.addEventListener("change", function () {
			filterProducts();
		});
	});

	const allCards = productContainer.querySelectorAll(".card");

	// Function to filter products based on selected checkboxes
	function filterProducts() {
		// Get the selected category filters
		const selectedCategories = Array.from(categoryCheckboxes)
			.filter((checkbox) => checkbox.checked)
			.map((checkbox) => checkbox.value);

		// Get the selected price filters
		const selectedPrices = Array.from(priceCheckboxes)
			.filter((checkbox) => checkbox.checked)
			.map((checkbox) => parseFloat(checkbox.value));

		// Function to check if a product card matches the selected filters
		function productMatchesFilters(card) {
			const cardCategoriesAttribute = card.getAttribute("data-categories");
			if (!cardCategoriesAttribute) {
				// Handle the case where data-categories is missing or empty
				return selectedCategories.length === 0;
			}
			
			
			
			// Check filter conditions
			const cardName = card.getAttribute("card-name");
			const searchTermMatch = searchTerm === "" || cardName.toLowerCase().includes(searchTerm);
			
			const cardCategories = cardCategoriesAttribute.split(" ");
			const categoryFilterMatch = selectedCategories.length === 0 || selectedCategories.every((category) => cardCategories.includes(category));
			
			const cardPrice = parseFloat(card.getAttribute("data-price"));
			const priceFilterMatch = selectedPrices.length === 0 || selectedPrices.some((price) => cardPrice <= price );
		
			return categoryFilterMatch && priceFilterMatch && searchTermMatch;
		}
		
		
		
		const visibleCards = [];
		const hiddenCards=[];

		// Apply the filters to each product card
		allCards.forEach((card) => {
			if (productMatchesFilters(card)) {
				if (hiddenCards.includes(card)){
					hiddenCards.remove(card)
					visibleCards.push(card)

				} else {
					visibleCards.push(card);
				}
			} else {
				hiddenCards.push(card);
			}
		});
		
		const sortOption = sortSelect.value;
		
		// Sort the card list based on the input
		if(sortOption != "default"){
			if (sortOption == "price-low-to-high"){
				visibleCards.sort((a, b)=>{
					const priceA = parseFloat(a.getAttribute('data-price'));
					const priceB = parseFloat(b.getAttribute('data-price'));
					return priceA - priceB
				});
			} else {
				visibleCards.sort((a, b)=>{
					const priceA = parseFloat(a.getAttribute('data-price'));
					const priceB = parseFloat(b.getAttribute('data-price'));
					return priceB - priceA
				});
			}
		}
	
		// Append the visible to the container and remove the hidden cards. Currently has an append as im trying to figure out null conditions
		visibleCards.forEach((card) => productContainer.appendChild(card));
		hiddenCards.forEach((card) => {
			if(productContainer.contains(card)){productContainer.removeChild(card)}
		});
		
	}
	
	// Initial filter when the page loads; its empty, for some reason while loop is needed.
	while (productContainer.firstChild) {
		productContainer.removeChild(productContainer.firstChild);
	}
	filterProducts();
});