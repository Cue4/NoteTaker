const express = require('express');
const fs = require('fs');
const path = require('path');
const data = require('./Develop/db/db.json');
const PORT = 3001;
const app = express();
app.use(express.json());

 // Read the contents of the db.json file
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './Develop/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    fs.readFile(path.join(__dirname, './Develop/db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(newNote);
        });
    });
});

app.get('notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
);

app.get('db', (req, res) => res.json(data));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'));
  });


app.delete('/api/notes:id', async(req, res) => {
    const { id } = req.params;
    const result = await db.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tag not found' });
    }
    res.status(204).send();  
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);