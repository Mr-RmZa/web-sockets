const socket = io();
const chatNamespace = io("/chat");

//Query DOM
const messageInput = document.getElementById("messageInput"),
  chatForm = document.getElementById("chatForm"),
  chatBox = document.getElementById("chat-box"),
  feedback = document.getElementById("feedback"),
  onlineUsers = document.getElementById("online-users-list"),
  chatContainer = document.getElementById("chatContainer"),
  pvChatForm = document.getElementById("pvChatForm"),
  pvMessageInput = document.getElementById("pvMessageInput"),
  modalTitle = document.getElementById("modalTitle"),
  pvChatMessage = document.getElementById("pvChatMessage"),
  nickname = localStorage.getItem("nickname"),
  roomNumber = localStorage.getItem("chatroom");

let socketId;

chatNamespace.emit("login", { nickname, roomNumber });

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (messageInput.value) {
    chatNamespace.emit("chat message", {
      message: messageInput.value,
      name: nickname,
      roomNumber,
    });
    messageInput.value = "";
  }
});

messageInput.addEventListener("keypress", () => {
  chatNamespace.emit("typing", { name: nickname, roomNumber });
});

pvChatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  chatNamespace.emit("pvChat", {
    message: pvMessageInput.value,
    name: nickname,
    to: socketId,
    from: chatNamespace.id,
  });
  $("#pvChat").modal("hide");
  pvMessageInput.value = "";
});

chatNamespace.on("online", (users) => {
  onlineUsers.innerHTML = "";

  for (const socketId in users) {
    if (roomNumber === users[socketId].roomNumber) {
      onlineUsers.innerHTML += `
    <li>
    <button
      type="button"
      class="btn btn-light mx-2"
      data-bs-toggle="modal"
      data-bs-target="#pvChat"
      data-id=${socketId}
      data-client=${users[socketId].nickname}
      ${users[socketId].nickname === nickname ? "disabled" : ""}
    >
      ${users[socketId].nickname}
    </button>
  </li>`;
    }
  }
});

chatNamespace.on("chat message", (data) => {
  feedback.innerHTML = "";
  chatBox.innerHTML += `
  <li class="alert alert-light">
  <span class="text-dark font-weight-normal">${data.name}</span>
  <span
    class="text-muted font-italic font-weight-light m-2 float-end"
    style="font-size: 9pt"
    >ساعت 12:00</span
  >
  <p class="alert alert-dark mt-2 text-dark">${data.message}</p>
</li>`;
  // chatContainer.scrollTop =
  //   chatContainer.scrollHeight - chatContainer.clientHeight;
});

chatNamespace.on("typing", (data) => {
  if (roomNumber === data.roomNumber) {
    feedback.innerHTML = `<p class="alert alert-warning text-center"><em>${data.name} در حال نوشتن است ... </em></p>`;
    setTimeout(() => {
      feedback.innerHTML = "";
    }, 1000);
  }
});

chatNamespace.on("pvChat", (data) => {
  $("#pvChat").modal("show");
  socketId = data.from;
  modalTitle.innerHTML = "دریافت پیام از طرف : " + data.name;
  pvChatMessage.style.display = "block";
  pvChatMessage.innerHTML = data.name + " : " + data.message;
});

$("#pvChat").on("show.bs.modal", function (e) {
  var button = $(e.relatedTarget);
  var user = button.data("client");
  socketId = button.data("id");
  modalTitle.innerHTML = "ارسال پیام شخصی به :" + user;
  pvChatMessage.style.display = "none";
});
