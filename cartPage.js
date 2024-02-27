
document.addEventListener("DOMContentLoaded", function () {
    const promoButton = document.getElementById('promo-button');
	const promoCodeInput = document.getElementById('promo-code-input');
    const promoCodeMessage = document.getElementById('codeMessage');
    const submitButton = document.getElementById('submit-btn');

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const ccn = document.getElementById("creditCard");
    const cvv = document.getElementById("securityCode");
    const exp = document.getElementById("expirationDate");
    const cardZip = document.getElementById("postalCode");
    const address1 = document.getElementById("addressLine1");
    const address2 = document.getElementById("addressLine2");
    const city = document.getElementById("city");
    const state = document.getElementById("state");
    const zip = document.getElementById("zipCode");

	
	const storedCartItems = localStorage.getItem('cartItems');
    const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
	
    discountMult = 1.0;
    total = 0;
    overallTotal=0;
    numItems=0;
    promo='None';

    
    promoButton.addEventListener('click', function () {
		checkCode(promoCodeInput.value);
	});
	function checkCode(code){
		const apiUrl = `http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/coupon/search?code=${code}`;
		fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})
		.then(response => response.json())
		.then(data => {
			applyPromoCode(data);
		})
		.catch(error => {
			console.error('Error getting code:', error);
		});
	}
    submitButton.addEventListener('click', function () {
        submitOrder();
    });


    function calculateTotal() {
        overallTotal=0;
        total = 0;
        window.cartItems.forEach(item => {
            total += parseFloat(item.Price) * item.Quantity; // need to mult by qty when we have
        });
        
        if(discountMult != 1){
            total=(total * (1-discountMult));
        }
        
        const taxRate = 0.0825;
        const tax = total * taxRate;
        overallTotal = total + tax;

        return { total, tax, overallTotal };
    }
    
    // Function to render cart items and total
    function renderSummary() {
        const cartItemsList = document.getElementById('cart-items-list');
        const totalContainer = document.getElementById('total-left');
        let numItems = 0;

        cartItemsList.innerHTML = ''; // Clear existing content

        window.cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-name">${item.ProductNames} <span class="item-quantity">Qty: ${item.Quantity}</span></div>
                <div class="item-price">$${(item.Price)} ea.</div>`;
            cartItemsList.appendChild(itemElement);
            numItems += parseInt(item.Quantity); // qty needed here
        });

        const { total, tax, overallTotal } = calculateTotal();

        totalContainer.innerHTML = `
            <p>Subtotal (${numItems} items): $${total.toFixed(2)}</p>
            <p>Tax (8.25%): $${tax.toFixed(2)}</p>
            <p>Overall Total: $${overallTotal.toFixed(2)}</p>
        `;
    }

    function applyPromoCode(code){
        if(code){
            discountMult=code.DiscountAmount / 100;
            saved=total*discountMult;
            promoCodeMessage.innerHTML = `${code.Code} Applied, saving you $${saved.toFixed(2)}`
            calculateTotal();
            renderSummary();
			promo=code.Code;
        }else{
            promoCodeMessage.innerHTML = `Invalid Code`
            promo='None';
        }
    }

    function areAllFieldsPopulated() {
        // Check if every single field (except address2) is populated
        return (
            firstName.value.trim() !== '' &&
            lastName.value.trim() !== '' &&
            ccn.value.trim() !== '' &&
            cvv.value.trim() !== '' &&
            exp.value.trim() !== '' &&
            cardZip.value.trim() !== '' &&
            address1.value.trim() !== '' &&
            city.value.trim() !== '' &&
            state.value.trim() !== '' &&
            zip.value.trim() !== ''
        );
    }

    function submitOrder(){
		const { total, tax, overallTotal } = calculateTotal();
        if(areAllFieldsPopulated()){
			fetch('http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/orders/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ 
				TotalAmount: total,
			}),
			})
			.then(response => response.json())
			.then(data => {
				console.log(data.message);
			})
			.catch(error => {
				console.error('Error adding product to cart on the server:', error);
			});

        }

    }
	setTimeout(() => {
		renderSummary();
	}, 500);
});

function getTimeStamp(){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    return `${hours}:${minutes}:${seconds} ${month}-${day}-${year}`;
}