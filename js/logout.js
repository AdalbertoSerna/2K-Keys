// JavaScript Document
function logoutUser() {
    console.log('Logging out...');

    fetch('http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Handle successful login, e.g., redirect to a new page
		if( data.message == 'Logout successful'){
			
                    setTimeout(() => {
                        location.href = 'index.html';
                    }, 100);
		}
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error logging in. Please try again.');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        logoutUser(); // Call your function
    });
});