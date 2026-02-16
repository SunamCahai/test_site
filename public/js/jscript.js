
let currentUser = null;
let isRegisterMode = false;

function toggleMode() {
    isRegisterMode = !isRegisterMode;
    document.getElementById('form-title').innerText = isRegisterMode ? 'Registration' : 'Login';
    document.getElementById('age').classList.toggle('hidden', !isRegisterMode);
}

async function auth() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const age = document.getElementById('age').value;

    const endpoint = isRegisterMode ? '/api/register' : '/api/login';
    const body = isRegisterMode ? { username, password, age } : { username, password };

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    if (res.ok) {
        if (isRegisterMode) {
            alert("Great! Log in now.");
            toggleMode();
        } else {
            loginSuccess(data);
        }
    } else {
        alert(data.error);
    }
}

function loginSuccess(user) {
    currentUser = user;
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('main-section').classList.remove('hidden');
    document.getElementById('user-display').innerText = user.username;

    // Age logic
    if (user.age < 18) {
        document.body.style.backgroundColor = "#e1f5fe"; // Lightblue
    } else if (user.age < 40) {
        document.body.style.backgroundColor = "#fff9c4"; // Yellowlike
    } else {
        document.body.style.backgroundColor = "#cfd8dc"; // Grey
    }

    loadComments();
        setInterval(loadComments, 3000);
}

async function loadComments() {
    const res = await fetch('/api/comments');
    const comments = await res.json();
    const list = document.getElementById('comments-list');
    list.innerHTML = comments.map(c => `
        <div class="comment"><b>${c.username}:</b> ${c.text}</div>
    `).join('');
}

async function postComment() {
    const text = document.getElementById('comment-text').value;
    if (!text) return;

    await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username, text })
    });
    document.getElementById('comment-text').value = '';
    loadComments();
}
