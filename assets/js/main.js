if (window.location.pathname === "/chat") {
  function getUsers(cb) {
    io.socket.get("/users", function (body) {
      return cb(undefined, body);
    });
  }

  function getChatMessages(cb) {
    io.socket.get("/chatMessages", function (body) {
      return cb(undefined, body);
    });
  }

  getUsers(function (err, users) {
    if (err) console.log(err);

    console.log(users);

    let userList = document.querySelector(".users");

    users.forEach((user) => {
      let newUser = document.createElement("div");
      newUser.className = "user";

      let userImg = document.createElement("img");
      userImg.setAttribute("src", `/images/${user.imageFd}`);

      newUser.appendChild(userImg);

      let userName = document.createElement("p");
      userName.innerText = user.username;

      newUser.appendChild(userName);

      userList.appendChild(newUser);
    });
  });

  getChatMessages(function (err, messages) {
    if (err) console.log(err);

    console.log(messages);

    let messageList = document.querySelector(".msgs-msgs");

    messages.forEach((message) => {
      let newMessage = document.createElement("div");
      newMessage.className = "msg";

      let newMessageTop = document.createElement("p");

      let nmtImg = document.createElement("img");
      nmtImg.setAttribute("src", `/images/${message.createdBy.imageFd}`);
      newMessageTop.appendChild(nmtImg);

      let nmtSpanOne = document.createElement("span");
      nmtSpanOne.classList.add("text-primary");
      nmtSpanOne.classList.add("msg-top-name");
      nmtSpanOne.innerText = message.createdBy.username;
      newMessageTop.appendChild(nmtSpanOne);

      let nmtSpanTwo = document.createElement("span");
      nmtSpanTwo.classList.add("msg-top-date");
      nmtSpanTwo.id = "msg-top-date";
      nmtSpanTwo.innerText = new Date(message.createdAt).toLocaleString();
      newMessageTop.appendChild(nmtSpanTwo);

      newMessage.appendChild(newMessageTop);

      let newMessageDown = document.createElement("p");
      newMessageDown.innerText = message.text;
      newMessageDown.classList.add("msg-down");

      newMessage.appendChild(newMessageDown);

      messageList.appendChild(newMessage);
    });
  });

  io.socket.on("message", function (msg) {
    console.log(msg);

    let messageList = document.querySelector(".msgs-msgs");

    let newMessage = document.createElement("div");
    newMessage.className = "msg";

    let newMessageTop = document.createElement("p");

    let nmtImg = document.createElement("img");
    nmtImg.setAttribute("src", `/images/${msg.currentUser.imageFd}`);
    newMessageTop.appendChild(nmtImg);

    let nmtSpanOne = document.createElement("span");
    nmtSpanOne.classList.add("text-primary");
    nmtSpanOne.classList.add("msg-top-name");
    nmtSpanOne.innerText = msg.currentUser.username;
    newMessageTop.appendChild(nmtSpanOne);

    let nmtSpanTwo = document.createElement("span");
    nmtSpanTwo.classList.add("msg-top-date");
    nmtSpanTwo.id = "msg-top-date";
    nmtSpanTwo.innerText = new Date(msg.newMessage.createdAt).toLocaleString();

    newMessageTop.appendChild(nmtSpanTwo);

    newMessage.appendChild(newMessageTop);

    let newMessageDown = document.createElement("p");
    newMessageDown.innerText = msg.newMessage.text;
    newMessageDown.classList.add("msg-down");

    newMessage.appendChild(newMessageDown);

    messageList.appendChild(newMessage);
  });

  io.socket.on("newUser", function (user) {
    console.log(user);

    let userList = document.querySelector(".users");

    let newUser = document.createElement("div");
    newUser.className = "user";

    let userImg = document.createElement("img");
    userImg.setAttribute("src", `/images/${user.imageFd}`);

    newUser.appendChild(userImg);

    let userName = document.createElement("p");
    userName.innerText = user.username;

    newUser.appendChild(userName);

    userList.appendChild(newUser);
  });

  const msgForm = document.querySelector(".msgs-form");
  const msgInput = document.querySelector("#message");
  msgForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (msgInput.value.length < 1) {
      return;
    }

    const heading = document.querySelector("#heading");
    const userId = heading.getAttribute("data-id");

    io.socket.post(
      "/send",
      { message: msgInput.value, userId: userId },
      function (resData, jwRes) {
        console.log(123);
      }
    );
  });
}
