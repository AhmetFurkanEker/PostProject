const apiUrl = 'http://localhost:3000/api';

async function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById('register-error').innerHTML = 'Registration successful';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000); 
    } else {
        document.getElementById('register-error').textContent = data.message;
    }
}
