
const API_URL = 'https://notas-api-pcil.onrender.com';

const form = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const notesList = document.getElementById('notes-list');

let editingId = null;

async function fetchNotes() {
  const res = await fetch(API_URL);
  const notes = await res.json();
  notesList.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${note.title}</strong>
      <p>${note.content}</p>
      <button onclick="editNote('${note.id}', \`${note.title}\`, \`${note.content}\`)">
        <i class="fas fa-edit"></i> Editar
      </button>
      <button onclick="deleteNote('${note.id}')">
        <i class="fas fa-trash-alt"></i> Excluir
      </button>
    `;
    notesList.appendChild(li);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const note = {
    title: titleInput.value,
    content: contentInput.value,
  };

  if (editingId) {
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    showMessage("Nota atualizada com sucesso!");
    editingId = null;
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    showMessage("Nota criada com sucesso!");
  }

  form.reset();
  fetchNotes();
});

window.deleteNote = async id => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  showMessage("Nota excluída com sucesso!", "#f44336");
  fetchNotes();
};

window.editNote = (id, title, content) => {
  editingId = id;
  titleInput.value = title;
  contentInput.value = content;
};

function showMessage(msg, color = "#4caf50") {
  const div = document.createElement('div');
  div.textContent = msg;
  div.style.background = color;
  div.style.color = "white";
  div.style.padding = "10px";
  div.style.marginBottom = "10px";
  div.style.borderRadius = "6px";
  div.style.textAlign = "center";
  div.style.position = "fixed";
  div.style.top = "20px";
  div.style.left = "50%";
  div.style.transform = "translateX(-50%)";
  div.style.zIndex = "1000";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

fetchNotes();
