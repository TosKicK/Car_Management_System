// JavaScript code to handle any dynamic interactions can be added here

document.addEventListener('DOMContentLoaded', function() {
    // Example: Add event listener to form submit buttons
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        const formData = new FormData(form);
        const formAction = form.action;
        const formMethod = form.method;
        
        // Simple form validation (Example)
        let isValid = true;
        formData.forEach((value, key) => {
          if (!value) {
            isValid = false;
            alert(`${key} is required`);
          }
        });
        
        if (isValid) {
          // Perform AJAX request
          fetch(formAction, {
            method: formMethod,
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
            // Handle success response (e.g., update the UI, redirect)
            if (data.redirect) {
              window.location.href = data.redirect;
            } else {
              alert('Operation successful');
              location.reload(); // Reload the page to reflect changes
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
          });
        }
      });
    });
  });
  