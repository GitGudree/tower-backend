import { loginUser, registerUser } from './auth-service.js';

// Common validation functions
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordRegex.test(password);
};

const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

// Login page handler
export const initLoginPage = () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = loginForm.querySelector('button[type="submit"]');
    const emailOrUsernameInput = document.getElementById('emailOrUsername');
    const passwordInput = document.getElementById('password');

    function validateInputs() {
        const emailOrUsername = emailOrUsernameInput.value;
        const password = passwordInput.value;
        
        if (emailOrUsername && password && validatePassword(password)) {
            loginButton.classList.add('active', 'upgrade');
        } else {
            loginButton.classList.remove('active', 'upgrade');
        }
    }

    emailOrUsernameInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailOrUsername = emailOrUsernameInput.value;
        const password = passwordInput.value;

        if (!validatePassword(password)) {
            errorMessage.textContent = 'Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
            errorMessage.style.display = 'block';
            return;
        }

        const result = await loginUser(emailOrUsername, password);
        if (result.success) {
            console.log('Login successful');
            window.location.href = '/index.html';
        } else {
            errorMessage.textContent = result.error;
            console.log('Login failed');
            errorMessage.style.display = 'block';
        }
    });
};

// Register page handler
export const initRegisterPage = () => {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const registerButton = document.getElementById('registerButton');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const nationalityInput = document.getElementById('nationality');

    function validateInputs() {
        const email = emailInput.value;
        const username = usernameInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const nationality = nationalityInput.value;
        
        if (email && username && password && confirmPassword && nationality && 
            validatePassword(password) && 
            validateUsername(username) &&
            password === confirmPassword) {
            registerButton.classList.add('active', 'upgrade');
        } else {
            registerButton.classList.remove('active', 'upgrade');
        }
    }

    emailInput.addEventListener('input', validateInputs);
    usernameInput.addEventListener('input', validateInputs);
    passwordInput.addEventListener('input', validateInputs);
    confirmPasswordInput.addEventListener('input', validateInputs);
    nationalityInput.addEventListener('change', validateInputs);

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable form inputs and show loading state
        const inputs = [emailInput, usernameInput, passwordInput, confirmPasswordInput, nationalityInput, registerButton];
        inputs.forEach(input => input.disabled = true);
        registerButton.textContent = 'Registering...';
        errorMessage.style.display = 'none';

        const email = emailInput.value;
        const username = usernameInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const nationality = nationalityInput.value;

        try {
            if (!validateUsername(username)) {
                throw new Error('Username must be 3-20 characters long and can only contain letters, numbers, and underscores');
            }

            if (!validatePassword(password)) {
                throw new Error('Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (!nationality) {
                throw new Error('Please select your nationality');
            }

            console.log('Attempting to register user:', { email, username, nationality });
            const result = await registerUser(email, username, password, nationality);
            
            if (result.success) {
                console.log('Registration successful, redirecting...');
                // Use a relative path for redirection
                window.location.href = '../index.html';
            } else {
                throw new Error(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
            
            // Re-enable form inputs
            inputs.forEach(input => input.disabled = false);
            registerButton.textContent = 'Register';
        }
    });
}; 