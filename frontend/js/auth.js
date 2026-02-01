// Check if already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');
        
        try {
            const data = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            window.location.href = 'index.html';
        } catch (error) {
            messageDiv.textContent = error.message;
            messageDiv.className = 'message error';
        }
    });
}

// Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');
        
        try {
            await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });
            
            messageDiv.textContent = 'Registration successful! Redirecting to login...';
            messageDiv.className = 'message success';
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            messageDiv.textContent = error.message;
            messageDiv.className = 'message error';
        }
    });
}