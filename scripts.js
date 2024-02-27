/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/

console.log("scripts.js loaded");

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
console.log(window.isUserLoggedIn);
document.addEventListener("DOMContentLoaded", function () {
	
	const featuredCarousel = document.getElementById('featured-carousel');
	const newArivialsCarousel = document.getElementById('new-carousel');
	const popularCarousel = document.getElementById('popular-carousel');

  const carousels = [featuredCarousel, newArivialsCarousel, popularCarousel];
  const cardWidth = 250; // Adjust the width of your product cards
  const cardMargin = 10; // Adjust the margin between product cards
	
  // Populate the carousel with product cards
  function populateCarousel(carousel, products){
    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('card');
      
      card.style.margin=`0 10px`;
      card.innerHTML = `
			<div class="card h-100" id="${product.ProductID}" card-name="${product.ProductNames}" data-categories="${product.Category}" card-description="${product.Description}" data-price="${product.Price}">
				<img class="card-img-top" src="${product.ImageURL}" alt="Product Image" />
				<div class="card-body p-4">
					<div class="text-center">
						<h5 class="fw-bolder">${product.ProductNames}</h5>
						<p>  $${product.Price} </p>
					</div>
				</div>
				<div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
					<div class="text-center" id="button-container">
						<a id="add-to-cart-button" data-product-id="${product.ProductID}" class="btn btn-primary mb-2"href="#">Add to Cart</a>
						<a class="btn btn-outline-dark" href="product.html?id=${product.ProductID}">View Product</a>
					</div>
				</div>
			</div>
		`;
      carousel.appendChild(card);
      const totalWidth = (cardWidth + cardMargin) * products.length;
      carousel.style.width = `${totalWidth}px`;
    });
  }
  // Enable carousel functionality (you may use a library like Slick, Owl Carousel, etc.)
  // Example with vanilla JavaScript:
  let position = 0;

  function handleCarouselNavigation(carousel, direction) {
    const stepSize = (cardWidth + cardMargin);
    let position = parseInt(carousel.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
  
    if (direction === 'next') {
      position -= stepSize;
      console.log(carousel.scrollWidth);
      if (position < -carousel.scrollWidth/2) {
        position = 0;
      }
    } else if (direction === 'prev') {
      position += stepSize;
      if (position > 0) {
        position = -carousel.scrollWidth + carousel.clientWidth;
      }
    }
    
    position = Math.round(position);
    console.log(position);

    carousel.style.transition = 'transform 0.5s ease-in-out';
    carousel.style.transform = `translateX(${position}px)`;
    setTimeout(() => {
      carousel.style.transition = 'none';
    }, 300);
  }

	waitForProducts().then(() => {
		featuredList = [];
		popularList = [];
		saleList = [];
		
		window.products.forEach((product) => {
			if (product.Category === 'featured'){
				featuredList.push(product);
				
			}else if(product.Category === 'popular'){
				popularList.push(product);
			}else if(product.Category === 'sale'){
				saleList.push(product);
			}
		});
		populateCarousel(featuredCarousel, featuredList);
		populateCarousel(popularCarousel, popularList);
		populateCarousel(newArivialsCarousel, saleList);
		
	});
//  

  document.getElementById('next-btn-featured').addEventListener('click', function () {
    handleCarouselNavigation(featuredCarousel, 'next');
  });

  document.getElementById('prev-btn-featured').addEventListener('click', function () {
    handleCarouselNavigation(featuredCarousel, 'prev');
  });

  document.getElementById('next-btn-new').addEventListener('click', function () {
    handleCarouselNavigation(newArivialsCarousel, 'next');
  });

  document.getElementById('prev-btn-new').addEventListener('click', function () {
    handleCarouselNavigation(newArivialsCarousel, 'prev');
  });

  document.getElementById('next-btn-popular').addEventListener('click', function () {
    handleCarouselNavigation(popularCarousel, 'next');
  });

  document.getElementById('prev-btn-popular').addEventListener('click', function () {
    handleCarouselNavigation(popularCarousel, 'prev');
  });
	

});