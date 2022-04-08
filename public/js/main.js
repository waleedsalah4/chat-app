
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users')

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// console.log(username, room)

const socket = io()

//Join chatromm
socket.emit('joinRoom', { username, room})

//Get room and users
socket.on('roomUsers', ({room, users})=>{
    outputRoomName(room);
    outputUsers(users)
})

// Message from server
socket.on('message', message => {
    // console.log(message)
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    let msg = e.target.elements.msg.value;
 
    //Emit message to server
    socket.emit('chatMessage', msg)

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus()
})

// output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
    `
    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room){
    roomName.innerText = room
}

function outputUsers(users){
    usersList.innerHTML = `
        ${users.map(user => `
            <li>${user.username}</li>
        `).join('')}
    `;
}

// //Prompt the user before leave chat room
// document.getElementById('leave-btn').addEventListener('click', () => {
//     const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
//     if (leaveRoom) {
//       window.location = '../index.html';
//     } else {
//     }
// });