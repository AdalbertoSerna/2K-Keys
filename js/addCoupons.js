// JavaScript Document
function createAccount() {
console.log('Creating admin...');
const code = document.getElementById('code').value;
const amount = parseFloat(document.getElementById('amount').value);
	
fetch('http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/coupon',{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			code,
			amount,
		}),
		})
	.then(response=>response.json())
	.then(data => {
		alert(data.message);
	})
	.catch(error => {
		console.error('Error:',error);
		alert('Error registering user please try again');
	});
}
document.addEventListener('DOMContentLoaded', function() {
    const createButton = document.getElementById('submitButton');
    createButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        createAccount(); // Call your function
    });
});
