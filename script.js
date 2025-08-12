const serverURL = "https://script.google.com/macros/s/AKfycbyHEOaVdu60Tq48qzkyvrMveAm8zE4DI5IZRBfjCL9dS0HEHFTiRMJdiljsnkVYTbH_FA/exec";
let chatPassword = "";

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function login() {
  chatPassword = document.getElementById("password").value;
  fetch(serverURL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      password: chatPassword
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      document.getElementById("login").style.display = "none";
      document.getElementById("chat").style.display = "flex";
      loadMessages();
    } else {
      showNotification("Λάθος κωδικός!");
    }
  });
}

function loadMessages() {
  fetch(serverURL)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("messages");
      container.innerHTML = "";
      data.forEach(row => {
        let time = new Date(row[0]).toLocaleTimeString();
        container.innerHTML += `<div class="message"><b>${row[1]}</b>: ${row[2]} <small>${time}</small></div>`;
      });
      container.scrollTop = container.scrollHeight;
    });
}

function sendMessage() {
  const username = document.getElementById("username").value;
  const message = document.getElementById("message").value;
  
  if (!username) {
    showNotification("Παρακαλώ εισάγετε όνομα");
    return;
  }
  
  if (!message) {
    showNotification("Παρακαλώ εισάγετε μήνυμα");
    return;
  }
  
  fetch(serverURL, {
    method: "POST",
    body: JSON.stringify({
      password: chatPassword,
      username: username,
      message: message
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      document.getElementById("message").value = "";
      loadMessages();
    } else {
      showNotification("Λάθος κωδικός!");
    }
  });
}

setInterval(loadMessages, 2000);

// Emergency Delete Popup
document.querySelector(".delete-btn").addEventListener("click", () => {
  document.getElementById("deletePopup").style.display = "flex";
});

function closeDeletePopup() {
  document.getElementById("deletePopup").style.display = "none";
}

function confirmDelete() {
  const pass = document.getElementById("deletePassword").value;

  fetch(serverURL, {
    method: "POST",
    body: JSON.stringify({
      action: "emergencyDelete",
      password: pass
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      alert("Η συνομιλία διαγράφηκε, ο κωδικός άλλαξε και η συνομιλία κλειδώθηκε.");
      location.reload();
    } else {
      showNotification("Λάθος κωδικός!");
    }
    closeDeletePopup();
  });
}
