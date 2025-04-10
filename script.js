const users = [
    { username: "bae", password: "melvin" },
    { username: "bae", password: "merci" }
];

let currentUser = null;

// Initialize messages in localStorage if they don't exist
if (!localStorage.getItem('messages')) {
    localStorage.setItem('messages', JSON.stringify([]));
}

// Add these at the top of your existing JavaScript file
if (!localStorage.getItem('onlineUsers')) {
    localStorage.setItem('onlineUsers', JSON.stringify([]));
}

function updateOnlineStatus() {
    const onlineUsers = JSON.parse(localStorage.getItem('onlineUsers'));
    const onlineCount = onlineUsers.length;
    const statusText = document.getElementById('onlineCount');
    
    if (onlineCount === 0) {
        statusText.textContent = 'No players online';
    } else if (onlineCount === 1) {
        statusText.textContent = '1 player online';
    } else {
        statusText.textContent = '2 players online';
    }
}

// Modify the login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = username + '-' + password;
        // Add user to online users
        const onlineUsers = JSON.parse(localStorage.getItem('onlineUsers'));
        if (!onlineUsers.includes(currentUser)) {
            onlineUsers.push(currentUser);
            localStorage.setItem('onlineUsers', JSON.stringify(onlineUsers));
        }
        updateOnlineStatus();
        
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('chatSection').style.display = 'block';
        document.getElementById('currentUser').textContent = username;
        document.getElementById('loginError').textContent = '';
        loadMessages();
    } else {
        document.getElementById('loginError').textContent = 'Invalid username or password';
    }
}

// Modify the logout function
function logout() {
    if (currentUser) {
        const onlineUsers = JSON.parse(localStorage.getItem('onlineUsers'));
        const index = onlineUsers.indexOf(currentUser);
        if (index > -1) {
            onlineUsers.splice(index, 1);
            localStorage.setItem('onlineUsers', JSON.stringify(onlineUsers));
        }
        updateOnlineStatus();
    }
    
    currentUser = null;
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('chatSection').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Add window event listeners for handling page close/refresh
window.addEventListener('load', updateOnlineStatus);
window.addEventListener('beforeunload', function() {
    if (currentUser) {
        const onlineUsers = JSON.parse(localStorage.getItem('onlineUsers'));
        const index = onlineUsers.indexOf(currentUser);
        if (index > -1) {
            onlineUsers.splice(index, 1);
            localStorage.setItem('onlineUsers', JSON.stringify(onlineUsers));
        }
    }
});

// Check online status periodically
setInterval(updateOnlineStatus, 3000);

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message && currentUser) {
        const messages = JSON.parse(localStorage.getItem('messages'));
        messages.push({
            sender: currentUser,
            text: message,
            timestamp: new Date().getTime()
        });
        localStorage.setItem('messages', JSON.stringify(messages));
        messageInput.value = '';
        loadMessages();
    }
}

function loadMessages() {
    const messageContainer = document.getElementById('messageContainer');
    const messages = JSON.parse(localStorage.getItem('messages'));
    
    messageContainer.innerHTML = '';
    messages.forEach((message, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender === currentUser ? 'sent' : 'received'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message.text;
        
        const messageControls = document.createElement('div');
        messageControls.className = 'message-controls';
        
        if (message.sender === currentUser) {
            const editBtn = document.createElement('button');
            editBtn.className = 'control-btn edit-btn';
            editBtn.textContent = '✎';
            editBtn.onclick = () => editMessage(index);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'control-btn delete-btn';
            deleteBtn.textContent = '×';
            deleteBtn.onclick = () => deleteMessage(index);
            
            messageControls.appendChild(editBtn);
            messageControls.appendChild(deleteBtn);
        }
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageControls);
        messageContainer.appendChild(messageDiv);
    });
    
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function deleteMessage(index) {
    const messages = JSON.parse(localStorage.getItem('messages'));
    messages.splice(index, 1);
    localStorage.setItem('messages', JSON.stringify(messages));
    loadMessages();
}

function editMessage(index) {
    const messages = JSON.parse(localStorage.getItem('messages'));
    const newText = prompt('Edit message:', messages[index].text);
    
    if (newText !== null && newText.trim() !== '') {
        messages[index].text = newText.trim();
        messages[index].edited = true;
        localStorage.setItem('messages', JSON.stringify(messages));
        loadMessages();
    }
}

// Add enter key support for sending messages
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


function clearChat() {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = '';
    // You should also implement the server-side clearing of messages here
    // by making an appropriate API call to your backend
}