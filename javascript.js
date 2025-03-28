
document.getElementById("myForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const phoneInput = document.getElementById("tell").value;
    const emailInput = document.getElementById("email").value;
    const messageContainer = document.getElementById("messageContainer");

    // Client-side validation
    if (phoneInput.trim() === "" && emailInput.trim() === "") {
        showMessage("Please fill out the information first", messageContainer);
    } else if (phoneInput.trim() === "" || emailInput.trim() === "") {
        showMessage("Please fill out both fields", messageContainer);
    } else if (!emailInput.includes("@")) {
        showMessage("Please enter a valid email", messageContainer);
    } else {
        // Send data to the backend
        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'PHONE NUMBER': phoneInput,
                    'EMAIL': emailInput
                })
            });
            const result = await response.json();

            showMessage(result.message, messageContainer);
            if (response.ok) {
                setTimeout(clearForm, 4000); // Clear form only on success
            }
        } catch (error) {
            showMessage("Customer info was not submitted please try again later", messageContainer);
        }
    }
});

function showMessage(message, container) {
    container.textContent = message;
    setTimeout(() => {
        container.textContent = "";
    }, 4000);
}

function clearForm() {
    document.getElementById("myForm").reset();
}
