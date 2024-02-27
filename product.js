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
    // Get the product ID from the URL query parameter
	const urlParams = new URLSearchParams(window.location.search);
	const productId = urlParams.get("id");

	var addToCartButton = document.getElementById("addbtn");

	waitForProducts().then(() => {
		if (productId) {
			fetchProductDetails(productId);
		}
		
	});
	
    addToCartButton.addEventListener("click", function () {
		window.addToCart(productId);
    });

    
    function fetchProductDetails(id) {
		
        product = window.products.find(item => item.ProductID === parseInt(id));
		
		console.log(product);
        if (product) {
            // Update the product details on the product.html page
            updateProductDetailsPage(product);
        } else {
            // Handle the case when the product is not found (e.g., display an error message)
            console.log("Product not found");
        }
    }

    function updateProductDetailsPage(product) {
        // Update the product banner image, name, description, and price
        document.getElementById("product-banner").src = `${product.ImageURL}`;
        document.getElementById("product-name").textContent = product.ProductNames;
        document.getElementById("product-description").textContent = product.Description;
        document.getElementById("product-price").textContent = '$'+product.Price;
		document.getElementById("product-qty").textContent = 'Qty: '+product.Quantity;
	}

});