const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const DB_PATH = './db.json';

// Função auxiliar para ler e salvar
function readNotes() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function saveNotes(notes) {
  fs.writeFileSync(DB_PATH, JSON.stringify(notes, null, 2));
}

// GET /notes – Listar todas
router.get('/', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// GET /notes/:id – Buscar por ID
router.get('/:id', (req, res) => {
  const notes = readNotes();
  const note = notes.find(n => n.id === req.params.id);
  if (note) res.json(note);
  else res.status(404).json({ error: 'Nota não encontrada' });
});

// POST /notes – Criar nova nota
router.post('/', (req, res) => {
  const notes = readNotes();
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    content: req.body.content
  };
  notes.push(newNote);
  saveNotes(notes);
  res.status(201).json(newNote);
});

// PUT /notes/:id – Atualizar nota
router.put('/:id', (req, res) => {
  let notes = readNotes();
  const index = notes.findIndex(n => n.id === req.params.id);
  if (index !== -1) {
    notes[index] = { id: req.params.id, ...req.body };
    saveNotes(notes);
    res.json(notes[index]);
  } else {
    res.status(404).json({ error: 'Nota não encontrada' });
  }
});

// DELETE /notes/:id – Excluir nota
router.delete('/:id', (req, res) => {
  let notes = readNotes();
  const newNotes = notes.filter(n => n.id !== req.params.id);
  if (newNotes.length === notes.length) {
    res.status(404).json({ error: 'Nota não encontrada' });
  } else {
    saveNotes(newNotes);
    res.status(204).end();
  }
});

module.exports = router;
