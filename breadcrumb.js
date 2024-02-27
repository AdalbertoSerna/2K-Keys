document.addEventListener("DOMContentLoaded", function () {
    const breadcrumb = document.getElementById("breadcrumb");
    const productName = document.getElementById("product-name");

    // Get the product ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
        fetchProductDetails(productId);
    } else {
        setDefaultBreadcrumb();
    }

    function setDefaultBreadcrumb() {
        breadcrumb.innerHTML = '<a href="index.html">Home</a> <span class="separator">> </span> <a href="shopPage.html">All Products</a>';
        sessionStorage.setItem("breadcrumb", breadcrumb.innerHTML);
    }

    function fetchProductDetails(id) {
        setDefaultBreadcrumb();
		if (id === "all-products") {
            return;
        }
		
        const previousBreadcrumb = sessionStorage.getItem("breadcrumb");
        const breadcrumbTrail = previousBreadcrumb ? previousBreadcrumb.split('<span class="separator">> </span>') : [];

        // Check if the current product name is already in the breadcrumb trail
        const isProductInBreadcrumb = breadcrumbTrail.includes(productName.textContent);

        if (!isProductInBreadcrumb) {
            breadcrumbTrail.push(productName.textContent);
        }

        const updatedBreadcrumb = breadcrumbTrail.join('<span class="separator">> </span>');

        breadcrumb.innerHTML = updatedBreadcrumb;
        sessionStorage.setItem("breadcrumb", updatedBreadcrumb);
    }
});
    