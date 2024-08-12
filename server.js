const express = require('express');
const fs = require('fs');
const path = require('path');
const data = require('./db/db.json');
const {v4:uuidv4} = require("uuid")
const PORT = 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

 // Read the contents of the db.json file
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
 
        const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8' ))
        const newNote = {
            title:req.body.title, 
            text: req.body.text,
            id: uuidv4()
        };
        notes.push(newNote);
       fs.writeFileSync("./db/db.json", JSON.stringify(notes))
        res.json(notes);
         
});

app.delete('/api/notes/:id', async(req, res) => {
    try {
        const notesData = await JSON.parse (fs.readFileSync("./db/db.json", "utf8"))
        const filteredNotes = notesData.filter((note) => {
            return note.id !== req.params.id
        })
        fs.writeFileSync("./db/db.json", JSON.stringify(filteredNotes))
        res.status(200).json({message:"Note Deleted"})
    } catch (err) {
        res.status(500).json(err)
    }
})


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);