
document.getElementById('signup').addEventListener('submit', function(event) {
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

function submitToAPI(name, surname, email, password, type) {
    let data = {
        type: "Register",
        name: name,
        surname: surname,
        email: email,
        password: password,
        user_type: type
    };
    
    // FIXED: Correct path to api.php (includes your student number)
    let apiUrl = '/u25111282/api.php';
    console.log("Calling API at: " + apiUrl);
    console.log("Sending data:", data);
    
    // Show loading state
    let submitBtn = document.querySelector('.submit-btn');
    let originalText = submitBtn ? submitBtn.innerHTML : 'Register';
    if (submitBtn) {
        submitBtn.innerHTML = 'Registering...';
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
        console.log("Response data:", data);
        let messageDiv = document.getElementById('message');
        if(data.status === 'success') {
            // Handle your new response format with timestamp and apikey
            let apiKey = data.data.apikey;
            let timestamp = data.timestamp;
            
            messageDiv.innerHTML = '<div style="color: green; background: #e8f5e9; padding: 15px; border-radius: 8px;">' +
                '✓ Registration successful!<br>' +
                'Timestamp: ' + new Date(parseInt(timestamp)).toLocaleString() + '<br>' +
                'Your API Key: <strong>' + apiKey + '</strong><br>' +
                'Please save this key for future use.</div>';
            document.getElementById('signup').reset();
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