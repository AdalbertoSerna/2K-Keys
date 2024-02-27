function waitForProducts() {
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            if (window.products !== undefined) {
                clearInterval(intervalId);
                resolve();
            }
        }, 100); // Adjust the interval as needed
    });
}
document.addEventListener("DOMContentLoaded", function () {
	console.log("shopPage.js loaded");

	// Get References
	const productContainer = document.getElementById("product-container");
	const filterSelect = document.getElementById("filter");
	const sortSelect = document.getElementById("sort-select");
	const searchButton = document.getElementById('search-button');
	const searchInput = document.getElementById('search-input');
	const clearButton = document.getElementById('clear-button');
	const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
	const priceCheckboxes = document.querySelectorAll('input[name="price"]');

	productContainer.style.minHeight = filterSelect.offsetHeight + 'px';

	
	function removeEmptyDivs(container) {
    const emptyDivs = Array.from(container.children).filter((child) => {
        // Filter out elements that are empty divs
        return child.tagName.toLowerCase() === 'div' && child.innerHTML.trim() === '';
    });

    emptyDivs.forEach((emptyDiv) => {
        container.removeChild(emptyDiv);
    });
	}	
	
	waitForProducts().then(() => {
		window.products.forEach((product) => {
			const card = createProductCard(product);
			productContainer.appendChild(card);
		});
	});
	
	window.addEventListener('productsLoaded', () => {
        console.log('Products are loaded!');
        waitForProducts().then(() => {
            // Process your products after they are loaded
            allCards = productContainer.querySelectorAll(".card");
            filterProducts();
        });
    });
	
	const productsLoadedEvent = new Event('productsLoaded');
	window.dispatchEvent(productsLoadedEvent);

	
	// Function to add product cards to the page 
	function createProductCard(product) {
		// Create a new element for the product card
		const cardDiv = document.createElement("div");
		cardDiv.classList.add("card", "h-100");
		cardDiv.style.height = "500px";
		cardDiv.id = product.ProductID;
		cardDiv.setAttribute("card-name", product.ProductNames);
		cardDiv.setAttribute("data-categories", product.Category);
		cardDiv.setAttribute("card-description", product.Description);
		cardDiv.setAttribute("data-price", product.Price);
		cardDiv.setAttribute("data-qty", product.Quantity);
		// Create and append the card content
		const img = document.createElement("img");
		img.classList.add("card-img-top");
		img.src = product.ImageURL;
		img.alt = "Product Image";
		cardDiv.appendChild(img);

		const cardBody = document.createElement("div");
		cardBody.classList.add("card-body", "p-4");

		const textCenterDiv = document.createElement("div");
		textCenterDiv.classList.add("text-center");

		const productName = document.createElement("h6");
		productName.classList.add("fw-bolder");
		productName.textContent = product.ProductNames;

		const priceParagraph = document.createElement("p");
		priceParagraph.textContent = `$${product.Price}`;

		const quantityText = document.createTextNode(`Qty: ${product.Quantity}`);

		textCenterDiv.appendChild(productName);
		textCenterDiv.appendChild(priceParagraph);
		textCenterDiv.appendChild(quantityText);

		cardBody.appendChild(textCenterDiv);
		cardDiv.appendChild(cardBody);

		const cardFooter = document.createElement("div");
		cardFooter.classList.add("card-footer", "p-4", "pt-0", "border-top-0", "bg-transparent");

		const buttonContainer = document.createElement("div");
		buttonContainer.classList.add("text-center");

		const addToCartButton = document.createElement("a");
		addToCartButton.id = "add-to-cart-button";
		addToCartButton.setAttribute("data-product-id", product.ProductID);
		addToCartButton.classList.add("btn", "btn-primary", "mb-2");
		addToCartButton.href = "#";
		addToCartButton.textContent = "Add to Cart";

		const viewProductButton = document.createElement("a");
		viewProductButton.classList.add("btn", "btn-outline-dark");
		viewProductButton.href = `product.html?id=${product.ProductID}`;
		viewProductButton.textContent = "View Product";

		buttonContainer.appendChild(addToCartButton);
		buttonContainer.appendChild(viewProductButton);
		cardFooter.appendChild(buttonContainer);
		cardDiv.appendChild(cardFooter);

		return cardDiv;
	}
	sortSelect.addEventListener("change", function () {
		filterProducts();
	});
	
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

	allCards = productContainer.querySelectorAll(".card");
	
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
			cardCategoriesAttribute = card.getAttribute("data-categories");
			cname = card.getAttribute('card-name').toLowerCase();
			if (cname.includes('windows') || cname.includes('microsoft')){
				cardCategoriesAttribute += ' microsoft';
			}else if (cname.toLowerCase().includes('game')){
				cardCategoriesAttribute += ' game';
			}
			if (!cardCategoriesAttribute) {
				// Handle the case where data-categories is missing or empty
				return selectedCategories.length === 0;
			}
			
			// Check filter conditions
			const cardName = card.getAttribute("card-name");
			const searchTermMatch = searchTerm === "" || cardName.toLowerCase().includes(searchTerm) || card.getAttribute('card-description').toLowerCase().includes(searchTerm);
			
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
		

		// Get the sort type
		const sortOption = sortSelect.value;
		// Sort the card list based on the input
		if(sortOption != "default"){
			if (sortOption == "price-low-to-high"){
				visibleCards.sort((a, b)=>{
					const priceA = parseFloat(a.getAttribute('data-price'));
					const priceB = parseFloat(b.getAttribute('data-price'));
					return priceA - priceB
				});
			} else if (sortOption == "price-high-to-low"){
				visibleCards.sort((a, b)=>{
					const priceA = parseFloat(a.getAttribute('data-price'));
					const priceB = parseFloat(b.getAttribute('data-price'));
					return priceB - priceA
				});
			}else if(sortOption == "qty-low-to-high"){
				visibleCards.sort((a, b)=>{
					const priceA = parseFloat(a.getAttribute('data-qty'));
					const priceB = parseFloat(b.getAttribute('data-qty'));
					return priceA - priceB
				});	 
			}else{
				visibleCards.sort((a, b)=>{
					const priceA = parseFloat(a.getAttribute('data-qty'));
					const priceB = parseFloat(b.getAttribute('data-qty'));
					return priceB - priceA
				});	
			}
		}
	
		// Append the visible to the container and remove the hidden cards. Currently has an append as im trying to figure out null conditions
		visibleCards.forEach((card) => productContainer.appendChild(card));
		hiddenCards.forEach((card) => {
			if(productContainer.contains(card)){productContainer.removeChild(card)}
		});

		sessionStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
		sessionStorage.setItem('selectedPrices', JSON.stringify(selectedPrices));
		sessionStorage.setItem('selectedSortMethod', sortOption);
	}
	
	// Load and apply filter selections from sessionStorage
	const savedCategories = JSON.parse(sessionStorage.getItem('selectedCategories'));
	const savedPrices = JSON.parse(sessionStorage.getItem('selectedPrices'));
	const savedSortMethod = sessionStorage.getItem('selectedSortMethod');

	if (savedCategories) {
		// Apply saved category selections to checkboxes
		savedCategories.forEach((category) => {
			const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
			if (checkbox) {
				checkbox.checked = true;
			}
		});
	}
	if (savedPrices) {
		// Apply saved price selections to checkboxes
		savedPrices.forEach((price) => {
			const checkbox = document.querySelector(`input[name="price"][value="${price}"]`);
			if (checkbox) {
				checkbox.checked = true;
			}
		});
	}
	if (savedSortMethod) {
		sortSelect.value = savedSortMethod;
	}

	// Initial filter when the page loads; its empty, for some reason while loop is needed.
	while (productContainer.firstChild) {
		productContainer.removeChild(productContainer.firstChild);
	}
	
    productContainer.addEventListener("click", function (event) {
		if (event.target.matches('.card-footer #add-to-cart-button')) {
			const addToCartButton = event.target.closest('.card-footer #add-to-cart-button');

			event.preventDefault(); // Prevent the default link behavior
			const productId = addToCartButton.closest('.card').getAttribute('id');
			

			// Check if the addToCart function is defined in navBarScript.js
        if (typeof window.addToCart === "function") {
            window.addToCart(productId);
        }
	}
    });
});