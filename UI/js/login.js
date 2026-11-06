
import { supabase } from '../../Server/supabase-client.js'

document.getElementById('login').addEventListener('submit', function(event) 
{
    event.preventDefault();  // Stop form from submitting normally
    
    // Clear previous errors
    clearErrors();
    
    // Get form values
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value;

    let isValid = true;
    
    // Validate email
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email === '') {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if(!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if(password === '') {
        showError('passwordError', 'Password is required');
        isValid = false;
    } 
    
    if(isValid) {
        submitToAPI(email, password);
    }
});

function clearErrors() {
    let errors = document.querySelectorAll('.error');
    errors.forEach(error => error.innerHTML = '');
}

function showError(elementId, message) {
    document.getElementById(elementId).innerHTML = message;
}

async function submitToAPI(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword
    ({
        email: email,
        password: password
    });


    if (error) {
        // If credentials don't exist or match, show error
        errorElement.textContent = error.message;
    } else {
        // 4. Success! Redirect to home page
        window.location.href = "booking.html";
    }
}