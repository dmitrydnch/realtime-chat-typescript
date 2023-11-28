// const socket = io('ws://localhost:4000');

const inputMessage = document.querySelector('#message');
const inputName = document.querySelector('#name');
const inputRoom = document.querySelector('#room');

const activity = document.querySelector('.activity');
const chatRooms = document.querySelector('.chat-rooms')
const chatMessages = document.querySelector('.chat-messages');
const chatUsers = document.querySelector('.chat-users');

function enterRoom(e) {
  e.preventDefault();
}

function sendMessage(e) {
  e.preventDefault();
}
