const apiUrl = 'http://localhost:3000/api';

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('authToken', data.token); 
            localStorage.setItem('username', data.username);
            window.location.href = 'dashboard.html'; 
        } else {
            document.getElementById('login-message').textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        document.getElementById('login-message').textContent = 'Login failed.';
        console.error('Error:', error);
    }
}
