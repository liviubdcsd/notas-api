const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const DB_FILE = './db.json';

function readNotes() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeNotes(notes) {
  fs.writeFileSync(DB_FILE, JSON.stringify(notes, null, 2));
}

// GET all notes
router.get('/', (req, res) => {
  res.json(readNotes());
});

// GET one note
router.get('/:id', (req, res) => {
  const notes = readNotes();
  const note = notes.find(n => n.id === req.params.id);
  note ? res.json(note) : res.status(404).send('Not found');
});

// POST create note
router.post('/', (req, res) => {
  const notes = readNotes();
  const newNote = { id: uuidv4(), ...req.body };
  notes.push(newNote);
  writeNotes(notes);
  res.status(201).json(newNote);
});

// PUT update note
router.put('/:id', (req, res) => {
  let notes = readNotes();
  const index = notes.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).send('Not found');
  notes[index] = { id: req.params.id, ...req.body };
  writeNotes(notes);
  res.json(notes[index]);
});

// DELETE note
router.delete('/:id', (req, res) => {
  let notes = readNotes();
  notes = notes.filter(n => n.id !== req.params.id);
  writeNotes(notes);
  res.sendStatus(204);
});

module.exports = router;
