const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all notes
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM notes ORDER BY created_at DESC');
  res.json(result.rows);
});

// GET one note
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM notes WHERE id = $1', [id]);
  res.json(result.rows[0]);
});

// POST create note
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  const result = await db.query('INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *', [
    title,
    content,
  ]);
  res.status(201).json(result.rows[0]);
});

// PUT update note
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const result = await db.query(
    'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
    [title, content, id]
  );
  res.json(result.rows[0]);
});

// DELETE note
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM notes WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;
