// JavaScript Document
function loginUser() {
    console.log('Logging in...');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
                if (data.message == 'Login successful') {
                    // Use setTimeout to ensure that the alert is shown before redirection
                    setTimeout(() => {
                        location.href = 'admin.html';
                    }, 100);
                }
        // Handle successful login, e.g., redirect to a new page
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error logging in. Please try again.');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
        loginButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        loginUser(); // Call your function
    });
});
