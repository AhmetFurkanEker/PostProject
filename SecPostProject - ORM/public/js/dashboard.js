const apiUrl = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let loginusername = localStorage.getItem('username');

async function checkAuth() {
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');

    if (!authToken) {
        window.location.href = '/loginPrompt.html'; 
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            
            if (username) {
                document.getElementById('username-display').textContent = `Logged in as: ${username}`;
            } else {
                document.getElementById('username-display').textContent = 'Logged in as: Unknown';
            }
            fetchPosts(); 
        } else {
            window.location.href = '/loginPrompt.html'; 
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = '/loginPrompt.html'; 
    }
}

async function fetchPosts() {
    try {
        const response = await fetch(`${apiUrl}/posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const posts = await response.json();
            displayPosts(posts);
        } else {
            console.error('Error fetching posts:', await response.json());
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; 

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <small>by ${loginusername}</small>
            <button class="delete-post" onclick="deletePost(${post.id})"><i class="fas fa-trash-alt"></i> Delete</button>
        `;
        postsContainer.appendChild(postElement);
    });
}

async function searchPosts() {
    const title = document.getElementById('search-title').value;
    
    try {
        const response = await fetch(`${apiUrl}/posts/search?title=${encodeURIComponent(title)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const posts = await response.json();
            if (posts.length > 0) {
                displayPosts(posts);
                document.getElementById('search-message').textContent = '';
            } else {
                document.getElementById('search-message').textContent = 'No posts found with this title.';
                document.getElementById('posts-container').innerHTML = ''; // Clear posts
            }
        } else {
            document.getElementById('search-message').textContent = 'Error searching posts.';
            console.error('Error searching posts:', await response.json());
        }
    } catch (error) {
        document.getElementById('search-message').textContent = 'Error searching posts.';
        console.error('Error:', error);
    }
}

async function createPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) {
        document.getElementById('post-message').textContent = 'Title and content are required.';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/posts`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, content })
        });
        const data = await response.json();
        if (response.ok) {
            document.getElementById('post-message').textContent = 'Post created!';
            fetchPosts(); 
        } else {
            document.getElementById('post-message').textContent = data.message || 'Error creating post.';
        }
    } catch (error) {
        document.getElementById('post-message').textContent = 'Error creating post.';
        console.error('Error:', error);
    }
}

async function deletePost(postId) {
    try {
        const response = await fetch(`${apiUrl}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            fetchPosts(); 
        } else {
            console.error('Error deleting post:', await response.json());
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function logout() {
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('username'); 
    window.location.href = '/'; 
}

document.addEventListener('DOMContentLoaded', checkAuth);
