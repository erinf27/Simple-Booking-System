
import { supabase } from '../../Server/supabase-client.js'

document.getElementById('signup').addEventListener('submit', function(event) 
{
    event.preventDefault();  // Stop form from submitting normally
    
    // Clear previous errors
    clearErrors();
    
    // Get form values
    let name = document.getElementById('name').value.trim();
    let surname = document.getElementById('surname').value.trim();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value;
    let type = document.getElementById('type').value;
    
    let isValid = true;
    
    // Validate name
    if(name === '') {
        showError('nameError', 'Name is required');
        isValid = false;
    }
    
    // Validate surname
    if(surname === '') {
        showError('surnameError', 'Surname is required');
        isValid = false;
    }
    
    // Validate email
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email === '') {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if(!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    let hasUpper = /[A-Z]/.test(password);
    let hasLower = /[a-z]/.test(password);
    let hasDigit = /[0-9]/.test(password);
    let hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    let isLongEnough = password.length > 8;
    
    if(password === '') {
        showError('passwordError', 'Password is required');
        isValid = false;
    } else if(!isLongEnough) {
        showError('passwordError', 'Password must be longer than 8 characters');
        isValid = false;
    } else if(!hasUpper) {
        showError('passwordError', 'Password must contain an uppercase letter');
        isValid = false;
    } else if(!hasLower) {
        showError('passwordError', 'Password must contain a lowercase letter');
        isValid = false;
    } else if(!hasDigit) {
        showError('passwordError', 'Password must contain at least one digit');
        isValid = false;
    } else if(!hasSymbol) {
        showError('passwordError', 'Password must contain at least one symbol');
        isValid = false;
    }
    
    if(isValid) {
        submitToAPI(name, surname, email, password, type);
    }
});

function clearErrors() {
    let errors = document.querySelectorAll('.error');
    errors.forEach(error => error.innerHTML = '');
}

function showError(elementId, message) {
    document.getElementById(elementId).innerHTML = message;
}

async function submitToAPI(name, surname, email, password, type) 
{
    const {data, error} = await supabase.auth.signUp({
        email: email,
        password: passowrd, 
        options: {
            data: {
                username: username
            }
        }
    });
}

