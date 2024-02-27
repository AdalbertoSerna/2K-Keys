function addProduct() {
    console.log('Adding product...');

    const formData = new FormData();
    formData.append('name', document.getElementById('productName').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('price', parseFloat(document.getElementById('price').value));
    formData.append('quantity', parseFloat(document.getElementById('quantity').value, 10));
    formData.append('category', document.getElementById('tags').value);
    formData.append('image', document.getElementById('image').files[0]);

    fetch('http://ec2-3-145-126-187.us-east-2.compute.amazonaws.com:3000/admin/products/add', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding product, please try again');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        addProduct(); // Call your function
    });
});
