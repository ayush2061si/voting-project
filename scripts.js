const apiUrl = 'http://localhost:3000';
let token = null; // To store JWT token

// User signup
async function signup() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const aadhar = document.getElementById('aadhar').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${apiUrl}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, age, aadharCardNumber: aadhar, password, role: 'voter', address: 'Test Address' })
        });
        const data = await response.json();
        document.getElementById('signup-msg').innerText = data.error || 'Signup successful!';
    } catch (error) {
        console.error(error);
        document.getElementById('signup-msg').innerText = 'Signup failed.';
    }
}

// User login
async function login() {
    const aadhar = document.getElementById('login-aadhar').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${apiUrl}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aadharCardNumber: aadhar, password })
        });
        const data = await response.json();
        if (data.token) {
            token = data.token;
            document.getElementById('login-msg').innerText = 'Login successful!';
            document.getElementById('voting-section').style.display = 'block';
        } else {
            document.getElementById('login-msg').innerText = 'Invalid credentials.';
        }
    } catch (error) {
        console.error(error);
        document.getElementById('login-msg').innerText = 'Login failed.';
    }
}

// Fetch candidates
async function fetchCandidates() {
    try {
        const response = await fetch(`${apiUrl}/candidate`);
        const candidates = await response.json();
        const list = document.getElementById('candidate-list');
        list.innerHTML = '';
        candidates.forEach(candidate => {
            const li = document.createElement('li');
            li.textContent = `Name: ${candidate.name}, Party: ${candidate.party}`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        alert('Failed to fetch candidates.');
    }
}

// Vote for a candidate
async function vote() {
    const candidateID = document.getElementById('candidate-id').value;

    try {
        const response = await fetch(`${apiUrl}/candidate/vote/${candidateID}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        document.getElementById('vote-msg').innerText = data.message || 'Vote failed.';
    } catch (error) {
        console.error(error);
        document.getElementById('vote-msg').innerText = 'Failed to vote.';
    }
}

// Fetch vote counts
async function fetchVoteCounts() {
    try {
        const response = await fetch(`${apiUrl}/candidate/vote/count`);
        const voteCounts = await response.json();
        const list = document.getElementById('vote-count-list');
        list.innerHTML = '';
        voteCounts.forEach(vote => {
            const li = document.createElement('li');
            li.textContent = `Party: ${vote.party}, Votes: ${vote.count}`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        alert('Failed to fetch vote counts.');
    }
}
