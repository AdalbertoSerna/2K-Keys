function waitForCart() {
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            if (window.cart !== undefined) {
                clearInterval(intervalId);
                resolve();
            }
        }, 100); // Adjust the interval as needed
    });
}
document.addEventListener('DOMContentLoaded', function () {
	console.log("navBarScripts.js loaded");
    const cartOverlay = document.getElementById('cart-overlay');
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart');
	const subtotalText = document.getElementById('subtotalText');
	const checkoutButton = document.getElementById('checkout-button');
    const cartItemsList = document.querySelector('.cart-items-list');
	const cartBadge = document.getElementById('cart-badge');

	const currentPath = window.location.pathname;
	const containsIndexHtml = currentPath.indexOf("index.html") !== -1;

	subtotal = 0;
	totalItems = 0;
	
    cartButton.addEventListener('click', function () {
        toggleCart();
    });

    closeCartButton.addEventListener('click', function () {
        toggleCart();
    }); 

    function toggleCart() {
        // Toggle the cart overlay
        cartOverlay.style.right = cartOverlay.style.right === '0%' ? '-45%' : '0%';

        // Toggle the body class to hide/show the scrollbar
        document.body.classList.toggle('cart-overlay-open');
    }

	function showPopupMessage(message) {
		const popupMessage = document.getElementById('popup-message');
		if (popupMessage) {
			popupMessage.textContent = message;
			popupMessage.style.display = 'block';
	  
		  	// Hide the message after 3 seconds (adjust as needed)
		  	setTimeout(() => {
				popupMessage.style.display = 'none';
			}, 3000);
		}
	}
    
	
    function updateCartDisplay() {
		
		quantity=1;
		// Clear the current cart display
		cartItemsList.innerHTML = '';
		subtotal=0;
		totalItems=0;
		// Render each item in the cart
		window.cartItems.forEach(item => {
			// Create a div element to hold the card HTML
			const cardDiv = document.createElement('div');
			cardDiv.innerHTML = getCardHTML(item);
			console.log(item.Quantity);
			cartItemsList.appendChild(cardDiv);

		});

		cartBadge.textContent = totalItems.toString();
		subtotalText.innerHTML = `<strong>Subtotal (${totalItems} items):</strong> $${subtotal.toFixed(2)}`;

	}

    function getCardHTML(product) {
        const cartQuantity = product.Quantity || 1; 
		totalItems += cartQuantity;
        subtotal += parseFloat(product.Price) * cartQuantity;
        // HTML structure for the cart item
        return  `
        <div class="cart-item">
            <div class="item-image">
                <img src="${product.ImageURL}" alt="${product.ProductNames} Image">
            </div>
            <div class="item-details">
                <div class="item-name">
                    ${product.ProductNames}
                    <button id="trash-item" class="btn-close" aria-label="Close" data-item-id="${product.ProductID}"></button>
                </div>
                <div class="item-quantity">
					<button class="btn-quantity decrease" data-item-id="${product.ProductID}">-</button>
                	<input id="qty-input-${product.ProductID}" type="text" class="quantity-input" value="${cartQuantity}" data-item-id="${product.ProductID}">
					<button class="btn-quantity increase" data-item-id="${product.ProductID}">+</button>
				</div>
                <div class="item-total">
                    <span class="price-breakdown">${product.Quantity > 1
                        ? `$${product.Price} x ${product.Quantity} <span class="total-price">$${(product.Price * product.Quantity).toFixed(2)}</span>`
                        : `<span class="total-price">$${product.Price}</span>`
                    }</span>
                </div>
            </div>
        </div>
    `;
    }
	
	function decreaseQuantity(itemId) {
        const cartItem = window.cartItems.find(item => item.ProductID == itemId);
        if (cartItem && cartItem.cartQuantity > 1) {
            cartItem.Quantity--;
			removeItemFromCart(itemId, cartItem.Quantity);
            updateCartDisplay();
        }
    }

    function increaseQuantity(itemId) {
        const item = window.cartItems.find(item => item.ProductID == itemId);
        if (item) {
            item.Quantity++;
			addItemToCartDB(itemId, item.Quantity);
            updateCartDisplay();
        }
    }
	
    
   cartItemsList.addEventListener('click', function (event) {
        const target = event.target;

        // Check if the clicked element is a quantity button
        if (target.classList.contains('btn-quantity') || target.classList.contains('btn-close')) {
            const itemId = target.getAttribute('data-item-id');
            // Check if it's a decrease or increase button
            if (target.classList.contains('decrease')) {
                decreaseQuantity(itemId);
            } else if (target.classList.contains('increase')) {
                increaseQuantity(itemId);
            } else if (target.classList.contains('btn-close')){
				item = window.cartItems.find(cartItem => cartItem.ProductID == itemId);
				removeItemFromCart(itemId, item.Quantity);
				window.cartItems.pop(item);
		   	}
			
            // Update the cart display after modifying the quantity
			updateCartDisplay();
        }
	    
    });
	
	// Add an event listener for the input field
	cartItemsList.addEventListener('input', function (event) {
		const target = event.target;

		// Check if the input field is a quantity input
		if (target.classList.contains('quantity-input')) {
			const itemId = target.getAttribute('data-item-id');
			const newQuantity = target.value;

			updateQuantity(itemId, newQuantity);
			updateCartDisplay();
		}
	});

	function updateQuantity(itemId, newQuantity) {
		const item = cartItems.find(item => item.ProductID == itemId);

		if (item) {
			// Update the quantity based on the new input value
			const parsedQuantity = parseInt(newQuantity) || 1; // Use 1 if the input is not a valid number

			if (parsedQuantity > 0) {
				item.Quantity = parsedQuantity;
			} else {
				// If the new quantity is 0 or less, show a confirmation dialogue
				showConfirmationDialog(() => {
					// Callback function if the user clicks "OK"
					cartItems.splice(cartItems.indexOf(item), 1);
					updateCartDisplay();
				}, () => {
					// Callback function if the user clicks "Cancel" or closes the dialogue
					item.Quantity = 1;
					updateCartDisplay();
				});
			}
		}
	}

	
	function removeItemFromCart(pId, qty) {
		fetch('http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/cart/remove', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ productId: pId, quantity: qty}),
		})
		.then(response => response.json())
		.then(data => {
			console.log(data.message);
		})
		.catch(error => {
			console.error('Error adding product to cart on the server:', error);
		});
	}
	
	function addItemToCartDB(pId, qty) {
		console.log(window.cartItems);
		
		fetch('http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/cart/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ productId: pId, quantity: qty}),
		})
		.then(response => response.json())
		.then(data => {
			console.log(data.message);
		})
		.catch(error => {
			console.error('Error adding product to cart on the server:', error);
		});
		item = window.products.find(prod => prod.ProductID == pId);
		check = window.cartItems.find(prod => prod.ProductID == pId);
		if(check){
			// If the item is already in the cart, find its index in the array
			const index = window.cartItems.findIndex(prod => prod.ProductID == pId);

			// Update the quantity of the item at the found index
			window.cartItems[index].Quantity += 1;
		}else{
			window.cartItems.push({ ...item, Quantity: 1 });
		}
		showPopupMessage("Item Added To Cart");
		updateCartDisplay();
	}

	checkoutButton.addEventListener('click', function () {
		// Redirect to the checkout page
		localStorage.setItem('cartItems', JSON.stringify(cartItems));
		window.location.href = '/html/cartPage.html';
	});

	
	window.addItemToCartDB = addItemToCartDB;
	
	setTimeout(() => {
		updateCartDisplay();
	}, 500);
	
});



function addToCart(productId) {
	addItemToCartDB(productId, 1);
}

function getSalePrice(price){

	if(price < 15.00){

		return price*window.lowSalePrice;
	}else if (price <45){
		return price*window.medSalePrice;	  
  	}else{
		return price*window.highSalePrice;
	}
}