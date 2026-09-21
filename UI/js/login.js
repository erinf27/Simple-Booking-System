
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

function submitToAPI(email, password) {
    let data = {
        type: "Login",
        email: email,
        password: password,
    };
    
    let apiUrl = '/u25111282/api.php';
    console.log("Calling API at: " + apiUrl);
    console.log("Sending data:", data);
    
    // Show loading state
    let submitBtn = document.querySelector('.submit-btn');
    let originalText = submitBtn ? submitBtn.innerHTML : 'Login';
    if (submitBtn) {
        submitBtn.innerHTML = 'Logging in...';
        submitBtn.disabled = true;
    }
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error('HTTP error: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        
        // console.log("Response data:", data);
        let messageDiv = document.getElementById('message');
        if(data.status === 'success') {
            let apiKey = data.data[0].apikey;
            localStorage.setItem('api_key', apiKey);

            messageDiv.innerHTML = '<div style="color: green; background: #e8f5e9; padding: 15px; border-radius: 8px;">' +
                'Login successful!<br>';
            //redirect
            window.location.href = 'index.php';
            // document.getElementById('login').reset();
            clearErrors();
        } else {
            messageDiv.innerHTML = '<div style="color: red; background: #ffebee; padding: 15px; border-radius: 8px;">✗ Error: ' + data.message + '</div>';
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
        document.getElementById('message').innerHTML = '<div style="color: red; background: #ffebee; padding: 15px; border-radius: 8px;">✗ Error: ' + error.message + '</div>';
    })
    .finally(() => {
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}