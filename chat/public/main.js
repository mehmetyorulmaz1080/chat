const socket = io();

const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messageTone = new Audio('/message-tone.mp3');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on('clients-total', (data) => {
  clientsTotal.innerText = `Toplam Müşteri: ${data}`;
});

function sendMessage() {
  if (messageInput.value === '') return;

  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };

  socket.emit('message', data);
  addMessageToUI(true, data);
  messageInput.value = '';
}

socket.on('chat-message', (data) => {
  messageTone.play();
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();

  // Yeni liste elemanı oluştur
  const li = document.createElement('li');
  li.classList.add(isOwnMessage ? 'message-right' : 'message-left');

  // Mesaj içerik elemanı oluştur
  const p = document.createElement('p');
  p.classList.add('message');
  p.innerHTML = `${data.message} <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>`;

  // Liste elemanına mesajı ekle
  li.appendChild(p);

  // Mesajı messageContainer'a ekle
  messageContainer.appendChild(li);

  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', () => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} mesaj yazıyor`,
  });
});

messageInput.addEventListener('keypress', () => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} mesaj yazıyor`,
  });
});

messageInput.addEventListener('blur', () => {
  socket.emit('feedback', {
    feedback: '',
  });
});

socket.on('feedback', (data) => {
  clearFeedback();

  // Yeni feedback elemanı oluştur
  const li = document.createElement('li');
  li.classList.add('message-feedback');

  const p = document.createElement('p');
  p.classList.add('feedback');
  p.innerText = data.feedback;

  li.appendChild(p);
  messageContainer.appendChild(li);
});

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach((element) => {
    element.remove();
  });
}
