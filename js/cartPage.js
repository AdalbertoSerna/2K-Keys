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

    // NEED TO GET DATA FROM CUSTOMERS DATABASE CART HERE __________________________________________
    const promoCodes = [{ code: 'test', discount: .25}, { code: '50off', discount: .5 }]
    
    promoButton.addEventListener('click', function () {
		applyPromoCode(promoCodeInput.value);
	});
    submitButton.addEventListener('click', function () {
        submitOrder();
    });


    function getRealPrice(item){
        const hasSalePrice = item.salePrice !== "";
        let realPrice = parseFloat(item.price.replace("$", "").split(" - ")[0]);

        if (hasSalePrice) {
            const regularPrice = parseFloat(item.price.replace("$", "").split(" - ")[0]);
            const salePrice = parseFloat(item.salePrice.replace("$", ""));
            const discount = regularPrice - salePrice;
            realPrice-=discount;
        }
        return realPrice;
    }

    function calculateTotal() {
        overallTotal=0;
        total = 0;
        cartItems.forEach(item => {
            
            total += item.quantity * getRealPrice(item);
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

        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-name">${item.name} <span class="item-quantity">Qty: ${item.quantity}</span></div>
                <div class="item-price">$${(item.quantity * getRealPrice(item)).toFixed(2)}</div>`;
            cartItemsList.appendChild(itemElement);
            numItems += parseInt(item.quantity);
        });

        const { total, tax, overallTotal } = calculateTotal();

        totalContainer.innerHTML = `
            <p>Subtotal (${numItems} items): $${total.toFixed(2)}</p>
            <p>Tax (8.25%): $${tax.toFixed(2)}</p>
            <p>Overall Total: $${overallTotal.toFixed(2)}</p>
        `;
    }

    function applyPromoCode(code){
        discountMult=1;
		validCode = promoCodes.find(validCode => validCode.code === code);
        if(validCode){
            discountMult=validCode.discount;
            saved=total-(1-discountMult);
            promoCodeMessage.innerHTML = `Applied, saving you $${saved.toFixed(2)}`
            calculateTotal();
            renderSummary();
            promo=validCode.code;
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
        if(areAllFieldsPopulated()){
            const formattedCCN = ccn.value.slice(-4); // Get the last 4 digits of the credit card number
            const itemSummary = cartItems.map(item => `${item.name}: ${item.quantity}`).join(', ');

            // Assuming you have user data in the session
            const userId = window.sessionStorage.getItem('userId'); // Make sure to set this when the user logs in


            /* NEED TO IMPLEMENT USING THE ORDER HANDLER */ 
            // Create an order object
            const orderDetails = {
                userId: userId,
                firstName: firstName.value,
                lastName: lastName.value,
                items: itemSummary,
                promo: promo,
                total: overallTotal.toFixed(2),
            }
        }

    }
    renderSummary();
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