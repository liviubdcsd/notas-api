const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Listar todas as notas
app.get('/notes', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  res.json(data);
});

// Buscar nota por ID
app.get('/notes/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  const note = data.find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ error: 'Nota não encontrada' });
  res.json(note);
});

// Criar nova nota
app.post('/notes', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  const newNote = { id: uuidv4(), ...req.body };
  data.push(newNote);
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.status(201).json(newNote);
});

// Editar nota
app.put('/notes/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  const index = data.findIndex(n => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Nota não encontrada' });
  data[index] = { id: req.params.id, ...req.body };
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  res.json(data[index]);
});

// Excluir nota
app.delete('/notes/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  const newData = data.filter(n => n.id !== req.params.id);
  fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2));
  res.json({ message: 'Nota excluída com sucesso' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
