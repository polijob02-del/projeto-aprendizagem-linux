const express = require('express');
const multer = require('multer');
const cors  = require('cors');
const fs = require('fs');

const app = express()

app.use(cors());
app.use(express.json());

const stroage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: stroage })

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({
        message: "Aquivo enviado com sucesso",
        file: req.file

    })
})
    
app.get('/files', (req, res) => {
    const files = fs.readdirSync('uploads/');
    res.json(files);
})

app.get("/Download/:name", (req, res) => {
    const path = `uploads/${req.params.name}`;
    res.download(path);
})

app.delete("/Delete/:name", (req, res) => {
    const path = "/uploads/" + req.params.name
    fs.unlinkSync(path);
    res.json({
        message: "Arquivo deletado"
    })
})

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001")
})