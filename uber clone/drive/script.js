document.querySelector('.btn').addEventListener('click', () => {
    alert("Get Started button clicked!");
});

const registerButton = document.querySelector('#register-btn');
const registerFormContainer = document.querySelector('#register-form-container');
const registerForm = document.querySelector('#register-form');
const successMessage = document.querySelector('#success-message');

// Show the registration form when "Register" is clicked
registerButton.addEventListener('click', () => {
    registerFormContainer.style.display = 'block'; // Show the form
    successMessage.style.display = 'none'; // Hide success message if visible
});

// Handle form submission
registerForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload

    // Get form data
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const profilePhoto = document.querySelector('#profile-photo').files[0];
    const drivingLicense = document.querySelector('#driving-license').files[0];

    // Simple validation
    if (!name || !email || !phone || !profilePhoto || !drivingLicense) {
        alert('Please fill out all fields and upload required documents.');
        return;
    }

    // Display success message
    registerFormContainer.style.display = 'none'; // Hide the form
    successMessage.style.display = 'block'; // Show success message

    console.log('User Data:', { name, email, phone });
    console.log('Uploaded Files:', { profilePhoto, drivingLicense });
});
// Select the "Cities" link by ID
const citiesLink = document.getElementById('cities-link');

// Add an event listener for the "Cities" link
citiesLink.addEventListener('click', function(event) {
    // Prevent the default link behavior
    event.preventDefault();

    // Create a link element
    const link = document.createElement('a');
    
    // Set the download attribute with the file name (ensure the PDF file is in the same folder)
    link.href = 'RideX cities.pdf'; // Replace 'yourfile.pdf' with the name of your PDF file
    link.download = 'cities-transportation-needs.pdf'; // This is the file name that will be saved
    
    // Programmatically click the link to trigger the download
    link.click();
});

    // Send the form data to your email using EmailJS
   // Initialize EmailJS with your user ID
emailjs.init('prarn8NsUUDycnOoW');

// Get the form and button elements
const form = document.getElementById('form');
const btn = document.getElementById('button');

// Add event listener to handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    btn.value = 'Sending...'; // Change the button text to "Sending..."

    const serviceID = 'default_service'; // EmailJS service ID
    const templateID = 'template_oyp55hm'; // EmailJS template ID

    // Send form data using EmailJS
    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            btn.value = 'Send Email'; // Reset the button text
            alert('Sent!'); // Show success message
        }, (err) => {
            btn.value = 'Send Email'; // Reset the button text
            alert(JSON.stringify(err)); // Show error message
        });
});
