
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
        errorElement.textContent = error.message;
    } else {
    const { data: dataU, error: errorU } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id);

        console.log('Fetched user row:', dataU);

    if (errorU || !dataU || dataU.length === 0) {
        console.error('Could not read user row:', errorU?.message);
        return;
    }

    sessionStorage.setItem("username", dataU[0].username);
    window.location.href = "booking.html";
        // if (errorU) {
        // console.error('Error fetching user:', errorU.message);
        // } else if (!dataU) {
        // console.log('User not found');
        // }
        // sessionStorage.setItem("username", dataU[0].username);
        // // const savedValue = sessionStorage.getItem("username");
        // // console.log(savedValue);
        // window.location.href = "booking.html";
    }
}