
function createAccount() {
console.log('Creating account...');
const firstName = document.getElementById('fname').value;
const lastName = document.getElementById('lname').value;
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const confirmPassword = document.getElementById('confirmPassword').value;
	if(password !== confirmPassword){
	alert('Passwords do not match');
	return;
}
	
fetch('http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/register',{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			fname: firstName,
			lname: lastName,
			email,
			password,
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
    const createButton = document.getElementById('createAccountButton');
    createButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        createAccount(); // Call your function
    });
});


	
