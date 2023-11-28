const socket = io("ws://localhost:3000");

const inputMessage = document.querySelector("#message");
const inputName = document.querySelector("#name");
const inputRoom = document.querySelector("#room");

const sendMessageButton = document.querySelector("#send-message");

const activity = document.querySelector(".activity");
const chatRooms = document.querySelector(".chat-rooms");
const chatMessages = document.querySelector(".chat-messages");
const chatUsers = document.querySelector(".chat-users");

const formChatJoin = document.querySelector(".form-chat-join");
const formMessage = document.querySelector(".form-chat-message");

const EventNames = {
  Message: "message",
  RoomEnter: "roomEnter",
  RoomList: "roomList",
  UserList: "userList",
  Activity: "activity"
};


formChatJoin.addEventListener("submit", enterRoom);
inputMessage.addEventListener("keypress", () => socket.emit(EventNames.Activity, inputName.value));
formMessage.addEventListener("submit", sendMessage);

function enableMessaging() {
  inputMessage.disabled = false;
  sendMessageButton.disabled = false;
}

function enterRoom(e) {
  e.preventDefault();
  if (inputName.value && inputRoom.value) {
    socket.emit(EventNames.RoomEnter, {
      name: inputName.value,
      room: inputRoom.value
    });
    return enableMessaging();
  }
  alert(`Please type your name and room!`);
}


function sendMessage(e) {
  e.preventDefault();
  if (inputName.value && inputRoom.value && inputMessage.value) {
    socket.emit(EventNames.Message, {
      name: inputName.value,
      text: inputMessage.value
    });
    inputMessage.value = "";
  }
  inputMessage.focus();
}


socket.on(EventNames.Message, (data) => {
  activity.textContent = "";
  const { name, text, time } = data;
  const li = document.createElement("li");
  li.className = "post";

  if (name === inputName.value) li.className = "post post-left";
  if (name !== inputName.value && name !== "BOT") li.className = "post post-right";
  if (name !== "BOT") {
    li.innerHTML = `<div class="post-header ${name === inputName.value
      ? "post-header-user"
      : "post-header-reply"
    }">
        <span class="post-header-name">${name}</span> 
        <span class="post-header-time">${time}</span> 
        </div>
        <div class="post-text">${text}</div>`;
  } else {
    li.innerHTML = `<div class="post-text">${text}</div>`;
  }

  chatMessages.appendChild(li);
  chatMessages.scrollTop = chatMessages.scrollHeight;

});


let activityTimer;
socket.on(EventNames.Activity, (name) => {
  activity.textContent = `${name} is typing...`;

  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.textContent = "";
  }, 3000);
});

socket.on(EventNames.UserList, ({ users }) => {
  showUsers(users);
});

socket.on(EventNames.RoomList, ({ rooms }) => {
  showRooms(rooms);
});

function showUsers(users) {
  chatUsers.textContent = "";
  if (users) {
    chatUsers.innerHTML = `<em>Users in ${inputRoom.value}:</em>`;
    users.forEach((user, i) => {
      chatUsers.textContent += ` ${user.name}`;
      if (users.length > 1 && i !== users.length - 1) {
        chatUsers.textContent += ",";
      }
    });
  }
}

function showRooms(rooms) {
  chatRooms.textContent = "";
  if (rooms) {
    chatRooms.innerHTML = "<em>Active Rooms:</em>";
    rooms.forEach((room, i) => {
      chatRooms.textContent += ` ${room}`;
      if (rooms.length > 1 && i !== rooms.length - 1) {
        chatRooms.textContent += ",";
      }
    });
  }
}
