const socket = io();

//Query DOM
const messageInput = document.getElementById("messageInput"),
  chatForm = document.getElementById("chatForm"),
  chatBox = document.getElementById("chat-box"),
  feedback = document.getElementById("feedback"),
  nickname = localStorage.getItem("nickname");

// Emit Events
socket.emit("login", nickname);

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (messageInput.value) {
    socket.emit("chat message", {
      message: messageInput.value,
    });
    messageInput.value = "";
  }
});

messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { name: "Mr-RmZa" });
});

// Listening
socket.on("chat message", (data) => {
  feedback.innerHTML = "";
  chatBox.innerHTML += `
  <li class="alert alert-light">
  <span class="text-dark font-weight-normal" style="font-size: 13pt"
    >Mr-RmZa</span
  >
  <span
    class="text-muted font-italic font-weight-light m-2 float-end"
    style="font-size: 9pt"
    >ساعت 12:00</span
  >
  <p class="alert alert-dark mt-2">${data.message}</p>
</li>`;
});

socket.on("typing", (data) => {
  feedback.innerHTML = `<p class="alert alert-warning w-25"><em>${data.name} در حال نوشتن است ... </em></p>`;
});
