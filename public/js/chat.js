const socket = io();

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
  nickname = localStorage.getItem("nickname");

let socketId;

socket.emit("login", nickname);

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (messageInput.value) {
    socket.emit("chat message", {
      message: messageInput.value,
      name: nickname,
    });
    messageInput.value = "";
  }
});

messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { name: nickname });
});

pvChatForm.addEventListener("submit", (e) => {
  console.log("mmd");
  e.preventDefault();

  socket.emit("pvChat", {
    message: pvMessageInput.value,
    name: nickname,
    to: socketId,
    from: socket.id,
  });

  $("#pvChat").modal("hide");
  pvMessageInput.value = "";
});

socket.on("online", (users) => {
  onlineUsers.innerHTML = "";

  for (const socketId in users) {
    onlineUsers.innerHTML += `
    <li>
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#pvChat"
      data-id=${socketId}
      data-client=${users[socketId]}
      ${users[socketId] === nickname ? "disabled" : ""}
    >
      ${users[socketId]}
    </button>
  </li>`;
  }
});

socket.on("chat message", (data) => {
  feedback.innerHTML = "";
  chatBox.innerHTML += `
  <li class="alert alert-light">
  <span class="text-dark font-weight-normal"
    >${data.name}</span
  >
  <span
    class="text-muted font-italic font-weight-light m-2 float-end"
    style="font-size: 9pt"
    >ساعت 12:00</span
  >
  <p class="alert alert-dark mt-2 text-dark">
    ${data.message}
  </p>
</li>`;
  // chatContainer.scrollTop =
  //   chatContainer.scrollHeight - chatContainer.clientHeight;
});

socket.on("typing", (data) => {
  feedback.innerHTML = `<p class="alert alert-warning w-25"><em>${data.name} در حال نوشتن است ... </em></p>`;
});

socket.on("pvChat", (data) => {
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
