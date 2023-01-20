const forms = document.querySelectorAll("form");
const userIdElement = document.getElementById("user-id");
const userId = userIdElement.dataset.userId;
forms.forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault();
        const button = form.querySelector("button[type='submit']");
        const productName = button.dataset.productName;
        const quantityInput = form.querySelector("input[name='quantity']");
        const quantity = quantityInput.value;
        const pointsInput = form.querySelector("input[name='points']");
        const points = pointsInput.value;
        // Now you can send this information to the server
        // along with the user's ID
        // to save the product,quantity,points and user id
        fetch('/addPoints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                productName,
                quantity,
                points
            })
        })
        .then(response => {
            // Do something with the response
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .catch(error => {
            // Do something with the error

            console.log(error);
            alert("Something went wrong");
            return;
        });
    });
});
